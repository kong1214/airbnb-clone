import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom"
import * as reviewsActions from "../../store/reviews"
import * as spotsActions from "../../store/spots";
import "./ReviewModal.css"

function CreateReviewModal({spotId}) {
    const dispatch = useDispatch();
    const history = useHistory()
    const { closeModal } = useModal();

    const [stars, setStars] = useState("")
    const [review, setReview] = useState("")
    const [url, setUrl] = useState("")
    const [errors, setErrors] = useState([]);


    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([])
        return dispatch(reviewsActions.createReviewBySpot({
            review, stars, spotId, url
        }))
        .then((res) => {
          closeModal()
          return dispatch(spotsActions.getOneSpot(spotId))
        })
        .then((res) => history.push(`/spots/${res.id}`))
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        })
      };


    return (
        <>
            <h1 className="create-review-header">Leave Review</h1>
            <form onSubmit={handleSubmit} className="create-spot-form">
                <ul>{errors.map((error, idx) => <li key={idx}>{error}</li>)}</ul>
                <label>
                    <input
                        className="create-review-form-input"
                        placeholder="Description of Review"
                        type="text"
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        required
                    />
                </label>
                <label>
                    <input
                        className="create-review-form-input"
                        placeholder="Stars"
                        type="text"
                        value={stars}
                        onChange={(e) => setStars(e.target.value)}
                        required
                    />
                </label>
                <label>
                    <input
                        className="create-review-form-input"
                        placeholder="Image URL"
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        required
                    />
                </label>
                <button className="form-input button" type="submit">Create</button>
            </form>
        </>
    )
}

export default CreateReviewModal
