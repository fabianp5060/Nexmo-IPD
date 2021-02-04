const logger = require('../lib/logger').getLogger('QuestionService');
const questionModel = require('../model/QuestionModel')

const create = (record) => {
    return questionModel.create(record).catch(error => {
        logger.error(`QuestionService::create::error:${JSON.stringify(error, null, 2)}`)
    })
}

const getOne = (criteria) => {
    return questionModel.getOne(criteria).catch(error => {
        logger.error(`QuestionService::getOne::error:${JSON.stringify(error, null, 2)}`)
    })
}

const update = (criteria, record) => {
    return questionModel.update(criteria, record).catch(error => {
        logger.error(`QuestionService::update::error:${JSON.stringify(error, null, 2)}`)
    })
}

module.exports = {
    create,
    getOne,
    update
}