const mysql= require('mysql');

let conn= mysql.createConnection({
    host:'34.133.24.116',
    user: 'root',
    password: 'mypassword',
    database: 'doodleDB'
});

conn.connect();

conn.query(`CREATE TABLE Doodle
            (
                name varchar(100),
                slot varchar(100)
            )
            ` 
            , (err,rows,fields) => {
                if (err)
                    console.log(err);
                else
                    console.log('Table Doodle Created');
            })

conn.end;


