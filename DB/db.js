const mysql = require('mysql');

const myDB = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'beargear',
});

module.exports=myDB