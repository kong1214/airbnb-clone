import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as reviewsActions from "../../store/reviews"
import ReviewCard from "./ReviewCard"
import "./Reviews.css"

const ReviewsBySpot = ({spotId, numReviews}) => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(reviewsActions.getReviewsBySpot(spotId));
    }, [dispatch])

    const data = useSelector(state => state.reviews.spot)
    
    if (!data) {
        return null
    }

    const reviews = Object.values(data)
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
