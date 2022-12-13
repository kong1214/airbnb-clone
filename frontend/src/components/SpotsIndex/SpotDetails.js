const SpotDetails = ({spotId}) => {
    
    return (
        <a href={`/api/spots/${spot.id}`} className="card-container">
            <img src={`${spot.previewImage}`} />
            <div>{`location: ${location} `}</div>
            <div>{`price: $${spot.price} per night`}</div>
        </a>
    )
 }
 export default SpotDetails
