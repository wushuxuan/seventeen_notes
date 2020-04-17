'use strict';

const taskController = require('../controllers/task-controller');

module.exports = (app) => {
    app.route('/tasks')
        .get(taskController.list)
        .post(taskController.save);

    app.route('/tasks/search')
        .get(taskController.search);
    
    app.route('/tasks/oneday')
        .get(taskController.oneDay);

    app.route('/tasks/:id')
        .get(taskController.get)
        .put(taskController.update)
        .delete(taskController.delete);
    app.route('/comment/:id')
        .post(taskController.comment);
};