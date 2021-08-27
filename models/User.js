const mongoose = require('mongoose');
const { Schema } = mongoose;
const shortid = require('shortid');

const UserSchema = new Schema({
    _id: {
        type: String,
        default: shortid.generate,
    },
    username: {
        type: String,
        unique: true,
        required: true,
    },
    logs: [
        {
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
        },
    ],
    count: {
        type: Number,
    },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
