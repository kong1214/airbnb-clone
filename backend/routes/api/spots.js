const express = require('express')

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { Spot, Review, SpotImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const spotimage = require('../../db/models/spotimage');

const router = express.Router();

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

module.exports = router;

