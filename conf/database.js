const mongoose = require('mongoose');

//process.env.MONGO_URL

mongoose.connect(process.env.MONGO_URL, {}, (error) => {
    if (error) throw error;

    console.log('Connected to database !');
});