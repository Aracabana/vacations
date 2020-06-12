const path = require('path');


module.exports = {
    mode: "development",
    entry: {
        auth: './public/js/auth',
        home: './public/js/home',
        createVacation: './public/js/create-vacation',
        vacation: './public/js/vacation',
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, './public/js/dist')
    }
};