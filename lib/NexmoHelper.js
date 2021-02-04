const Vonage = require('@vonage/server-sdk');
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

module.exports = {
    saveRecording
}