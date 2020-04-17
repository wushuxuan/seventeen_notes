'use strict';

const userService = require('../services/user-service');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config');
/**
 * Sets response for user search.
 *
 * @param request
 * @param response
*/
exports.list = (request, response) => {
    const totalQuery = request.query.total;
    const params = {};
    if(totalQuery) {
        params.total = totalQuery
    };
    const promise = userService.search(params);
    const result = (users) => {
        response.status(200);
        response.json(users);
    };
    promise
        .then(result)
        .catch(renderErrorResponse(response));
};

/**
 * Creates a new user item and sets the response.
 *
 * @param request
 * @param response
*/
exports.save = (request, response) => {
    const user = Object.assign({}, request.body);
    const md5 = crypto.createHash('md5');
    user.password = md5.update(user.password).digest('hex');
    userService.search({ email: user.email })
        .then(u => {
            if (u && u.length > 0) {
                response.status(200);
                response.json({
                    errorCode: -1,
                    msg: 'The email is already registered'
                });
            } else {
                const result = (savedUser) => {
                    response.status(201);
                    response.json({ 
                        errorCode: 0,
                        data: savedUser.toObject()
                    });
                };
                const promise = userService.save(user);
                promise
                    .then(result)
                    .catch(renderErrorResponse(response));
            }
        })
        .catch(renderErrorResponse(response));
    
};

/**
 * Returns user response.
 *
 * @param request
 * @param response
*/
exports.get = (request, response) => {
    const userId = request.params.id;
    const result = (user) => {
        response.status(200);
        response.json(user);
    };
    const promise = userService.get(userId);
    promise
        .then(result)
        .catch(renderErrorResponse(response));
};

/**
 * User log in.
 *
 * @param request
 * @param response
*/
exports.login = (request, response) => {
    const email = request.body.email;
    const md5 = crypto.createHash('md5');
    const password = md5.update(request.body.password).digest('hex');
    const result = (r) => {
        
        if (r && r.length > 0) {
            const token = jwt.sign(request.body, config.secret, {
                expiresIn: 86400 // 1 day
            });
            response.status(200);
            response.json({
                errorCode: 0,
                token: token + '',
                data: r[0]
            });
        } else {
            response.status(401);
            response.json({
                errorCode: 401,
                msg: 'Auth failed'
            });
        }
    };
    const promise = userService.search({
        email: email,
        password: password,
    });
    promise
        .then(result)
        .catch(renderErrorResponse(response));
};

/**
 * Updates the user resource.
 *
 * @param request
 * @param response
*/
exports.update = (request, response) => {
    const userId = request.params.id;
    const updatedUser = Object.assign({}, request.body);
    updatedUser.id = userId;
    const result = (user) => {
        response.status(200);
        response.json(user);
    };
    const promise = userService.update(updatedUser);
    promise
        .then(result)
        .catch(renderErrorResponse(response));
};

/**
 * Deletes an user resource.
 *
 * @param request
 * @param response
*/
exports.delete = (request, response) => {
    const userId = request.params.id;
    const result = () => {
        response.status(200);
        response.json({
            message: "Successfully Deleted."
        });
    };
    const promise = userService.delete(userId);
    promise
        .then(result)
        .catch(renderErrorResponse(response));
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