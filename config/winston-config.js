const winston = require('winston');
require('winston-daily-rotate-file');
const config = require('config')
const winston_transposrt = config.get('winston_logger')

var transport = new (winston.transports.DailyRotateFile)(winston_transposrt);

function logConfiguration(category) {
    return {
        transports: [
            transport
        ],
        format: winston.format.combine(
            winston.format.label({
                label: category
            }),
            winston.format.timestamp(),
            winston.format.printf((info) => {
                return `${info.timestamp} - ${info.label}:[${info.level}]: ${info.message}`;
            })
        )
    }
}
module.exports.logConfiguration = logConfiguration;