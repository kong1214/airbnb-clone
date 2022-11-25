const express = require('express')

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, User, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const spotimage = require('../../db/models/spotimage');
const { Op } = require("sequelize")

const router = express.Router();

// GET ALL SPOTS
router.get('/', async (req, res) => {
    const reviews = await Review.findAll({
        attributes: ['id', 'spotId', 'stars']
    })
    // Create a reviews object
    let reviewsObj = {}
    // For each entry in the total reviews array query
    for (const review of reviews) {
        const { spotId, stars } = review
        // if there is no review yet for the spotId, the stars will be set to the current review's stars
        if (!reviewsObj[spotId]) {
            reviewsObj[spotId] = {};
            reviewsObj[spotId].stars = stars
            reviewsObj[spotId].numberOfReviews = 1
            reviewsObj[spotId].averageStars = stars
        }
        // if there is a review already for this spotId, stars will concat
        else {
            reviewsObj[spotId].numberOfReviews += 1
            reviewsObj[spotId].stars += stars
            reviewsObj[spotId].averageStars = reviewsObj[spotId].stars / reviewsObj[spotId].numberOfReviews
        }
    }
    // Get all the spotIds into an array that have reviews
    const reviewsObjSpotIds = Object.keys(reviewsObj)

    // Query for all preview Images
    const previewImages = await SpotImage.findAll({
        where: {
            preview: true
        }
    })
    // Query for all spots
    const spots = await Spot.findAll({
        attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat',
            'lng', 'name', 'description', 'price', 'createdAt', 'updatedAt'],
    })

    // for each spot in the spots array query
    for (let spot of spots) {
        // for each SpotID in the array
        for (let reviewsObjSpotId of reviewsObjSpotIds) {
            // if id of the current spot is equal to the id of the review
            if (spot.id === Number(reviewsObjSpotId)) {
                //set avgRating of the spot to the avgRating of the currentReview
                let currentReview = reviewsObj[reviewsObjSpotId]
                spot.dataValues.avgRating = currentReview.averageStars
            }
        }
        // for each preview image of the preview image
        for (let previewImage of previewImages) {
            if (spot.id === previewImage.dataValues.spotId) {
                spot.dataValues.previewImage = previewImage.dataValues.url
            }
        }
    }
    res.json({ Spots: spots })
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
            err.statusCode = 400;
            return next(err)
        }

        const newSpot = Spot.build({
            address, city, state, country, lat, lng, name, description, price
        })
        ownerId = res.req.user.dataValues.id
        newSpot.ownerId = ownerId

    await newSpot.save()
    res.json(newSpot)

})

// GET ALL SPOTS OWNED BY THE CURRENT USER
router.get('/current', requireAuth, async (req, res) => {
    const loggedInUserId = res.req.user.dataValues.id
    const loggedInUserSpots = await Spot.findAll({
        where: { ownerId: loggedInUserId },
        include: [
            {
                model: SpotImage,
                where: { preview: true }
            },
        ]
    })
    //--------ADD previewImageUrl to response array---------//
    let spotsArr = []
    loggedInUserSpots.forEach(spot => { spotsArr.push(spot.toJSON()) })
    spotsArr.forEach(spot => {
        const imageUrl = spot.SpotImages[0].url
        delete spot.SpotImages
        spot.previewImage = imageUrl
        // console.log("spot", spot)
    })
    //--------ADD avgReview to response array---------//
    for (let spot of spotsArr) {
        const spotAvgRatings = await Review.findAll({
            where: { spotId: spot.id },
            attributes: ["spotId", [sequelize.fn("AVG", sequelize.col("stars")), "avgRating"]]
        })
        // console.log(spotAvgRatings)
        spotAvgRatings.forEach(spotAvgRating => {
            const avgRatingJSON = spotAvgRating.toJSON()
            // console.log(avgRatingJSON)
            const avgRating = Object.values(avgRatingJSON).find(value => avgRatingJSON.avgRating === value)
            // console.log(avgRating)
            if (avgRatingJSON.spotId === spot.id) spot.avgRating = avgRating
        })
    }

    res.json({"Spots": spotsArr})

})

