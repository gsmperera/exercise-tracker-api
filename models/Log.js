const mongoose = require('mongoose');
const { Schema } = mongoose;
const shortid = require('shortid');

const LogSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
        maxlength: [50, 'Description is too longer than 50 characters'],
    },
    duration: {
        type: Number,
        required: true,
        min: [1, 'Duration must be longer than 1 minute'],
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const Log = mongoose.model('Log', LogSchema);

module.exports = Log;
