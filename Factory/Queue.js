'use strict';

// const Sequelize = require('sequelize');

module.exports = function(dbCon, Sequelize) {
    return dbCon.define('Queue', {
        queueId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        serviceType: Sequelize.STRING(100),
        payload: Sequelize.TEXT,
        actionId: Sequelize.INTEGER,
        actionType: Sequelize.STRING(100),
        status: Sequelize.BOOLEAN
    }, {
        freezeTableName: true
    });
};