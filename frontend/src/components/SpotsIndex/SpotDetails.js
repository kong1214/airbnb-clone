import { useSelector, useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import * as spotsActions from "../../store/spots"
import { useEffect } from "react"
import "./SpotsIndex.css"

const SpotDetails = ({}) => {
    const { spotId } = useParams()
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(spotsActions.getOneSpot(Number(spotId)));
    }, [dispatch])

    const spot = useSelector(state => state.spots.spot)
    if (!spot) return null;

    if (spot.avgStarRating === undefined) spot.avgStarRating = "New"
    let location
    if (spot.country === "United States of America"){
        location = `${spot.city}, ${spot.state}`
    } else location = `${spot.city}, ${spot.country}`


    return (
        <div>
            <h1>{`${spot.name}`}</h1>
            <div>{`*star-icon*${spot.avgStarRating}`}</div>
            <div>{`${location}`}</div>
            <div className="spot-details-image-container">
                {spot.SpotImages.map(spotImage => (
                    <img className="spot-details-image" src={spotImage.url}></img>
                ))}
            </div>
            <button className="reviews-button">Leave a Review</button>
        </div>
    )
 }
 export default SpotDetails
