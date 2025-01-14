const mysql = require('mysql');

const myDB = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'beargear1',
});

module.exports=myDB