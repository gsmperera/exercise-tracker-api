const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50,
        validate: {
            isAsync: true,
            validator: function (name, callback) {
                // checking whether username is already exist
                let numberOfSameUserName;
                User.find({ username: name }, (err, data) => {
                    if (err) return console.error(err.message);
                    numberOfSameUserName = data.length;
                    callback(numberOfSameUserName === 0);
                });
            },
            message: 'already exist',
        },
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
