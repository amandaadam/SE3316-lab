const mysql= require('mysql');

function newConnection(){ 
    
    let conn= mysql.createConnection({
        host:'34.133.24.116',
        user: 'root',
        password: 'mypassword',
        database: 'doodleDB'
    });
    
    return conn;
}


module.exports = {newConnection: newConnection};
