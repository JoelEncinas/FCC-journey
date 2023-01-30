const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv/config');

// import routes
const postsRoute = require('./routes/posts');

app.use('/posts', postsRoute);

// routes
app.get('/', (req, res) => {
    res.send('We are on home');
});

// connect to db
// mongoose setting to avoid deprecated warning
mongoose.set('strictQuery', true);
mongoose.connect(process.env.DB_CONNECTION, () => {
    console.log('connected to db...');
});

// start listening to the server
app.listen(3000);
