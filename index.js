const express = require('express');
const http = require('http');
const hbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const access = require('./routes/access');
const auth = require('./routes/auth');
const cookieParser = require('cookie-parser');
const port = process.env.PORT || '8080';

const app = express(); // инициализация приложения
app.use(cookieParser('abcd'));
app.use(bodyParser.json()); // парсит данные, которые приходят с клиента. Данные находятся в request.body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // указываем приложению откуда брать статические файлы
app.set('views', 'view/pages'); // меняем название дефолтной папки для страниц
app.set('view engine', 'hbs'); // говорит серверу использовать шаблонизатор
app.engine( 'hbs', hbs({ // устанавливает настройки для шаблонизатора
    extname: 'hbs', // расширение файлов
    defaultView: 'main', // стандартный шаблон, который используется по дефолту
    layoutsDir: __dirname + '/view/layouts/', // шаблоны страниц
    partialsDir: __dirname + '/view/partials/' // элементы страниц (header, footer и т.д.)
}));
app.get('/', access, function(request, response) { // получаем стартовую страницу
    response.render('home', {
        title: 'Hello!'
    });
});
app.use('/auth', auth);



const server = http.createServer(app);
server.listen(port, () => {
    console.log('server has started');
});
