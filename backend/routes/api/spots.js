const express = require('express')

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { Spot, Review, ReviewImage, SpotImage, User, Booking, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require("sequelize")

const router = express.Router();

const validateSpot = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage("Street address is required"),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage("City is required"),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage("State is required"),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage("Country is required"),
    check('lat')
        .exists({ checkFalsy: true })
        .isNumeric()
        .withMessage("Latitude is not valid"),
    check('lng')
        .exists({ checkFalsy: true })
        .isNumeric()
        .withMessage("Longitude is not valid"),
    check('name')
        .exists({ checkFalsy: true })
        .isLength({ min: 1, max: 49 })
        .withMessage("Name must be less than 50 characters"),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage("Description is required"),
    check('price')
        .exists({ checkFalsy: true })
        .withMessage("Price per day is required"),
    handleValidationErrors
]

const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage("Review text is required"),
    check('stars')
        .exists({ checkFalsy: true })
        .isInt({ min: 1, max: 5 })
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
];

const endDateChecker = (date1, date2) => {
    const startDate = new Date(date1).getTime()
    const endDate = new Date(date2).getTime()
    if (startDate >= endDate) return false
    else return true
}

const bookingConflictChecker = (date1, date2, date3, date4) => {
    const currentStartDate = new Date(date1).getTime()
    const currentEndDate = new Date(date2).getTime()
    const dateCheckStartDate = new Date(date3).getTime()
    const dateCheckEndDate = new Date(date4).getTime()

    const errors = []
    if (currentStartDate >= dateCheckStartDate && currentStartDate <= dateCheckEndDate) {
        console.log("Start date is between the start date and end date of another booking!")
        errors.push("Start date conflicts with an existing booking")
    }
    if (currentEndDate >= dateCheckStartDate && currentEndDate <= dateCheckEndDate) {
        console.log("End date is between the start date and end date of another booking!")
        errors.push("End date conflicts with an existing booking")
    }
    return errors;
}

// ================================= GET ALL SPOTS =================================
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

// ============================== CREATE A SPOT =================================
router.post('/', requireAuth, validateSpot, async (req, res, next) => {
    const { address, city, state, country, lat, lng, name, description, price } = await req.body
    let err = new Error('Validation Error')
    err.errors = []

    const newSpot = Spot.build({
        address, city, state, country, lat, lng, name, description, price
    })
    ownerId = res.req.user.dataValues.id
    newSpot.ownerId = ownerId

    await newSpot.save()
    res.json(newSpot)

})

// ========================== GET ALL SPOTS OWNED BY THE CURRENT USER ======================
router.get('/current', requireAuth, async (req, res) => {
    const loggedInUserId = res.req.user.dataValues.id
    const loggedInUserSpots = await Spot.findAll({
        where: { ownerId: loggedInUserId }
    })
    //--------ADD previewImageUrl to response array---------//
    let spotsArr = []
    loggedInUserSpots.forEach(spot => { spotsArr.push(spot.toJSON()) })
    for (let spot of spotsArr) {
        const previewImage = await SpotImage.findOne({
            attributes: ["spotId", "url"],
            where: { preview: true, spotId: spot.id }
        })
        if (!previewImage) spot.previewImage = "No preview image url found!"
        else spot.previewImage = previewImage.toJSON().url
    }
    //--------ADD avgReview to response array---------//
    for (let spot of spotsArr) {
        const spotAvgRatings = await Review.findAll({
            where: { spotId: spot.id },
            attributes: ["spotId", [sequelize.fn("AVG", sequelize.col("stars")), "avgRating"]],
            group: "spotId"
        })
        // console.log(spotAvgRatings)
        if (spotAvgRatings.length === 0) {
            spot.avgRating = "No reviews for this spot yet!"
        } else {
            spot.avgRating = Number(spotAvgRatings[0].toJSON().avgRating)
        }
    }
    res.json({ "Spots": spotsArr })
})

// ======================= ADD AN IMAGE TO A SPOT BASED ON SPOT ID ==================
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    const spotId = Number(req.params.spotId)
    const { url, preview } = await req.body
    const spotIdCheck = await Spot.findOne({
        where: { id: spotId }
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
        where: { id: spotImageId }
    })
    res.json(spotImage)
})

