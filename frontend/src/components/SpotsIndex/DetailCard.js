import "./SpotsIndex.css"
import { Link } from "react-router-dom"

 const DetailCard = ({spot}) => {
    let location
    if (spot.country === "United States of America"){
        location = `${spot.city}, ${spot.state}`
    } else location = `${spot.city}, ${spot.country}`

    if (spot.avgRating === undefined) spot.avgRating = "New"

    return (
        <Link to={`/spots/${spot.id}`} className="card-container">
            <img className="preview-image" src={`${spot.previewImage}`} />
            <div>{`avgStars = ${spot.avgRating}`}</div>
            <div>{`location: ${location} `}</div>
            <div>{`price: $${spot.price} per night`}</div>
        </Link>
    )
 }
 export default DetailCard
