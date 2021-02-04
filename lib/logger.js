const getLogger = (category) => {
    const winston = require('winston');
    const winstonConfiguration = require('../config/winston-config')
    winston.loggers.add(category, winstonConfiguration.logConfiguration(category));
    return winston.loggers.get(category)
}

module.exports = {
    getLogger
}