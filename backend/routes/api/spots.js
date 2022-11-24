const express = require('express')

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const spotimage = require('../../db/models/spotimage');

const router = express.Router();

// GET ALL SPOTS
router.get('/', async (req, res) => {
    const reviews = await Review.findAll({
        attributes: ['id', 'spotId', 'stars']
    })
    let reviewsObj = {}
    for (const review of reviews) {
        const { spotId, stars } = review
        if (!reviewsObj[spotId]) {
            reviewsObj[spotId] = {};
            reviewsObj[spotId].stars = stars
            reviewsObj[spotId].numberOfReviews = 1
            reviewsObj[spotId].averageStars = stars
        }
        else {
            reviewsObj[spotId].numberOfReviews += 1
            reviewsObj[spotId].stars += stars
            reviewsObj[spotId].averageStars = reviewsObj[spotId].stars / reviewsObj[spotId].numberOfReviews
        }
    }
    const reviewsObjSpotIds = Object.keys(reviewsObj)

    const previewImages = await SpotImage.findAll({
        where: {
            preview: true
        }
    })

    const spots = await Spot.findAll({
        attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat',
            'lng', 'name', 'description', 'price', 'createdAt', 'updatedAt'],
    })

    for (let spot of spots) {
        for (let reviewsObjSpotId of reviewsObjSpotIds) {
            if (spot.id === Number(reviewsObjSpotId)) {
                let currentReview = reviewsObj[reviewsObjSpotId]
                spot.dataValues.avgRating = currentReview.averageStars
            }
        }
        for (let previewImage of previewImages) {
            if (!spot.dataValues.previewImage) {
                spot.dataValues.previewImage = previewImage.dataValues.url
            }
        }
    }
    res.json({Spots: spots})
})

// CREATE A SPOT
router.post('/', requireAuth, async (req, res, next) => {
    const { address, city, state, country, lat, lng, name, description, price } = await req.body
    let err = new Error('Validation Error')
    err.errors = []
    if ( !address || !city || !state || !country || !lat || !lng
        || !description || !price || (name.length >= 50) ) {
            if (!address) err.errors.push("Street address is required")
            if (!city) err.errors.push("City is required")
            if (!state) err.errors.push("State is required")
            if (!country) err.errors.push("Country is required")
            if (!lat) err.errors.push("Latitude is required")
            if (!lng) err.errors.push("Longitude is required")
            if (name.length >= 50) err.errors.push("Name must be less than 50 characters")
            if (!description) err.errors.push("Description is required.")
            if (!price) err.errors.push("Price per day is required.")
            err.status = 400;
            return next(err)
        }

        newSpot = Spot.build({
            address, city, state, country, lat, lng, name, description, price
        })
        ownerId = res.req.user.dataValues.id
        newSpot.ownerId = ownerId

    await newSpot.save()
    res.json(newSpot)
})


module.exports = router;
