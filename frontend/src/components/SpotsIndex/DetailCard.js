import "./SpotsIndex.css"
import { Link } from "react-router-dom"

const DetailCard = ({ spot }) => {
    let location
    if (spot.country === "United States of America") {
        location = `${spot.city}, ${spot.state}`
    } else location = `${spot.city}, ${spot.country}`

    let avgRating
    if (spot.avgRating === undefined) {
        avgRating = "New"
    } else {
        const numAvgRating = Number(spot.avgRating)
        avgRating = numAvgRating.toFixed(2)
    }

    return (
        <Link to={`/spots/${spot.id}`} className="card-container">
            <div className="preview-image-container">
                <img className="preview-image rounded-corners" src={`${spot.previewImage}`} />
            </div>
            <div className="spot-info">
                <div className="detail-card-location-and-avgRating">
                    <div className="detail-card-location">{`${location} `}</div>
                    <span className="star-avg-rating-container">
                        <i className="fa-solid fa-star"></i>
                        {`${avgRating}`}
                    </span>
                </div>
                <div className="price-container">
                    <span className="price">{`$${spot.price}`}</span>
                    <span className="night">night</span>
                </div>
            </div>
        </Link>
    )
}
export default DetailCard
