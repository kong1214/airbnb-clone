import { useSelector, useDispatch } from "react-redux"
import { useParams, useHistory } from "react-router-dom"
import * as spotsActions from "../../store/spots"
import { useEffect, useState } from "react"
import OpenModalButton from "../OpenModalButton"
import EditSpotModal from "./EditSpotModal"
import ReviewsBySpot from "../Reviews/ReviewsBySpot"
import CreateReviewModal from "../Reviews/CreateReviewModal"
import "./SpotsIndex.css"

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
                <OpenModalButton
                    buttonText="Leave a Review"
                    modalComponent={<CreateReviewModal spotId={Number(spotId)}/>}/>
                <OpenModalButton
                    buttonText="Edit this Spot"
                    modalComponent={<EditSpotModal spotId={Number(spotId)} />} />
                <button onClick={deleteHandler}>Delete this Spot</button>
            </div>
        )
    }

    return (
        <div>
            <h1>{`${spot.name}`}</h1>
            <div className="star-rating-container">
                <i class="fa-solid fa-star"></i>
                {`${avgRating} - ${spot.numReviews} reviews`}
            </div>
            <div>{`${location}`}</div>
            <div className="spot-details-image-container">
                {spot.SpotImages &&
                spot.SpotImages.map(spotImage => (
                    <img key={spotImage.id} className="spot-details-image" src={spotImage.url}></img>
                ))}
            </div>
            <div className="spot-details-price-container">
                <span className="price">{`$${spot.price} `}</span>
                <span className="night">night</span>
            </div>
            <div>{`${spot.description}`}</div>
            <div className = "buttons">
                {sessionLinks}
            </div>
            <div>
                {spotIsLoaded && <ReviewsBySpot spotId={spot.id} numReviews={spot.numReviews}/>}
            </div>
        </div>
    )
}
export default SpotDetails
