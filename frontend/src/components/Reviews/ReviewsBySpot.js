import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as reviewsActions from "../../store/reviews"
import ReviewCard from "./ReviewCard"
import "./Reviews.css"

const ReviewsBySpot = ({spotId, numReviews}) => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(reviewsActions.getReviewsBySpot(spotId));
        return () => dispatch(reviewsActions.clearReviews())
    }, [dispatch, spotId])

    const data = useSelector(state => state.reviews.spot)
    const reviews = Object.values(data)
    if (reviews.length === 0) {
        return null
    }
    return (
        <div className="reviews-container">
            <h2 className="reviews-header">Reviews</h2>
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
