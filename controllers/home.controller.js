function homePage(request, response) {
    response.render('home', {
        pageTitle: 'Главная',
        title: 'Мои отпуска',
        login: request.session.login,
        btn: {
            link: '/vacation',
            title: 'Создать отпуск',
            icon: 'fa-plus',
            class: 'btn-success'
        },
        scripts: 'home.bundle'
    });
}

module.exports = { homePage };
