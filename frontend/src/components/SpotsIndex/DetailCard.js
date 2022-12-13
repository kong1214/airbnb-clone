import "./SpotsIndex.css"
import { Link } from "react-router-dom"
 const DetailCard = ({spot}) => {
    let location
    if (spot.country === "United States of America"){
        location = `${spot.city}, ${spot.state}`
    } else location = `${spot.city}, ${spot.country}`
    return (
        <a href={`/api/spots/${spot.id}`} className="card-container">
            <img src={`${spot.previewImage}`} />
            <div>{`location: ${location} `}</div>
            <div>{`price: $${spot.price} per night`}</div>
        </a>
    )
 }
 export default DetailCard
