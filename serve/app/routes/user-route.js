'use strict';

const userController = require('../controllers/user-controller');

module.exports = (app) => {
    app.route('/users')
        .get(userController.list);

    app.route('/user/register')
        .post(userController.save);

    app.route('/user/login')
        .post(userController.login);

    app.route('/users/:id')
        .get(userController.get)
        .put(userController.update)
        .delete(userController.delete);
};