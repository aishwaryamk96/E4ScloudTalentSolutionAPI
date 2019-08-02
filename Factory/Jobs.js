const constants = require('../config/constants');

module.exports = function(dbCon, Sequelize) {
    return dbCon.define('jobs', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        jobId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: true
        },
        googleJobId: Sequelize.STRING(100),
        status: {
            type: Sequelize.BOOLEAN,
            defaultValue: constants.ACTIVE
        }
    });

};