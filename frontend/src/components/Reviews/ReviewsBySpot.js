import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as reviewsActions from "../../store/reviews"
import ReviewCard from "./ReviewCard"
import "./Reviews.css"

const ReviewsBySpot = ({spotId, numReviews, avgStars}) => {
    const dispatch = useDispatch()
    const [reviewIsLoaded, setReviewIsLoaded] = useState(false)


    useEffect(() => {
        dispatch(reviewsActions.getReviewsBySpot(spotId)).then(() => setReviewIsLoaded(true));
        return () => dispatch(reviewsActions.clearReviews())
    }, [dispatch, spotId, numReviews])

    const data = useSelector(state => state.reviews.spot)
    // console.log("reviews data", data)
    const reviews = Object.values(data)
    if (reviews.length === 0) {
        return null
    }
    return (
        <div className="reviews-container">
            <h2 className="reviews-header">
                <i className="fa-solid fa-star fa-xs"></i>
                {` ${avgStars} ~ ${numReviews} `} reviews
            </h2>
            <div className="review-cards-container">
                {reviews.map(review => (
                    <ReviewCard
                        review={review}
                        key={review.id} />
                ))}
            </div>
        </div>
    )
}

export default ReviewsBySpot
