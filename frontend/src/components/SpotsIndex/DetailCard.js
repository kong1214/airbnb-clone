import "./SpotsIndex.css"
import { Link } from "react-router-dom"

 const DetailCard = ({spot}) => {
    let location
    if (spot.country === "United States of America"){
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
            <img className="preview-image" src={`${spot.previewImage}`} />
            <div>
                <i className="fa-solid fa-star"></i>
                {`${avgRating}`}
                </div>
            <div>{`location: ${location} `}</div>
            <div className="price-container">
                <span className="price">{`$${spot.price} `}</span>
                <span className="night">night</span>
            </div>
        </Link>
    )
 }
 export default DetailCard