// ADD AN IMAGE TO A SPOT BASED ON SPOT ID
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    const spotId = Number(req.params.spotId)
    const {url, preview} = await req.body
    const spotIdCheck = await Spot.findOne({
        where: {id: spotId}
    })
    if (spotIdCheck === null) {
        const err = new Error()
        err.message = "Spot couldn't be found";
        err.status = 404;
        err.statusCode = 404;
        return next(err)
    }

    const newSpotImage = SpotImage.build({
        spotId, url, preview
    })
    await newSpotImage.save()
    const spotImageId = newSpotImage.toJSON().id
    const spotImage = await SpotImage.findOne({
        where: {id: spotImageId}
    })
    res.json(spotImage)
})

// Get details of a Spot from an id
router.get('/:spotId', async (req, res, next) => {
    const spotId = Number(req.params.spotId)
    const spotIdCheck = await Spot.findOne({
        where: {id: spotId}
    })
    if (spotIdCheck === null) {
        const err = new Error()
        err.message = "Spot couldn't be found";
        err.status = 404;
        err.statusCode = 404;
        return next(err)
    }
    const spotQuery = await Spot.findByPk(spotId, {
        include: [
            {
                model: Review,
                attributes: [
                    [sequelize.fn("AVG", sequelize.col("stars")), "avgRating"]
                ]
            }
        ]
    })

    // console.log(spotImages)
    // get review data for the spot
    const spot = spotQuery.toJSON()

    const numberOfReviews = await Review.count({
        where: {spotId}
    })
    spot.avgStarRating = spot.Reviews[0].avgRating
    spot.numReviews = numberOfReviews
    delete spot.Reviews

    // Get all spot images for the spot
    const SpotImages = []
    const spotImages = await SpotImage.findAll({
        where: {spotId}
    })
    spotImages.forEach(spotImage => {SpotImages.push(spotImage.toJSON()) })
    spot.SpotImages = SpotImages;

    // Get owner data for the spot
    const ownerDataQuery = await User.findByPk(spot.ownerId, {
        attributes: ["id", "firstName", "lastName"]
    })
    const ownerData = ownerDataQuery.toJSON()
    // console.log(ownerData)
    spot.Owner = ownerData



    res.json(spot)
})




module.exports = router;



// ownerId = res.req.user.dataValues.id
// const ownerSpotsQuery = await Spot.findAll({
//     where: {ownerId},
// })

// const ownerSpotsArr = []
// for (const ownerSpot of ownerSpotsQuery) ownerSpotsArr.push(ownerSpot.toJSON())
// const ownerSpotIds = await Spot.findAll({
//     where: {ownerId},
//     attributes: ["id"]
// })
// let ownerSpotIdsArr = []
// for (const ownerSpotId of ownerSpotIds) ownerSpotIdsArr.push(Object.values(ownerSpotId.toJSON()))
// let spotIdsArr = []
// for (const ownerSpotIdArr of ownerSpotIdsArr) {
//     for (const ownerSpotId of ownerSpotIdArr) {spotIdsArr.push(ownerSpotId)}
// }

// const avgReviewOwnerSpotsArr = []
// const spotImagesArr = []
// for (const spotId of spotIdsArr) {
//     const avgReviewSpotArr = await Review.findAll({
//         where: {spotId},
//         attributes: [
//             "spotId", [sequelize.fn("AVG", sequelize.col("stars")), "avgRating"]
//         ]
//     })
//     for (const avgReview of avgReviewSpotArr) {avgReviewOwnerSpotsArr.push(avgReview.toJSON())}

//     const previewPicturesArr = await SpotImage.findAll({
//         where: {spotId},
//         attributes: ["spotId", "url"],
//         where: {preview: true}
//     })
//     for (const spotImage of previewPicturesArr) {spotImagesArr.push(spotImage.toJSON())}
// }

// for (const ownerSpot of ownerSpotsArr) {
//     for (const avgReview of avgReviewOwnerSpotsArr) {
//         if (ownerSpot.id === avgReview.spotId) ownerSpot.avgRating = avgReview.avgRating
//     }
//     for (let spotImage of spotImagesArr) {
//         if (ownerSpot.id === spotImage.spotId) ownerSpot.previewImage = spotImage.url
//     }
// }

// res.json({Spots: ownerSpotsArr})
