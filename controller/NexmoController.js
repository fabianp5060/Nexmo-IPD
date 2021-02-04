const nccoBuilder = require('../lib/ncco');
const NexmoHelper = require('../lib/NexmoHelper')
const logger = require('../lib/logger').getLogger('NexmoController');

const IPDHelper = require('../lib/IPDHelper');
const questionService = require('../service/QuestionService')
const voiceMailHelper = require('../lib/VoiceMail')
const moment = require('../lib/moment')
const path = require('path');
require('dotenv').config();

const onAnswer = (request, response) => {

    const ncco = nccoBuilder.callStart(request)
    logger.info(`NexmoController::onAnswer::ncco: ${JSON.stringify(ncco, null, 2)}`)
    response.json(ncco)
}

const onEvent = async (request, response) => {
    let ncco;
    logger.info(`NexmoController::onEvent::request.query: ${JSON.stringify(request.query, null, 2)}`)
    logger.info(`NexmoController::onEvent::request.body: ${JSON.stringify(request.body, null, 2)}`)

    if (request.body.payload && request.body.payload.event == 'callStart') {
        ncco = nccoBuilder.pinInput(request)
    }

    if (request.query.input == 'pin') {
        let questionData = await questionService.getOne({ conversation_uuid: request.body.conversation_uuid })
        if (questionData) {
            await questionService.update({ conversation_uuid: request.body.conversation_uuid }, { pinCode: request.body.dtmf })
        }
        else {
            const record = {
                conversation_uuid: request.body.conversation_uuid,
                uuid: request.body.uuid,
                pinCode: request.body.dtmf,
                callerId: request.body.from
            }
            await questionService.create(record)
        }
        ncco = nccoBuilder.pinConfirm(request)
    }

    if (request.query.input == 'pinConfirm') {
        let questionData = await questionService.getOne({ conversation_uuid: request.body.conversation_uuid })
        logger.info(`NexmoController::onEvent::pinconfirm:User's PIN:${questionData.pinCode}`)
        if (request.body.dtmf === '1') {
            let isValidPin = true;
            if (await IPDHelper.checkValidPIN(questionData.pinCode)) {
                uuid = request.body.uuid;
                logger.info(`NexmoController::onEvent::pinconfirm:Call UUId:${uuid}`)
                ncco = nccoBuilder.customerNameInput(request, request.query.retryCount)
            }
            else {
                ncco = nccoBuilder.customerNameInput(request, request.query.retryCount)
                isValidPin = false
            }
            await questionService.update({ conversation_uuid: request.body.conversation_uuid }, { isValidPin: isValidPin })
        } else if (request.body.dtmf === '0') {
            ncco = nccoBuilder.pinInput(request)
        } else {
            ncco = nccoBuilder.callEnd(request)
        }
    }

    if (request.body.payload &&
        (request.body.payload.speechInput == 'customerName' || request.body.payload.speechInput == 'mothersMaidenName' ||
            request.body.payload.speechInput == 'address' || request.body.payload.speechInput == 'employerName' ||
            request.body.payload.speechInput == 'employerAddress')) {
        ncco = nccoBuilder.speechConfirm(request, request.body.payload.speechInput, request.query.retryCount)
    }

    if (request.query.input == 'speechConfirm') {
        if (request.body.dtmf == '1') {
            ncco = nccoBuilder.playRecording(request, request.query.retryCount);
        }
        else if (request.body.dtmf == '2') {
            request.query.retryCount = 0;
            ncco = await handleSpeech(request);
        }
        else if (request.body.dtmf == '3') {
            ncco = nccoBuilder.rerecordConfirm(request, request.query.speech)
        } else {
            logger.info(`NexmoController::onEvent::speechConfirm:Invalid DTMF:retryCount:${request.query.retryCount}`);
            if (request.query.retryCount == 0) {
                request.query.retryCount++;
                ncco = nccoBuilder[`${request.query.speech}Input`](request, request.query.retryCount)
            } else if (request.query.retryCount == 1) {
                request.query.retryCount = 0;
                if (moment.checkESTTime()) {
                    ncco = nccoBuilder.callConfirmWithDtmf(request, 'speech', request.query.speech, request.query.retryCount)
                }
                else {
                    ncco = await handleSpeech(request);
                }
            }

        }
    }

    if (request.query.input == 'bestNumber') {
        let questionData = await questionService.getOne({ conversation_uuid: request.body.conversation_uuid })
        if (questionData.isValidPin) {
            ncco = nccoBuilder.recentLoadApplicationInput(request, request.query.retryCount);
        }
        else {
            voiceMailHelper.sendVoiceMail(questionData.pinCode, path.join(__dirname, '../', `public/customerName_${request.body.conversation_uuid}.wav`), request.body.dtmf);
            ncco = nccoBuilder.callEnd(request)
        }
        await questionService.update({ conversation_uuid: request.body.conversation_uuid }, { contactPhoneNumber: request.body.dtmf })
    }

    checkDTMF: if (request.query.input == 'recentLoadApplication' || request.query.input == 'tradeIn' || request.query.input == 'new' || request.query.input == 'downpayment') {
        if (request.body.dtmf != '0' && request.body.dtmf != '1') {
            logger.info(`NexmoController::onEvent::checkDTMF: Invalid  DTMF retrycount Initial=${request.query.retryCount}`);

            if (request.query.retryCount == 0) {
                logger.info(`NexmoController::onEvent::checkDTMF: 0: retrycount=${request.query.retryCount} 0: input ${request.query.input}`);

                request.query.retryCount++;
                ncco = nccoBuilder[`${request.query.input}Input`](request, request.query.retryCount)
                break checkDTMF;
            } else if (request.query.retryCount == 1) {
                logger.info(`NexmoController::onEvent::checkDTMF: 1: retrycount=${request.query.retryCount} 1: input ${request.query.input}`);
                request.body.dtmf = 1;
                request.query.retryCount = 0;
                if (moment.checkESTTime()) {
                    ncco = nccoBuilder.callConfirmWithDtmf(request, 'dtmf', request.query.input, request.query.retryCount)
                }
                else {
                    ncco = await handleDtmf(request);
                }

            }
        } else {
            logger.info(`NexmoController::onEvent::checkDTMF: correctscenario: retrycount=${request.query.retryCount} correctscenario: input ${request.query.input}`);
            request.query.retryCount = 0;
            ncco = await handleDtmf(request);
        }
        logger.info(`NexmoController::onEvent::checkDTMF:Invalid User's DTMF retrycount Final: ${request.query.retryCount}`);

        await questionService.update({ conversation_uuid: request.body.conversation_uuid }, { [request.query.input]: request.body.dtmf })
    }
    checkShoppingTypeOfVehicle: if (request.query.input == 'shoppingTypeOfVehicle') {
        if (request.body.dtmf != '1' && request.body.dtmf != '2' && request.body.dtmf != '3' && request.body.dtmf != '4' && request.body.dtmf != '0') {
            logger.info(`NexmoController::onEvent::checkShoppingTypeOfVehicle: Invalid DTMF retrycount Initial=${request.query.retryCount}`);
            if (request.query.retryCount == 0) {
                request.query.retryCount++;
                ncco = nccoBuilder[`${request.query.input}Input`](request, request.query.retryCount)
                break checkShoppingTypeOfVehicle;
            } else if (request.query.retryCount == 1) {
                request.query.retryCount = 0;
                if (moment.checkESTTime()) {
                    ncco = nccoBuilder.callConfirmWithDtmf(request, 'dtmf', request.query.input, request.query.retryCout)
                }
                else {
                    ncco = await handleDtmf(request);
                }

            }
        } else {
            request.query.retryCount = 0;
            ncco = await handleDtmf(request);
        }
        logger.info(`NexmoController::onEvent::checkShoppingTypeOfVehicle:Invalid  DTMF retrycount Final: ${request.query.retryCount}`);
        logger.info(`NexmoController::onEvent::checkShoppingTypeOfVehicle:Invalid  DTMF : ${request.body.dtmf}`);

        let shoppingTypeOfVehicle = IPDHelper.generateShoppingTypeOfVehicle(request.body.dtmf)
        logger.info(`NexmoController::onEvent::checkShoppingTypeOfVehicle:shoppingTypeOfVehicle: ${request.query.retryCount}`);

        await questionService.update({ conversation_uuid: request.body.conversation_uuid }, { shoppingTypeOfVehicle: shoppingTypeOfVehicle })
    }


    if (request.query.input == 'isCreditAuthorization') {
        if (request.body.dtmf == '1') {
            ncco = nccoBuilder.mothersMaidenNameInput(request, request.query.retryCount)
        }
        else ncco = nccoBuilder.callEnd(request)
        let questionData = await questionService.getOne({ conversation_uuid: request.body.conversation_uuid })
        IPDHelper.postSurvey(questionData);
    }

    if (request.query.input == 'ssn') {
        let ssn = IPDHelper.generateSSN(request.body.dtmf)
        ncco = nccoBuilder.birthDateInput(request, request.query.retryCount)
        await questionService.update({ conversation_uuid: request.body.conversation_uuid }, { ssn: ssn })
    }

    if (request.query.input == 'birthDate') {
        ncco = nccoBuilder.addressInput(request, request.query.retryCount);
        await questionService.update({ conversation_uuid: request.body.conversation_uuid }, { birthDate: request.body.dtmf })
    }

    if (request.query.input == 'timeWithEmployer') {
        ncco = nccoBuilder.houseHoldIncomeInput(request, request.query.retryCount)
        await questionService.update({ conversation_uuid: request.body.conversation_uuid }, { timeWithEmployer: request.body.dtmf })
    }

    if (request.query.input == 'houseHoldIncome') {
        ncco = nccoBuilder.yearsAtAddressInput(request, request.query.retryCount)
        await questionService.update({ conversation_uuid: request.body.conversation_uuid }, { houseHoldIncome: request.body.dtmf })
    }

    if (request.query.input == 'yearsAtAddress') {
        ncco = nccoBuilder.employerPhoneInput(request, request.query.retryCount)
        await questionService.update({ conversation_uuid: request.body.conversation_uuid }, { yearsAtAddress: request.body.dtmf })
    }

    if (request.query.input == 'employerPhone') {

        await questionService.update({ conversation_uuid: request.body.conversation_uuid }, { employerPhone: request.body.dtmf })
        let questionData = await questionService.getOne({ conversation_uuid: request.body.conversation_uuid })
        IPDHelper.postCreditAuthorization(questionData);
        logger.info(`NexmoController::finalCallConfirm ::moment.checkESTTime(): ${moment.checkESTTime()}`);
        if (moment.checkESTTime()) {
            ncco = nccoBuilder.finalCallConfirm(request);
        }
        else {
            ncco = nccoBuilder.callEnd(request)
        }

    }
    if (request.query.input == 'finalCallConfirm') {

        if (request.body.dtmf == '1') {
            logger.info(`NexmoController::finalCallConfirm ::call connecting ${process.env.VCC_CONTACTPHONE}`);
            ncco = nccoBuilder.connectCall(request, process.env.VCC_CONTACTPHONE)
        } else {
            ncco = nccoBuilder.callEnd(request)
        }

    }

    if (request.query.event == 'callConfirmWithDtmf') {

        if (request.body.dtmf == '1') {
            logger.info(`NexmoController::callConfirmWithInvalidDtmf ::call connecting ${process.env.ERRORSCENARIOS_VCC_CONTACTPHONE}`);
            ncco = nccoBuilder.connectCall(request, process.env.ERRORSCENARIOS_VCC_CONTACTPHONE)
        } else if (request.body.dtmf != '1' && request.query.action == 'speech') {
            ncco = await handleSpeech(request);
        } else if (request.body.dtmf != '1' && request.query.action == 'dtmf') {
            ncco = await handleDtmf(request);
        }

    }



    if (request.body.payload && request.body.payload.rerecord) {

        if (request.body.payload.speech == 'customerName') ncco = nccoBuilder.customerNameInput(request, request.query.retryCount)
        if (request.body.payload.speech == 'mothersMaidenName') ncco = nccoBuilder.mothersMaidenNameInput(request, request.query.retryCount)
        if (request.body.payload.speech == 'address') ncco = nccoBuilder.addressInput(request, request.query.retryCount)
        if (request.body.payload.speech == 'employerName') ncco = nccoBuilder.employerNameInput(request, request.query.retryCount)
        if (request.body.payload.speech == 'employerAddress') ncco = nccoBuilder.employerAddressInput(request, request.query.retryCount)
    }

    if (request.body.recording_url) {
        NexmoHelper.saveRecording(request);
    }

    logger.info(`NexmoController::onEvent::ncco: ${JSON.stringify(ncco, null, 2)}`)
    response.json(ncco)
}
const handleSpeech = async (request) => {

    let questionData = await questionService.getOne({ conversation_uuid: request.body.conversation_uuid })
    let ipdFileName;
    let ipdMethod = 'CCAuthorization';
    logger.info(`NexmoController::OnEvent:: SpeechConfirm::handleSpeech retryCount: ${request.query.retryCount}`)

    if (request.query.speech == 'customerName') {
        ncco = nccoBuilder.bestNumberInput(request, request.query.retryCount);
        ipdFileName = 'Name'
        ipdMethod = 'Survey'
    }
    if (request.query.speech == 'mothersMaidenName') {
        ncco = nccoBuilder.ssnInput(request, request.query.retryCount)
        ipdFileName = 'MothersMaidenName'
    }
    if (request.query.speech == 'address') {
        ncco = nccoBuilder.employerNameInput(request, request.query.retryCount)
        ipdFileName = 'LeadAddress'
    }
    if (request.query.speech == 'employerName') {
        ncco = nccoBuilder.employerAddressInput(request, request.query.retryCount)
        ipdFileName = 'NameOfEmployer'
    }
    if (request.query.speech == 'employerAddress') {
        ncco = nccoBuilder.timeWithEmployerInput(request, request.query.retryCount)
        ipdFileName = 'EmployerAddress'
    }
    logger.info(`NexmoController:: handleSpeech:: PIN isValidPin: ${questionData.isValidPin}`);
    logger.info(`NexmoController:: handleSpeech:: IPD ftp-Filename: ${ipdFileName}`)
    logger.info(`NexmoController:: handleSpeech:: IPD ftp-ipdMethod: ${ipdMethod}`)

    if (questionData.isValidPin) IPDHelper.sendfTP(request, questionData.pinCode, ipdFileName, ipdMethod)
    return ncco;

}
const playSpeechInput = (request, response) => {
    logger.info('NexmoController:: playSpeechInput::request: ' + request.query.play + " && " + 'request.query.conversation_uuid' + request.query.conversation_uuid);
    logger.info(`NexmoController:: playSpeechInput::file path: ${path.join(__dirname, '../', `public/${request.query.play}_${request.query.conversation_uuid}.wav`)}`)
    response.sendFile(path.join(__dirname, '../', `public/${request.query.play}_${request.query.conversation_uuid}.wav`))
}
const handleDtmf = async (request) => {
    logger.info(`onEvent:: handleDtmf Method: retryCount: ${request.query.retryCount}`);
    logger.info(`NexmoController::onEvent::handleDtmf: retrycount=${request.query.retryCount}  input ${request.query.input}`);

    switch (request.query.input) {
        case 'recentLoadApplication':
            ncco = nccoBuilder.tradeInInput(request, 0);
            break;
        case 'tradeIn':
            ncco = nccoBuilder.newInput(request, 0);
            break;
        case 'new':
            ncco = nccoBuilder.downpaymentInput(request, 0);
            break;
        case 'downpayment':
            ncco = nccoBuilder.shoppingTypeOfVehicleInput(request, 0);
            break;
        case 'shoppingTypeOfVehicle':
            ncco = nccoBuilder.requestCreditAuthorization(request, 0);
            break;
    }
    return ncco;
}
module.exports = {
    onAnswer,
    onEvent,
    playSpeechInput
}