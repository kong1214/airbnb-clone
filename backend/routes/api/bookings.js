const express = require('express')

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { Spot, Review, ReviewImage, SpotImage, User, Booking, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const spotimage = require('../../db/models/spotimage');
const { Op } = require("sequelize")

const router = express.Router();

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

// ======================== GET ALL CURRENT USER'S BOOKINGS =====================
router.get('/current', requireAuth, async (req, res) => {
    const loggedInUserId = res.req.user.dataValues.id
    const bookingsQuery = await Booking.findAll({
        where: {userId: loggedInUserId},
        attributes: ["id", "spotId", "userId", "startDate", "endDate", "createdAt", "updatedAt"],
        include: [
            {
                model: Spot,
                attributes:["id", "ownerId", "address", "city", "state", "country", "lat", "lng", "name", "price"],
            }
        ]
    })
    const parsedBookingsQuery = []
    bookingsQuery.forEach(booking => {parsedBookingsQuery.push(booking.toJSON())});

    for (let booking of parsedBookingsQuery) {
        const previewImageQuery = await SpotImage.findAll({
            where: {
                preview: true,
                spotId: booking.spotId
            },
            attributes: ["url"]
        })

        previewImageQuery.forEach(previewImage => {
            booking.Spot.previewImage = previewImage.dataValues.url
        })
    }

    res.json({Bookings: parsedBookingsQuery})
})

// =============================== Edit a Booking ==================================
router.put('/:bookingId', requireAuth, async (req, res, next) => {
    const currentBookingId = Number(req.params.bookingId)
    const loggedInUserId = res.req.user.dataValues.id

    const bookingQueryTest = await Booking.findOne({
        attributes: ["id", "spotId", "userId", "startDate", "endDate", "createdAt", "updatedAt"],
        where: {id: currentBookingId}
    })
    // console.log(`loggedInUserId: ${loggedInUserId}`)
    // console.log(bookingQueryTest.toJSON().userId)
    // console.log(bookingQueryTest.toJSON())
    // ERROR HANDLER if the booking does not exist
    if (bookingQueryTest === null) {
        const err = new Error()
        err.message = "Booking couldn't be found";
        err.status = 404;
        err.statusCode = 404;
        return next(err)
    }
    // ERROR HANDLER if the booking does not belong to the user
    if(bookingQueryTest.dataValues.userId !== loggedInUserId) {
        const err = new Error()
        err.message = "Booking must belong to the current User"
        err.status = 401
        err.statusCode = 401
        return next(err)
    }

    let todayMilliseconds = Date.now()
    const bookingEndDateJS = new Date(bookingQueryTest.dataValues.endDate).getTime()

    // ERROR HANDLER if the booking is past its end date
    if (todayMilliseconds > bookingEndDateJS) {
        const err = new Error()
        err.message = "Past bookings can't be modified"
        err.status = 403;
        err.statusCode = 403;
        return next (err)
    }

    const { startDate, endDate } = req.body

    // ERROR HANDLER for body validations
    if (endDateChecker(startDate, endDate) === false) {
        const err = new Error()
        err.message = "Validation error"
        err.statusCode = 400;
        err.status = 400;
        err.errors = ["endDate cannot be on or before startDate"]
        return next(err)
    }

    let today = new Date()

    bookingQueryTest.update({
        startDate, endDate
    })

    res.json(bookingQueryTest)
})



module.exports = router;
