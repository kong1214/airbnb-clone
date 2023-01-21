import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import * as reviewsActions from "../../store/reviews"
import ReviewCard from "./ReviewCard"
import "./ReviewsByUser.css"


function ReviewsByUser() {

    const dispatch = useDispatch()
    const history = useHistory()

    const sessionUser = useSelector(state => state.session.user);
    const data = useSelector(state => state.reviews.user)

    useEffect(() => {
        dispatch(reviewsActions.getReviewsByUser())
    }, [dispatch, sessionUser])

    if (Object.values(data).length === 0) {
        return (
            <div className="content-for-user-with-no-reviews">
                <div className="you-have-no-reviews-yet">
                    You have no reviews yet!
                </div>
                <div className="start-reviewing">
                    Start Reviewing!
                </div>
            </div>
        )
    }
    // console.log("data", data)
    const deleteHandler = (reviewId) => {
        return dispatch(reviewsActions.deleteOneReview(reviewId))
            .then((res) => {
                // history.push(`/`)
            })
    }

    const reviews = Object.values(data)
    return (
        <div className="reviews-by-user-container-with-header">
            <h1 className="reviews-by-user-header">Reviews</h1>
            <div className="reviews-by-user-container">
                {reviews.map(review => (
                    <div className="review-by-user-card-container" key={review.id}>
                        <ReviewCard review={review} />
                        <button onClick={() => deleteHandler(review.id)} className="delete-review-button">Delete Review</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ReviewsByUser
