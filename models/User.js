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
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
