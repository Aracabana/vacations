const express               = require('express');
const dotenv                = require('dotenv').config();
const { homeController }    = require('./controllers');
const { v4: uuidv4 }        = require('uuid');
const cookieParser          = require('cookie-parser');
const bodyParser            = require('body-parser');
const session               = require('express-session');
const routes                = require('./routes');
const http                  = require('http');
const path                  = require('path');
const cors                  = require('cors');


const port = process.env.PORT || '8080';
const app = express(); // инициализация приложения

/*
    Устанавливает основные настройки для сервера.
    1. Указывает откуда брать статические файлы (css, js)
    2. Парсит куки с клиента, для работы с ними
    3. Парсит данные, которые приходят с клиента, для работы с ними.
 */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Парсит данные, которые приходят с клиента. Данные находятся в request.body
app.use(cookieParser(process.env.SESSION_SECRET_KEY)); // Парсит куки с клиента
app.use(express.static(path.join(__dirname, 'dist'))); // Указываем приложению откуда брать статические файлы

/*
    Устанавливает основные настройки для сессии
 */
app.use(session({
    genid: (req) => {
        return uuidv4();
    },
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 14 * 24 * 60 * 60 * 1000,
        secure: false,
        httpOnly: true
    }
}));
app.use(cors({
    credentials: true,
    origin: 'http://localhost:8080',
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
}));

/*
    Уставливает обработчики для всех путей в приложении
 */
app.use('/auth', routes.auth);
app.use('/vacation', routes.access, routes.vacation);
app.use('/api', routes.access, routes.api);
app.get('/404', function (request, response) {
    response.render('404');
});
// app.get('/', function(request, response) {
//     response.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
// });

const server = http.createServer(app); // Создание сервера
server.listen(port, () => { // Запуск сервера
    console.log('Server has started at port: '+ port);
});
