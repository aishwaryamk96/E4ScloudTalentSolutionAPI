/**
 * Sequelize initialization module
 */
require('dotenv').config();
const Sequelize = require('sequelize');
const QueueFactory = require('../Factory/Queue');
const JobFactory = require('../Factory/Jobs');
const CompanyFactory = require('../Factory/Companies');

const dbCon = new Sequelize(process.env.DBNAME, process.env.DBUSERNAME, process.env.DBPASSWORD, {
    host: process.env.DBHOST,
    dialect: 'mysql',
    port: process.env.DB,
    pool: {
        max: 5,
        min: 0,
        idle: 100
    },
    dialectOptions:{
        // useUTC: true
    },
    timezone: '+00:00'
});

const QueueModel = QueueFactory(dbCon, Sequelize);
const JobModel = JobFactory(dbCon, Sequelize);
const CompanyModel = CompanyFactory(dbCon, Sequelize);

module.exports = {
    QueueModel,
    JobModel,
    CompanyModel,
    dbCon
};