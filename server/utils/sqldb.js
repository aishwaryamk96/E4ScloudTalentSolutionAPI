/**
 * Sequelize initialization module
 */

'use strict';

const path = require('path');
//const config = require('../config/environment');
const Sequelize = require('sequelize');
const config = require('../config/environment/dbconnection');

var db = {
  Sequelize: Sequelize,
  //sequelize: new Sequelize(config.sequelize.db_name, config.sequelize.db_username)
    sequelize: new Sequelize(config.db_name, config.db_username, config.db_password, {
        host: config.db_host,
        dialect: 'mysql',

        pool: {
            max: 5,
            min: 0,
            idle: 100
        }


    })
};
module.exports = db;