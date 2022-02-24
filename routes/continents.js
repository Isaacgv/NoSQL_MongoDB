const express = require('express');
const { MongoServerSelectionError } = require('mongodb');
const { default: mongoose } = require('mongoose');
const router = express.Router()


const ContinentModel = require('../models/Continent')
const CountryModel = require('../models/Country')

router.get('/', async (request, response) => {
    const continents = await ContinentModel.find().populate('countries');
    response.status(200).json(continents);
});

//Save Continent
router.post('/', async (request, response) => {
    const {name} = request.body

    const continent = await ContinentModel.create({
        name: name
    });

    response.status(200).json(continent);
});



//Link continent to contries
router.post('/:continentId/:countryId', async (request, response) => {
    const continentId = request.params.continentId;
    const countryId = request.params.countryId;
    const continent = mongoose.Types.ObjectId(continentId)

    const country = await CountryModel.findOneAndUpdate({
        _id: countryId
    },{
        continent
    },{
        new: true
    });

    const continentFind = await ContinentModel.findById({_id: continentId})
    continentFind.countries.push(countryId);
    await continentFind.save();

    response.status(200).json(continentFind);
});



//List of contients with thre number of countries
router.get('/numberCountries', async (request, response) => {
    
    const continents = await ContinentModel.aggregate(
        [{$project: { 
            count: { $size:"$countries" }
            }
        }])

    response.status(200).json(continents);
});

//Send back the fourth countries of a continrnt by alphabetic order
router.get('/sortCountries/:id', async (request, response) => {
    const continentId = mongoose.Types.ObjectId(request.params.id);
    const continents = await ContinentModel.aggregate(
        [{ $match: {_id : continentId}},
        { $unwind: '$countries' },
        { $project: { 
            "_id": 0 , "countries": 1 
            }
        },
        
        { $lookup: { 
            from: 'countries',
            localField: 'countries',
            foreignField: '_id',
            as: 'country'
            }
        },
        { $sort:{"country.name":1 }},
        { $limit: 4}
        ])

    response.status(200).json(continents);
});

module.exports = router;