'use strict';
const mongoose = require('mongoose'),
    User = mongoose.model('user');

/**
 * Returns a promise for search results.
 *
 * @param search param.
*/
exports.search = (params) => {
    const promise = User.find(params).exec();
    return promise;
};

/**
 * Saves the new user object.
 *
 * @param user
*/
exports.save = (user) => {
    const newUser = new User(user);
    return newUser.save();
};

/**
 * Returns the user object by id.
 *
 * @param userId
*/
exports.get = (email) => {
    const userPromise = User.findOne({email}).exec();
    return userPromise;
};

/**
 * Updates an existing user item.
 *
 * @param updatedUser
*/
exports.update = (updatedUser) => {
    const promise = User.findByIdAndUpdate(updatedUser.id, updatedUser).exec();
    return promise;
};

/**
 * Deletes an existing user.
 *
 * @param userId
*/
exports.delete = (userId) => {
    const promise = User.findByIdAndRemove(userId).exec();
    return promise;
};