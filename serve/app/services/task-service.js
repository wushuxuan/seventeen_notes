'use strict';
const mongoose = require('mongoose'),
    Task = mongoose.model('task');

/**
 * Returns a promise for search results.
 *
 * @param search param.
*/
exports.search = (params) => {
    const { keyword, email } = params;
    let promise;
    if (keyword) {
        const keywordFilters = [
            {
                title: {
                    $regex: new RegExp('.*' + keyword.toLowerCase() + '.*', "i")
                },
            },
            {
                description: {
                    $regex: new RegExp('.*' + keyword.toLowerCase() + '.*', "i")
                },
            },
            {
                creator: {
                    $regex: new RegExp('.*' + keyword.toLowerCase() + '.*', "i")
                },
            },
            {
                place: {
                    $regex: new RegExp('.*' + keyword.toLowerCase() + '.*', "i")
                },
            },
        ];
        promise = Task.find({
            $or: [
                {
                    $and: [
                        {
                            $or: keywordFilters
                        },
                        {
                            creatorEmail: email
                        }
                    ]
                },
                {
                    $and: [
                        {
                            $or: keywordFilters
                        },
                        {
                            public: true
                        }
                    ]
                }
            ]
        }).exec();
        
    } else {
        promise = Task.find({ $or: [
            {
                creatorEmail: email
            },
            {
                public: true
            }
        ] }).exec();
    }
    return promise;
    
};

/**
 * Saves the new task object.
 *
 * @param task
*/
exports.save = (task) => {
    const newTask = new Task(task);
    return newTask.save();
};

/**
 * Returns the task object by id and email.
 *
 * @param taskId
*/
exports.getByIdEmail = (params) => {
    const { taskId, email } = params;
    const taskPromise = Task.findOne({ 
        $or: [
            {
                _id: taskId, 
                creatorEmail: email
            },
            {
                _id: taskId,
                public: true
            }
        ]
     }).exec();
    return taskPromise;
};

/**
 * Returns the task object by id.
 *
 * @param taskId
*/
exports.getById = (params) => {
    const { taskId } = params;
    const taskPromise = Task.findById(taskId).exec();
    return taskPromise;
};

/**
 * Returns the tasks object by date.
 *
 * @param taskId
*/
exports.oneDay = (params) => {
    const { day, email } = params;
    const st = +new Date(day + ' 00:00:00');
    const et = +new Date(day + ' 23:59:59'); 
    const taskPromise = Task.find({
        $and: [
            {
                $nor: [
                    {
                        'startTime': {
                            '$gt': et
                        }
                    },
                    {
                        'endTime': {
                            '$lt': st
                        }
                    }
                ]
            },
            {
                creatorEmail: email
            }
        ]
    }).exec();
    return taskPromise;
};

/**
 * Updates an existing task item.
 *
 * @param updatedTask
*/
exports.update = (updatedTask) => {
    const promise = Task.findByIdAndUpdate(updatedTask.id, updatedTask).exec();
    return promise;
};

/**
 * Deletes an existing task.
 *
 * @param taskId
*/
exports.delete = (taskId) => {
    const promise = Task.findByIdAndRemove(taskId).exec();
    return promise;
};