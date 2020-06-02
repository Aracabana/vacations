function getPage(request, response) {
    response.render('home', {
        pageTitle: 'Главная',
        title: 'Мои отпуска',
        login: request.session.login,
        btn: {
            link: '/vacation',
            title: 'Создать отпуск',
            class: 'btn-success'
        },
        script: 'home'
    });
}

module.exports = { getPage };
