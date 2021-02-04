const logger = require('../lib/logger').getLogger('IpdController');
const ftp = require('basic-ftp');
require('dotenv').config()

const wavfileTranfer = async (req, res) => {
    logger.info(`IpdController:: wavfileTranfer`)
    const client = new ftp.Client();
    client.ftp.verbose = true;
    await client.access({
        host: process.env.FTP_HOSTNAME,
        user: process.env.FTP_USERNAME,
        password: process.env.FTP_PASSWORD
    })
    logger.info(`IpdController:: wavfileTranfer::FTPclient: ` + await client.list())
    logger.info(`IpdController::wavfileTranfer::req.query.speechInput: ${req.query.speechInput}`)
    logger.info(`IpdController::wavfileTranfer::req.query.conversation_uuid: ${req.query.conversation_uuid}`)
    logger.info(`IpdController::wavfileTranfer::req.query.ipdMethod:  ${req.query.ipdMethod}`)
    logger.info(`IpdController::wavfileTranfer::req.query.pinCode: ${req.query.pinCode}`)
    logger.info(`IpdController::wavfileTranfer::req.query.ipdFileName: ${req.query.ipdFileName}`)
    await client.uploadFrom(`./public/${req.query.speechInput}_${req.query.conversation_uuid}.wav`, `/${req.query.ipdMethod}/${req.query.pinCode}_${req.query.ipdFileName}.wav`);

    client.close();
    res.send('posted WavFile');
}


module.exports = {
    wavfileTranfer
}