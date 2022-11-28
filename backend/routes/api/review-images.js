const express = require('express')

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { Spot, Review, ReviewImage, SpotImage, User, Booking, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require("sequelize")

const router = express.Router();

router.delete('/:reviewImageId', requireAuth, async (req, res, next) => {
    const currentReviewImageId = Number(req.params.reviewImageId)
    const loggedInUserId = res.req.user.dataValues.id

    const reviewImageQueryTest = await ReviewImage.findOne({
        where: {id: currentReviewImageId},
        attributes: ["id", "reviewId"],
        include: [{model: Review}]
    })
    // ERROR HANDLER if the reviewImage doesn't exist
    if (reviewImageQueryTest === null) {
        const err = new Error()
        err.message = "Review image couldn't be found";
        err.status = 404;
        err.statusCode = 404;
        return next(err)
    }
    // ERROR HANDLER if the logged in user is not the owner of the review
    if (reviewImageQueryTest.dataValues.Review.dataValues.userId !== loggedInUserId)  {
        const err = new Error()
        err.message = "Review must belong to the current User"
        err.status = 401
        err.statusCode = 401
        return next(err)
    }

    await reviewImageQueryTest.destroy()
    res.json({message: "Successfully deleted"})
})


module.exports = router;
