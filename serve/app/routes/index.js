'use strict';

const taskRoute = require('./task-route');
const userRoute = require('./user-route');

module.exports = (app) => {
    taskRoute(app);
    userRoute(app);
};