import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
const SpotDetails = ({}) => {
    const { spotId } = useParams()

    const spot = useSelector(state => state.spots)



    return (
        <a href={`/api/spots/${spot.id}`} className="card-container">
            <img src={`${spot.previewImage}`} />
            <div>{`location: ${location} `}</div>
            <div>{`price: $${spot.price} per night`}</div>
        </a>
    )
 }
 export default SpotDetails
