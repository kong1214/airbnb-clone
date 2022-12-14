import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { getOneSpot } from "../../store/spots"
const SpotDetails = ({}) => {
    const { spotId } = useParams()
    const spot = useSelector(state => state.spots.spots[spotId])


    if (!spot) return null;
    if (spot.avgRating === undefined) spot.avgRating = "New"
    let location
    if (spot.country === "United States of America"){
        location = `${spot.city}, ${spot.state}`
    } else location = `${spot.city}, ${spot.country}`


    return (
        <div>
            <h1>{`${spot.name}`}</h1>
            <div>{`*star-icon*${spot.avgRating}`}</div>
            <div>{`${location}`}</div>
            <div>
                spotImages
            </div>
            <button className="reviews-button">Leave a Review</button>
        </div>
    )
 }
 export default SpotDetails
