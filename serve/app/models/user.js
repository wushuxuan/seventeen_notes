'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Mongoose schema for user object.
 */
let UserSchema = new Schema({
    username: {
      type: String,
      required: 'username is missing'
    },
    password: {
      type: String,
      required: 'password is missing'
    },
    email: {
      type: String,
      required: 'email is missing'
    },
    phone: {
      type: String,
    },
    registerDate: {
      type: Date,
      default: Date.now
    },
    modifiedDate: {
      type: Date,
      default: Date.now
    },
    lastLoginTime: {
      type: Date
    }
},
{
    versionKey: false,
    timestamps: { createdAt: 'registerDate', updatedAt: 'modifiedDate' }
});
// Duplicate the id field as mongoose returns _id field instead of id.
UserSchema.virtual('uid').get(function(){
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
UserSchema.set('toJSON', {
    virtuals: true,
    transform: function (_, ret) {
        delete ret._id;
        delete ret.id;
    }
});
UserSchema.set('toObject', {
    virtuals: true,
    transform: function (_, ret) {
        delete ret._id;
        delete ret.id;
        // ret.registerDate = +ret.registerDate;
    }
});

module.exports = mongoose.model('user', UserSchema);