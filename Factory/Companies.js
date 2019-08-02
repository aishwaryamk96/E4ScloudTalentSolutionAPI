const constants = require('../config/constants');

module.exports = function(dbCon, Sequelize) {
    return dbCon.define('companies', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        employerId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: true
        },
        googleCompanyId: Sequelize.STRING(100),
        status: {
            type: Sequelize.BOOLEAN,
            defaultValue: constants.ACTIVE
        }
    }, {timestamps: false});
};