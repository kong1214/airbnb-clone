const express = require('express')

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { Spot, Review, ReviewImage, SpotImage, User, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const spotimage = require('../../db/models/spotimage');
const { Op } = require("sequelize")

const router = express.Router();

// Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
    const loggedInUserId = res.req.user.dataValues.id;
    const currentReviewId = req.params.reviewId
    const reviewChecker = await Review.findOne({
        where: {id: currentReviewId},
        include: [{model: ReviewImage}]
    })
    if (!reviewChecker) {
        const err = new Error()
        err.message = "Review couldn't be found"
        err.statusCode = 404;
        err.status = 404
        return next(err)
    }
    const parsedReviewCheckerArr = reviewChecker.toJSON();
    console.log(parsedReviewCheckerArr)
    if (parsedReviewCheckerArr.ReviewImages.length >= 10) {
        const err = new Error()
        err.message = "Maximum number of images for this resource was reached."
        err.status = 403;
        err.statusCode = 403;
        return next(err)
    }

    const { url } = req.body
    const newReviewImage = ReviewImage.build({
        reviewId: currentReviewId,
        url
    })
    await newReviewImage.save()
    const newReviewImageId = newReviewImage.toJSON().id;

    const newReviewImageRes = await ReviewImage.findByPk(newReviewImageId)

    res.json(newReviewImageRes)
})


module.exports = router;
