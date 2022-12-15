import { useSelector, useDispatch } from "react-redux"
import { useParams, useHistory } from "react-router-dom"
import * as spotsActions from "../../store/spots"
import { useEffect } from "react"
import OpenModalButton from "../OpenModalButton"
import EditSpotModal from "./EditSpotModal"
import "./SpotsIndex.css"

const SpotDetails = ({}) => {
    const history = useHistory()
    const { spotId } = useParams()
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(spotsActions.getOneSpot(Number(spotId)));
    }, [dispatch])

    const spot = useSelector(state => state.spots.singleSpot)
    if (spot.id === undefined) return null;

    if (spot.numReviews === 0) spot.avgStarRating = "New"
    let location
    if (spot.country === "United States of America"){
        location = `${spot.city}, ${spot.state}`
    } else location = `${spot.city}, ${spot.country}`

    const deleteHandler = () => {
        return dispatch(spotsActions.deleteOneSpot(spotId))
        .then(history.push("/"))
    }


    return (
        <div>
            <h1>{`${spot.name}`}</h1>
            <div>{`*star-icon*${spot.avgStarRating}`}</div>
            <div>{`${location}`}</div>
            <div className="spot-details-image-container">
                {spot.SpotImages.map(spotImage => (
                    <img key={spotImage.id} className="spot-details-image" src={spotImage.url}></img>
                ))}
            </div>
            <button className="reviews-button">Leave a Review</button>
          <OpenModalButton
          buttonText="Edit this Spot"
          modalComponent={<EditSpotModal />} />
          <button onClick={deleteHandler}>Delete this Spot</button>
        </div>
    )
 }
 export default SpotDetails
