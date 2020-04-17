'use strict';

const taskService = require('../services/task-service');
const userService = require('../services/user-service');

/**
 * Sets response for task search.
 *
 * @param request
 * @param response
*/
exports.list = (request, response) => {
    const email = request.email;
    const totalQuery = request.query.total;
    const params = {email};
    if(totalQuery) {
        params.total = totalQuery
    };
    const promise = taskService.search(params);
    const result = (tasks) => {
        response.status(200);
        response.json(tasks);
    };
    promise
        .then(result)
        .catch(renderErrorResponse(response));
};

exports.search = async (request, response) => {
    const email = request.email;
    try {
        const keyword = request.query.keyword;
        const tasks = await taskService.search({keyword, email});
        response.status(200);
        response.json(tasks);
    } catch (e) {
        renderErrorResponse(response);
    }
};

/**
 * Creates a new task item and sets the response.
 *
 * @param request
 * @param response
*/
exports.save = async (request, response) => {
    const email = request.email;
    try {
        const task = Object.assign({}, request.body);
        if (email) {
            task.creatorEmail = email;
        }
        const creator = await userService.get(task.creatorEmail);
        task.creator = creator.username;
        const savedTask = await taskService.save(task);
        response.status(201);
        response.json(savedTask);
    } catch (e) {
        renderErrorResponse(response);
    }
};

/**
 * Returns task response.
 *
 * @param request
 * @param response
*/
exports.get = (request, response) => {
    const email = request.email;
    const taskId = request.params.id;
    const result = (task) => {
        response.status(200);
        response.json(task);
    };
    const promise = taskService.getByIdEmail({ taskId, email });
    promise
        .then(result)
        .catch(renderErrorResponse(response));
};

/**
 * Returns the tasks response by date..
 *
 * @param request
 * @param response
*/
exports.oneDay = async (request, response) => {
    const email = request.email;
    try {
        const day = request.query.day;
        const tasks = await taskService.oneDay({day, email});
        response.status(200);
        response.json(tasks);
    } catch (e) {
        renderErrorResponse(response);
    }
};

/**
 * Updates the task resource.
 *
 * @param request
 * @param response
*/
exports.update = (request, response) => {
    const email = request.email;
    const taskId = request.params.id;
    const updatedTask = Object.assign({}, request.body);
    if (email) {
        updatedTask.creatorEmail = email;
    }
    updatedTask.id = taskId;
    const result = (task) => {
        response.status(200);
        response.json(task);
    };
    const promise = taskService.update(updatedTask);
    promise
        .then(result)
        .catch(renderErrorResponse(response));
};

/**
 * Deletes an task resource.
 *
 * @param request
 * @param response
*/
exports.delete = (request, response) => {
    const taskId = request.params.id;
    const result = () => {
        response.status(200);
        response.json({
            message: "Successfully Deleted."
        });
    };
    const promise = taskService.delete(taskId);
    promise
        .then(result)
        .catch(renderErrorResponse(response));
};

/**
 * Make comment on a public task item.
 *
 * @param request
 * @param response
*/
exports.comment = async (request, response) => {
    const taskId = request.params.id;
    const email = request.email || request.body.email;
    const comment = request.body.comment;
    try {
        const task = await taskService.getById({ taskId });
        if (!task.comments || task.comments.length === 0) {
            task.comments = [];
        } 
        task.comments.push({
            content: comment,
            commentBy: email,
            commentDate: +new Date
        });
        await task.save();
        response.status(200);
        response.json(task);
    } catch (e) {
        renderErrorResponse(response);
    }
};

/**
 * Throws error if error object is present.
 *
 * @param {Response} response The response object
 * @return {Function} The error handler function.
 */
let renderErrorResponse = (response) => {
    const errorCallback = (error) => {
        if (error) {
            response.status(500);
            response.json({
                message: error.message
            });
        }
    };
    return errorCallback;
};