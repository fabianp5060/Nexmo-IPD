const config = require('config')
let db_credentials = config.get('db_credentials');
let db_structure = config.get('db_struct');
const { Sequelize, Op } = require('sequelize');
const logger = require('../lib/logger').getLogger('db_settings')

const sequelize = new Sequelize(db_credentials.db, db_credentials.user, db_credentials.password, {
    host: db_structure.host,
    dialect: db_structure.dialect,
    operatorsAliases: db_structure.operatorsAliases,
    pool: db_structure.pool,
    logging: (query) => logger.info(`Query : ${query}`)
});

const db = {
    Sequelize: Sequelize,
    sequelize: sequelize,
    Op: Op
}

module.exports = db;