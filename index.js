const express               = require('express');
const cookieParser          = require('cookie-parser');
const bodyParser            = require('body-parser');
const access                = require('./routes/access');
const dotenv                = require('dotenv').config();
const mysql                 = require('mysql2');
const http                  = require('http');
const path                  = require('path');
const auth                  = require('./routes/auth');
const hbs                   = require('express-handlebars');
const {sqlConnection}       = require('./config');

const port = process.env.PORT || '8080';
const app = express(); // инициализация приложения

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

/*
    Устанавливает основные настройки для сервера.
    1. Указывает откуда брать статические файлы (css, js)
    2. Парсит куки с клиента, для работы с ними
    3. Парсит данные, которые приходят с клиента, для работы с ними.
 */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Парсит данные, которые приходят с клиента. Данные находятся в request.body
app.use(cookieParser('abcd')); // Парсит куки с клиента
app.use(express.static(path.join(__dirname, 'public'))); // Указываем приложению откуда брать статические файлы

/*
    Конфигурирует сервер для работы с шаблонизатором
    1. Указывает северу какой шаблонизатор использовать
    3. Устанавливает настройки для шаблонизатора.
 */
app.set('view engine', 'hbs');      // Указывает северу какой шаблонизатор использовать
app.set('views', 'view/pages');     // Меняет название дефолтной папки для страниц
app.engine( 'hbs', hbs({ // Устанавливает настройки для шаблонизатора
    extname: 'hbs',                             // расширение файлов
    defaultView: 'main',                        // стандартный шаблон, который используется по дефолту
    layoutsDir: __dirname + '/view/layouts/',   // шаблоны страниц
    partialsDir: __dirname + '/view/partials/'  // элементы страниц (header, footer и т.д.)
}));

/*
    Уставливает обработчики для всех путей в приложении
 */
app.use('/auth', auth);
app.get('/', access, function(request, response) { // Стартовая страница
    response.render('home', {
        title: 'Hello!'
    });
});


const server = http.createServer(app); // Создание сервера
server.listen(port, () => { // Запуск сервера
    console.log('Server has started at port: '+ port);
});
