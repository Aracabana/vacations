const mysql           = require('mysql2');
const {sqlConnection} = require('./config');

/*
   Настраивает подключение к серверу MySql.
   Параметры подключения находятся в файле Config.js.
 */

const connection = mysql.createConnection(sqlConnection).promise(); // Создает строку подключения к базе данных

connection.connect() // Коннектится к базе данных. В случае неудачи выводит ошибку
    .then(res => {
        console.log('Подключение к серверу MySQL установлено');
    })
    .catch(err => {
        console.log(err);
    });

module.exports = connection;
