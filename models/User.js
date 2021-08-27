const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    logs: [
        {
            description: {
                type: String,
                required: true,
                maxlength: 50,
            },
            duration: {
                type: Number,
                required: true,
            },
            date: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    count: {
        type: Number,
        default: function () {
            return this.logs.length;
        },
    },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
