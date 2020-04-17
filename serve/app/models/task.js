'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Mongoose schema for task object.
 */
let TaskSchema = new Schema({
    title: {
      type: String,
      required: 'title is missing'
    },
    description: {
      type: String,
    },
    createdDate: {
      type: Date,
      default: Date.now
    },
    modifiedDate: {
      type: Date,
      default: Date.now
    },
    // isComplete: {
    //   type: Boolean,
    //   default: false
    // },
    // dueDate: {
    //   type: String,
    // },
    creator: {
      type: String,
      required: 'creator is missing'
    },
    creatorEmail: {
      type: String,
      required: 'creator\'s email is missing'
    },
    startTime: {
      type: Number
    },
    endTime: {
      type: Number
    },
    place: {
      type: String
    },
    public: {
      type: Boolean,
      default: false
    },
    comments: {
      type: Array,
      default: []
    }
},
{
    versionKey: false,
    timestamps: { createdAt: 'createdDate', updatedAt: 'modifiedDate' }
});
// Duplicate the id field as mongoose returns _id field instead of id.
TaskSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
TaskSchema.set('toJSON', {
    virtuals: true,
    transform: function (_, ret) {
      delete ret._id;
  }
});

module.exports = mongoose.model('task', TaskSchema);