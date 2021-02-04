const nodemailer = require('nodemailer');
require('dotenv').config()
const logger = require('../lib/logger').getLogger('VoiceMail');

const smtpTransport = nodemailer.createTransport({
    host: process.env.SMTPHOSTNAME,
    auth: {
        user: process.env.SMTPUSERNAME,
        pass: process.env.SMTPPASSWORD
    },
    secure: false
})

const from = process.env.VOICEMAIL_FROMADDRESS
const to = process.env.VOICEMAIL_TOADDRESS

function sendVoiceMail(pinCode, path, bestNumber) {
    logger.info('VoiceMail::sendVoiceMail:: filepath', path)
    let attachments = [{
        filename: 'Customer Name',
        path: path,
        contentType: 'audio/wav'
    }]
    let content = `<p>BestNumber: ${bestNumber}</p>` 
    const options = {
        from: from,
        to: to,
        subject: `IPD IVR Invalid PIN Notification - PinCode: ${pinCode}`,
        attachments: attachments,
        html: content
    }

    smtpTransport.sendMail(options, (error, response) => {
        if(error) logger.error('VoiceMail::sendVoiceMail:: Error: ',error);
        else logger.info(`VoiceMail::sendVoiceMail:: Message sent: ` , JSON.stringify(response));
        // shut down the connection pool, no more messages
        smtpTransport.close();
    })
}

module.exports = {
    sendVoiceMail
}