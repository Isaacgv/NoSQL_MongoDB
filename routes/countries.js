const express = require('express');
const router = express.Router()

const CountryModel = require('../models/Country')

//List all the countrys
router.get('/', async (request, response) => {
    const countries = await CountryModel.find();
    response.status(200).json(countries);
});

//Get Country by ID
router.get('/id/:id', async (request, response) => {
    const countryId = request.params.id;

    const countries = await CountryModel.findOne({
        _id: countryId
    });
    
    response.status(200).json(countries);
});

//Save Country
router.post('/', async (request, response) => {
    const {name, isoCode} = request.body

    const country = await CountryModel.create({
        name: name,
        isoCode
    });

    response.status(200).json(country);
});

//Delete Country by ID
router.delete('/:id', async (request, response) => {
    const countryId = request.params.id;

    await CountryModel.findOneAndDelete({
        _id: countryId
    });

    response.status(200).json({msg: 'Country well deleted !'});
});

//Update by id country
router.put('/:id', async (request, response) => {
    const countryId = request.params.id;
    const {name, isoCode, population} = request.body

    const country = await CountryModel.findOneAndUpdate({
        _id: countryId
    },{
        name,
        isoCode,
        population
    },{
        new: true
    });

    response.status(200).json(country);
});


//Question 1: Get all Country where a letter or word given is in the name
router.get('/search/:word', async (request, response) => {

    const searchWord = request.params.word
    // i for case insensitive
    const regex = new RegExp(searchWord, 'i') 

    const countries = await CountryModel.find({
        name : {$regex: regex}
    });
    
    response.status(200).json(countries);
});

//Question 6: Get all  the countries order by number of people first the less populated and las the mos populated
router.get('/population', async (request, response) => {

    const continents = await CountryModel.aggregate(
        [{  $sort:{"population":1 } }
        ])
    
    response.status(200).json(continents);
});

//Question 7: Get countries which haa a u in their name an more 100 000 people inside
router.get('/filter', async (request, response) => {

    const regex = new RegExp("u", 'i') 
    const continents = await CountryModel.aggregate(
        [{ $match:{"name": {$regex:"u", "$options": "i" }
                    }},
        {$match:{"population": {$gt: 100000} }}
        ])
    
    response.status(200).json(continents);
});


module.exports = router;

