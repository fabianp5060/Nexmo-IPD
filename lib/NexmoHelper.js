const Vonage = require('@vonage/server-sdk');
const fs = require('fs');
require('dotenv').config()

const logger = require('../lib/logger').getLogger('NexmoHelper')

const vonage = new Vonage({
    apiKey: process.env.VONAGE_API_KEY,
    apiSecret: process.env.VONAGE_API_SECRET,
    applicationId: process.env.VONAGE_APPLICATION_ID,
    privateKey: process.env.PRIVATE_KEY_PATH
}, { debug: true });

const saveRecording = (request) => {
    const conversation_uuid = request.body.conversation_uuid;
    logger.info(`NexmoHelper::saveRecording::request.query.recordName:${request.query.recordName}::request.body.recording_url:${request.body.recording_url}`)
    vonage.files.save(request.body.recording_url, `public/${request.query.recordName}_${conversation_uuid}` + '.wav', (err, res) => {
        if (err) {
            logger.error(`NexmoHelper::saveRecording::error:${err}`)
        }
        else {
            logger.info(`NexmoHelper::saveRecording::response:${res}`)
        }
    });
}

const moveRecording = (request, pinCode, ipdFileName, ipdMethod) => {
    logger.info(`NexmoHelper::moveRecording::request.query.recordName:${request.query.speech}::request.body.recording_url:${request.body.recording_url}`)
    const oldPath = new URL(`file:///${process.env.APP_ROOT_PATH}/public/${request.query.speechInput}_${conversation_uuid}.wav`);
    const newPath = new URL(`file:///${process.env.FTP_LOCAL_FOLDER}/${ipdMethod}/${pinCode}_${ipdFileName}.wav`);
    logger.info(`NexmoHelper::moveFile::fileDirs:${oldPath}\n${newPath}`);
    fs.rename(oldPath,newPath,function (err) {
        if (err) throw err
        logger.info(`NexmoHelper::moveFile: File Moved Successfully`)
    });
}

module.exports = {
    saveRecording,
    moveRecording
}