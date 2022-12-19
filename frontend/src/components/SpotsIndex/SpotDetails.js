import { useSelector, useDispatch } from "react-redux"
import { useParams, useHistory } from "react-router-dom"
import * as spotsActions from "../../store/spots"
import { useEffect, useState } from "react"
import OpenModalButton from "../OpenModalButton"
import EditSpotModal from "./EditSpotModal"
import ReviewsBySpot from "../Reviews/ReviewsBySpot"
import CreateReviewModal from "../Reviews/CreateReviewModal"
import "./SpotsIndex.css"
import "./SpotDetails.css"

const SpotDetails = ({ }) => {
    const history = useHistory()
    const { spotId } = useParams()
    const dispatch = useDispatch()
    const [spotIsLoaded, setSpotIsLoaded] = useState(false);


    useEffect(() => {
        dispatch(spotsActions.getOneSpot(Number(spotId))).then(() => setSpotIsLoaded(true));;
    }, [dispatch])


    const spot = useSelector(state => state.spots.singleSpot)
    const sessionUser = useSelector(state => state.session.user);

    if (spot.id === undefined) return null;
    // if(spot.SpotImages) return null
    let location
    if (spot.country === "United States of America") {
        location = `${spot.city}, ${spot.state}`
    } else location = `${spot.city}, ${spot.country}`

    let avgRating
    if (spot.numReviews === 0) {
        avgRating = "New"
    } else {
        const numAvgRating = Number(spot.avgStarRating)
        avgRating = numAvgRating.toFixed(2)
    }



    const deleteHandler = () => {
        return dispatch(spotsActions.deleteOneSpot(spotId))
            .then(history.push("/"))
    }

    let sessionLinks
    if (sessionUser) {
        sessionLinks = (
            <div className="session-links">
                <div className="create-a-review-button session-buttons">
                    <OpenModalButton
                        buttonText="Leave a Review"
                        modalComponent={<CreateReviewModal spotId={Number(spotId)} />} />
                </div>
                <div className="edit-this-spot-button session-buttons">
                    <OpenModalButton
                        buttonText="Edit this Spot"
                        modalComponent={<EditSpotModal spotId={Number(spotId)} />} />
                </div>
                <button
                    className="delete-this-spot-button session-buttons"
                    onClick={deleteHandler}>Delete this Spot
                </button>
            </div>
        )
    }

    return (
        <div>
            <h1>{`${spot.name}`}</h1>
            <div className="avg-rating-and-location-container">
                <div className="star-rating-container">
                    <i className="fa-solid fa-star"></i>
                    {`${avgRating} - ${spot.numReviews} reviews`}
                </div>
                <span className="spot-details-location-container">
                    {`${spot.city}, ${spot.state}, ${spot.country}`}
                </span>
            </div>
            <div className="spot-details-image-container">
                {spot.SpotImages &&
                    spot.SpotImages.map(spotImage => (
                        <img key={spotImage.id} className="spot-details-image" src={spotImage.url}></img>
                    ))}
            </div>
            <div className="spot-details-description-and-price">
                <div className="spot-details-description">{`${spot.description}`}</div>
                <div className="spot-details-price-container">
                    <span className="price">{`$${spot.price} `}</span>
                    <span className="night">night</span>
                </div>
            </div>
            <div className="buttons">
                {sessionLinks}
            </div>
            <div>
                {spotIsLoaded && <ReviewsBySpot spotId={spot.id} numReviews={spot.numReviews} />}
            </div>
        </div>
    )
}
export default SpotDetails
