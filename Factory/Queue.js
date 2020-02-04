'use strict';

// const Sequelize = require('sequelize');

module.exports = function(dbCon, Sequelize) {
    return dbCon.define('queue', {
        queueId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        serviceType: Sequelize.STRING(100),
        payload: Sequelize.TEXT,
        actionId: Sequelize.INTEGER,
        actionType: Sequelize.STRING(100),
        status: Sequelize.BOOLEAN,
        log: Sequelize.TEXT
    }, {
        freezeTableName: true
    });
};