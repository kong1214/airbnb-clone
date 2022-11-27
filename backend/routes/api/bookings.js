const express = require('express')

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { Spot, Review, ReviewImage, SpotImage, User, Booking, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const spotimage = require('../../db/models/spotimage');
const { Op } = require("sequelize")

const router = express.Router();


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
module.exports = router;


// include: [
//     {
//         model: SpotImage,
//         where: {
//             spotId: id,
//             preview: true
//         },
//         attributes: ["url"]
//     }
// ]
