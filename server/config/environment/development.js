'use strict';

module.exports.env = {
    mode : 'local' //set this to work with any environment mentioned below
};
// Database  specific configuration
module.exports.connections = {
//local db configuration
    local : {
        db_name: 'e4sgsdk',
        db_username: 'root',
        db_password: '',
        db_host: '127.0.0.1',
        db_port: 3306,
        _dialect: 'mysql'       
    },   
//production db configuration
    prod : {
        db_name: 'e4s',
        db_username: 'root',
        db_password: 'root',
        db_host: 'localhost',
        db_port: 3306,
        db_dialect: 'mysql'        
    },
  // Seed database on startup
  seedDB: true

};


