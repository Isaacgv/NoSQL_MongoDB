require('dotenv').config();
const express = require('express');

require('./conf/database');
const countriesRoutes = require('./routes/countries');
const continentsRoutes = require('./routes/continents')

const app = express();
app.use(express.json());

app.use('/countries', countriesRoutes);
app.use('/continents', continentsRoutes);

app.get('/', (request, response) => {
    response.status(200).json({msg: "It works !"});
});

const port = 3300;

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});