// ================== Get details of a Spot from an id ===========================
router.get('/:spotId', async (req, res, next) => {
    const spotId = Number(req.params.spotId)
    const spotIdCheck = await Spot.findOne({
        where: { id: spotId }
    })
    if (spotIdCheck === null) {
        const err = new Error()
        err.message = "Spot couldn't be found";
        err.status = 404;
        err.statusCode = 404;
        return next(err)
    }
    const spotQuery = await Spot.findByPk(spotId)
    // console.log(spotImages)
    // get review data for the spot
    const spot = spotQuery.toJSON()
    // console.log(spot)
    const numberOfReviews = await Review.count({ where: { spotId } })
    spot.numReviews = numberOfReviews
    const reviewAvgQuery = await Review.findAll({
        where: { spotId },
        attributes: [[sequelize.fn("AVG", sequelize.col("stars")), "avgRating"]]
    })
    if (reviewAvgQuery.num === 0) spot.avgStarRating = "There is no review for this spot yet!"
    else spot.avgStarRating = Number(reviewAvgQuery[0].toJSON().avgRating)

    // Get all spot images for the spot
    const SpotImages = []
    const spotImages = await SpotImage.findAll({
        where: { spotId }
    })
    spotImages.forEach(spotImage => { SpotImages.push(spotImage.toJSON()) })
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

// ============================= Edit a Spot =====================================
router.put('/:spotId', requireAuth, validateSpot, async (req, res, next) => {
    const loggedInUserId = res.req.user.dataValues.id;
    const spotId = req.params.spotId;
    const currentSpot = await Spot.findByPk(spotId)
    if (currentSpot === null) {
        const err = new Error()
        err.message = "Spot couldn't be found";
        err.status = 404;
        err.statusCode = 404;
        return next(err)
    }

    if (currentSpot.toJSON().ownerId !== loggedInUserId) {
        const err = new Error()
        err.message = "Spot must belong to the current User"
        err.status = 401
        err.statusCode = 401
        return next(err)
    }

    const { address, city, state, country, lat, lng, name, description, price } = req.body
    let err = new Error('Validation Error')
    err.errors = []

    currentSpot.update({
        address, city, state, country, lat, lng, name, description, price
    })
    res.json(currentSpot)
})

// ===================== Create a Review for a Spot based on the Spot's id ==========
router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res, next) => {
    const loggedInUserId = res.req.user.dataValues.id
    const spotId = Number(req.params.spotId);
    const currentSpot = await Spot.findByPk(spotId)
    // Error response: Couldn't find a Spot with the specified id
    if (currentSpot === null) {
        const err = new Error()
        err.message = "Spot couldn't be found";
        err.status = 404;
        err.statusCode = 404;
        return next(err)
    }
    const { review, stars } = req.body;
    // Error Response: Body validation errors
    let err = new Error('Validation Error')
    err.errors = []
    if (!review || (stars < 1 || stars > 5)) {
        if (!review) err.errors.push("Review text is required")
        if (stars < 1 || stars > 5) err.errors.push("Stars must be an integer from 1 to 5")
        err.status = 400;
        err.statusCode = 400;
        return next(err)
    }

    // Error response: Review from the current user already exists for the Spot
    const userReviews = await Review.findAll({
        where: { userId: loggedInUserId },
    })
    let userReviewsArr = []
    userReviews.forEach(userReview => { userReviewsArr.push(userReview.toJSON()) })
    for (const userReview of userReviewsArr) {
        // console.log(spotId)
        if (userReview.spotId === spotId) {
            const err = new Error()
            err.message = "User already has a review for this spot",
                err.status = 403;
            err.statusCode = 403;
            return next(err)
        }
    }
    const newReview = Review.build({
        userId: loggedInUserId,
        spotId,
        review,
        stars
    })

    await newReview.save()

    res.json(newReview)
})


