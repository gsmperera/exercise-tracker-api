const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const users = require('./routes/users');
const home = require('./routes/home');
console.log(process.cwd());
console.log(__dirname);

app.use(cors());
app.use('/', express.static(`${process.cwd()}/public`));
app.use('/api/users', express.urlencoded({ extended: false }));
app.use('/api/users', express.json());
app.use('/api/users', users);
app.use('/', home);

const port = process.env.PORT || 3000;

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('connected to mongodb...'))
    .catch(() => console.error('could not connect to mongodb...'));

const listener = app.listen(port, () => {
    console.log(`server is listening on port ${listener.address().port}`);
});
