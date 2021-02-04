const db = require('./db_settings')
const sequelize = db.sequelize;
const Sequelize = db.Sequelize;

let Question = sequelize.define(
    'question',
    {
        conversation_uuid: {type: Sequelize.STRING(64), allowNull: false, primaryKey: true},
        uuid: {type: Sequelize.STRING(64), allowNull: false},
        pinCode: {type: Sequelize.STRING(16), allowNull: false},
        isValidPin: {type: Sequelize.BOOLEAN, allowNull: true, defaultValue: null},
        callerId: {type: Sequelize.STRING(16), allowNull: true, defaultValue: null},
        contactPhoneNumber: {type: Sequelize.STRING(16), allowNull: true, defaultValue: null},
        recentLoadApplication: {type: Sequelize.BOOLEAN, allowNull: true, defaultValue: null},
        tradeIn: {type: Sequelize.BOOLEAN, allowNull: true, defaultValue: null},
        new: {type: Sequelize.BOOLEAN, allowNull: true, defaultValue: null},
        downpayment: {type: Sequelize.BOOLEAN, allowNull: true, defaultValue: null},
        shoppingTypeOfVehicle: {type: Sequelize.STRING(16), allowNull: true, defaultValue: null},
        ssn: {type: Sequelize.STRING(16), allowNull: true, defaultValue: null},
        birthDate: {type: Sequelize.STRING(16), allowNull: true, defaultValue: null},
        timeWithEmployer: {type: Sequelize.INTEGER, allowNull: true, defaultValue: null},
        houseHoldIncome: {type: Sequelize.INTEGER, allowNull: true, defaultValue: null},
        yearsAtAddress: {type: Sequelize.INTEGER, allowNull: true, defaultValue: null},
        employerPhone: {type: Sequelize.STRING(16), allowNull: true, defaultValue: null}
    },
    { timestamps: false }
)

const create = (record) => {
    return Question.create(record)
}

const update = (criteria, record) => {
    return Question.update(record, { where: criteria })
}

const getOne = (criteria) => {
    return Question.findOne({ where: criteria })
}

module.exports = {
    create,
    update,
    getOne
}