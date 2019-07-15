var dbConnect = require('../environment/development');
var config = dbConnect.connections[dbConnect.env.mode];

module.exports = config;