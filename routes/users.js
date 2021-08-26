const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ##### Create new user #####
router.post('/', async (req, res) => {
    const user = new User({
        username: req.body.username,
    });
    try {
        const createdUser = await user.save();
        console.log('new user was created successfuly!');
        res.json({ username: createdUser.username, _id: createdUser._id });
    } catch (ex) {
        console.error(ex.message);
        res.json({ error: ex.message });
    }
});

// ##### Get all users as an array #####
router.get('/', async (req, res) => {
    try {
        const availableUsers = await User.find().select({
            _id: 1,
            username: 1,
        });
        res.json(availableUsers);
    } catch (err) {
        console.error(err.message);
        res.json({ error: err.message });
    }
});

// ##### Post to /api/users/:_id/exercises with description, duration and optionaly date. #####
router.post('/:_id/exercises', async (req, res) => {
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
        const user = await User.findById(req.body.id);
        if (user) {
            updatedLogs = [...user.logs];
            updatedLogs.push(newSession);
        }
        const updatedUser = await User.findByIdAndUpdate(
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

// ##### Log user by id #####
router.get('/:_id/logs', async (req, res) => {
    const from = req.query.from;
    const fromDate = new Date(from);
    const to = req.query.to;
    const toDate = new Date(to);
    const limit = parseInt(req.query.limit);

    try {
        let user = await User.findOne({ _id: req.params._id });
        if (from) {
            user.logs = user.logs.filter((session) => {
                return session.date > fromDate;
            });
        }
        if (to) {
            user.logs = user.logs.filter((session) => {
                return session.date < toDate;
            });
        }
        if (limit) {
            user.logs = user.logs.slice(0, limit);
        }
        res.json(user.logs);
    } catch (ex) {
        console.error(ex.message);
        res.json({ error: ex.message });
    }
});

module.exports = router;
