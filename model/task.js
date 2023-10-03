const mongoose = require('mongoose');

const Schema = mongoose.Schema

const TaskSchema = new Schema({

    title: {

        type: String,

        unique: false,

        required: true,

    },
    body: {
        type: String,

        unique: false,

        required: false,

    },
    userId: {

      type: String,

      required: true
    },
    completed: {
        type: Boolean,

        default: false,
    }
})

const Task = mongoose.model('Task', TaskSchema)

module.exports = Task