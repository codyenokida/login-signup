const express = require('express');
const mongoose = require('mongoose');

const users = require('./routes/api/users')
const signin = require('./routes/api/signin')

const app = express();
app.use(express.json());

const db = require('./config/keys').mongoURI;

mongoose
    .connect(db)
    .then(() => console.log('Mongo Database has connected!'))
    .catch(err => console.log(err))

// User Routes
app.use('/api/users', users)
app.use('/api/account', signin)

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Port has started on Port ${port}`))

