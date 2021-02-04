const requestPromise = require('request-promise');
const { parseStringPromise } = require('xml2js')
require('dotenv').config();

const logger = require('../lib/logger').getLogger('IPDHelper');

const checkValidPIN = async (pinCode) => {
    const options = {
        url: `http://dmleadsplus.com/RingCentralRecordings.aspx`,
        qs: {
            MethodName: process.env.METHODNAME_CHECKVALIDPIN,
            mypass: process.env.MYPASS,
            PINCode: pinCode
        }
    };
    logger.info(`IPDHelper::checkValidPIN:Requestoptions : ${JSON.stringify(options, null, 2)}`)
    let checkValidPinResponse = await requestPromise.get(options);
    logger.info(`IPDHelper::checkValidPIN::CheckValidPinResponse: ${checkValidPinResponse}`);

    let parseCheckValidPinResponse = await parseStringPromise(checkValidPinResponse).catch(err => {
        logger.error(`IPDHelper::checkValidPIN::parseCheckValidPinResponse Error:${JSON.stringify(err, null, 2)}`);
    })
    logger.info(`IPDHelper::checkValidPIN::parseCheckValidPinResponse: ${JSON.stringify(parseCheckValidPinResponse, null, 2)}`)
    logger.info(`IPDHelper::checkValidPIN:: object: ${parseCheckValidPinResponse.action.parameters[0].p_t[0]}`)
    logger.info(`IPDHelper::checkValidPIN:: object checking: ${parseCheckValidPinResponse.action.parameters[0].p_t[0] === 'True'}`)
    if (parseCheckValidPinResponse.action.parameters[0].p_t[0] === 'True') {
        return true;
    }
    return false;
}

const postSurvey = async (questionData) => {
    const options = {
        url: `http://dmleadsplus.com/RingCentralRecordings.aspx`,
        qs: {
            MethodName: process.env.METHODNAME_POSTSURVEY,
            mypass: process.env.MYPASS,
            PINCode: questionData.pinCode,
            CallerID: questionData.callerId,
            ContactPhoneNumber: questionData.contactPhoneNumber,
            RecentLoadApplication: questionData.recentLoadApplication,
            TradeIn: questionData.tradeIn,
            New: questionData.new,
            Downpayment: questionData.downpayment,
            ShoppingTypeOfVehicle: questionData.shoppingTypeOfVehicle
        }
    };
    logger.info(`IPDHelper::postSurvey::Requestoptions: ${JSON.stringify(options, null, 2)}`)
    let postSurveyResponse = await requestPromise.post(options);
    logger.info(`IPDHelper::postSurvey:: postSurveyResponse: ${JSON.stringify(postSurveyResponse, null, 2)}`);
}


const postCreditAuthorization = async (questionData) => {
    const options = {
        url: `http://dmleadsplus.com/RingCentralRecordings.aspx`,
        qs: {
            MethodName: process.env.METHODNAME_POSTCREDITAUTHORIZATION,
            mypass: process.env.MYPASS,
            PINCode: questionData.pinCode,
            ssn: questionData.ssn,
            birthDate: questionData.birthDate,
            timeWithEmployer: questionData.timeWithEmployer,
            houseHoldIncome: questionData.houseHoldIncome,
            yearsAtAddress: questionData.yearsAtAddress,
            employerPhone: questionData.employerPhone
        }
    };
    logger.info(`IPDHelper::postCreditAuthorization:: options: ${JSON.stringify(options, null, 2)}`)
    let postCreditAuthorizationResponse = await requestPromise.post(options);
    logger.info(`IPDHelper::postCreditAuthorization:: postCreditAuthorizationResponse: ${JSON.stringify(postCreditAuthorizationResponse, null, 2)}`);
}

const sendfTP = async (request, pinCode, ipdFileName, ipdMethod) => {
    await requestPromise.get(`${request.protocol}://${request.get('host')}/wavfileTranfer?speechInput=${request.query.speech}&&conversation_uuid=${request.body.conversation_uuid}&&pinCode=${pinCode}&&ipdFileName=${ipdFileName}&&ipdMethod=${ipdMethod}`);
}

const generateSSN = (dtmf) => {
    let ssn = dtmf.split('');
    for (let index = 0; index < ssn.length; index++) {
        switch (ssn[index]) {
            case '1':
                ssn[index] = 'T'
                break;
            case '2':
                ssn[index] = 'U'
                break;
            case '3':
                ssn[index] = 'W'
                break;
            case '4':
                ssn[index] = 'V'
                break;
            case '5':
                ssn[index] = 'A'
                break;
            case '6':
                ssn[index] = 'C'
                break;
            case '7':
                ssn[index] = '1'
                break;
            case '8':
                ssn[index] = 'R'
                break;
            case '9':
                ssn[index] = 'P'
                break;
            default:
                ssn[index] = 'X'
        }
    }
    return ssn.join('')
}

const generateShoppingTypeOfVehicle = dtmf => {
    let shoppingTypeOfVehicle;


    switch (dtmf) {
        case '1':
            shoppingTypeOfVehicle = 'car'
            break;
        case '2':
            shoppingTypeOfVehicle = 'truck'
            break;
        case '3':
            shoppingTypeOfVehicle = 'suv'
            break;
        case '4':
            shoppingTypeOfVehicle = 'van'
            break;
        default:
            shoppingTypeOfVehicle = 'unknown'
    }
    return shoppingTypeOfVehicle;
}

module.exports = {
    checkValidPIN,
    postSurvey,
    postCreditAuthorization,
    sendfTP,
    generateSSN,
    generateShoppingTypeOfVehicle
};