// ======================== Get all Reviews by a Spot's id ==================
router.get('/:spotId/reviews', async (req, res, next) => {
    const currentSpotId = req.params.spotId
    const unparsedReviewsArr = await Review.findAll({
        where: { spotId: currentSpotId },
        include: [
            { model: User, attributes: ["id", "firstName", "lastName"] },
            { model: ReviewImage }
        ]
    })
    if (unparsedReviewsArr.length === 0) {
        const err = new Error()
        err.message = "Spot couldn't be found",
            err.status = 404
        err.statusCode = 404
        return next(err)
    }
    const parsedReviewsArr = []
    unparsedReviewsArr.forEach(review => { parsedReviewsArr.push(review.toJSON()) })
    console.log(parsedReviewsArr)

    res.json({ Reviews: parsedReviewsArr })
})

// ================= Create a Booking from a Spot based on the Spot's id ==================
router.post('/:spotId/bookings', requireAuth, async (req, res, next) => {
    const spotId = Number(req.params.spotId)
    const loggedInUserId = res.req.user.dataValues.id

    const spotQuery = await Spot.findByPk(spotId)
    // console.log(spotQuery)
    // Error handler: Spot does not exist
    if (spotQuery === null) {
        const err = new Error()
        err.message = "Spot couldn't be found";
        err.status = 404;
        err.statusCode = 404;
        return next(err)
    }
    // Error handler: Spot must NOT belong to the current user
    if (spotQuery.dataValues.ownerId === loggedInUserId) {
        const err = new Error()
        err.status = 401;
        err.statusCode = 401;
        err.message = "This user is the owner and cannot make a booking here!"
        return next(err)
    }
    const { startDate, endDate } = req.body
    // console.log(`StartDate: ${startDate}    EndDate: ${endDate}`)
    const startDateJS = new Date(startDate)
    const endDateJS = new Date(endDate)
    // console.log("startDate: ", startDateJS)
    // console.log("endDate: ", endDateJS)
    // Error handler: End date must be after start date
    if (endDateChecker(startDate, endDate) === false) {
        const err = new Error()
        err.message = "Validation error"
        err.statusCode = 400;
        err.status = 400;
        err.errors = ["endDate cannot be on or before startDate"]
        return next(err)
    }
    // Error handler: There must not be a booking in this period
    const bookingQuery = await Booking.findAll({
        where: {
            spotId,
            startDate: {
                [Op.gte]: startDateJS
            }
        }
    })
    if (bookingQuery.length > 0) {
        for (let booking of bookingQuery) {
            const bookingErrors = bookingConflictChecker(startDate, endDate, booking.dataValues.startDate, booking.dataValues.endDate)

            if (bookingErrors.length > 0) {
                const err = new Error()
                err.message = "Sorry, this spot is already booked for the specified dates"
                err.status = 403;
                err.statusCode = 403;
                err.errors = bookingErrors;
                return next(err)
            }
        }
    }
    // Success Response
    const newBooking = await Booking.build({
        spotId, userId: loggedInUserId, startDate, endDate
    })
    await newBooking.save()

    res.json(newBooking)
})

//====================== Get all Bookings for a Spot based on the Spot's id ===========
router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
    const currentSpotId = Number(req.params.spotId)
    const loggedInUserId = res.req.user.dataValues.id

    const spotQueryTest = await Spot.findOne({
        where: {id: currentSpotId}
    })
    // Error if spot cannot be found
    if (spotQueryTest === null) {
        const err = new Error()
        err.message = "Spot couldn't be found";
        err.status = 404;
        err.statusCode = 404;
        return next(err)
    }

    const bookingResponseArr = []
    // Success if the one querying owns the spot
    if (spotQueryTest.dataValues.ownerId === loggedInUserId) {
        const spotQuery = await Booking.findAll({
            where: {spotId: currentSpotId},
            include: [
                {
                    model: User,
                    attributes: ["id", "firstName", "lastName"]
                }
            ],
            attributes: ["id", "spotId", "userId", "startDate", "endDate", "createdAt", "updatedAt"]
        })
        spotQuery.forEach(booking => {bookingResponseArr.push(booking.toJSON())})
    // Success if the one querying does not own the spot
    } else {
        const spotQuery = await Booking.findAll({
            where: {spotId: currentSpotId},
            attributes: ["spotId", "startDate", "endDate"]
        })
        spotQuery.forEach(booking => {bookingResponseArr.push(booking.toJSON())})
    }

    res.json({Bookings: bookingResponseArr})
})



module.exports = router;
