// create express app
const express = require('express');
const app = express();

// import dotenv and configer
const dotenv = require('dotenv');
dotenv.config();

// import mongoose
const mongoose = require('mongoose');
const { Schema } = mongoose;

const port = process.env.PORT || 3000;

// connect to mongodb database
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('connected to mongodb...'))
    .catch(() => console.error('could not connect to mongodb...'));

const userSchema = new Schema({
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
                UserModel.find({ username: name }, (err, data) => {
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

const UserModel = mongoose.model('UserModel', userSchema);

app.use('/', express.static(`${__dirname}/public`));
app.use('/api/users', express.urlencoded({ extended: false }));
app.use('/api/users', express.json());

// home page
app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/views/index.html`);
});

// create new user
app.post('/api/users', async (req, res) => {
    const newUserDoc = new UserModel({
        username: req.body.username,
    });
    try {
        const createdUser = await newUserDoc.save();
        console.log('new user was created successfuly!');
        res.json({ username: createdUser.username, _id: createdUser._id });
    } catch (err) {
        console.error(err.message);
        res.json({ error: err.message });
    }
});

// get all users as an array
app.get('/api/users', async (req, res) => {
    try {
        const availableUsers = await UserModel.find();

        res.send(
            availableUsers.map((user) => ({
                _id: user._id,
                username: user.username,
            }))
        );
    } catch (err) {
        console.error(err.message);
        res.json({ error: err.message });
    }
});

// post to /api/users/:_id/exercises with description, duration and optionaly date.
app.post('/api/users/:_id/exercises', async (req, res) => {
    const newSession = {
        description: req.body.description,
        duration: req.body.duration,
    };

    if (req.body.date) {
        newSession.date = new Date(req.body.date);
    } else {
        newSession.date = new Date();
    }

    let updatedLogs = [newSession];

    try {
        const user = await UserModel.findById(req.body.id);
        if (user) {
            updatedLogs = [...user.logs];
            updatedLogs.push(newSession);
        }
        const updatedUser = await UserModel.findByIdAndUpdate(
            req.body.id,
            {
                logs: updatedLogs,
                $inc: { count: 1 },
            },
            { new: true }
        );
        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            date: newSession.date,
            duration: newSession.duration,
            description: newSession.description,
        });
    } catch (ex) {
        console.error(ex.message);
        res.json({ error: ex.message });
    }
});

// log user by id
app.get('/api/users/:_id/logs', async (req, res) => {
    try {
        const user = await UserModel.find({ _id: req.params._id });
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.json({ error: err.message });
    }
});

const listener = app.listen(port, () => {
    console.log(`server is listening on port ${listener.address().port}`);
});
