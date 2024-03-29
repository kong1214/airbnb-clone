import { useSelector, useDispatch } from "react-redux"
import { useParams, useHistory } from "react-router-dom"
import * as spotsActions from "../../store/spots"
import { useEffect, useState } from "react"
import OpenModalButton from "../OpenModalButton"
import EditSpotModal from "./EditSpotModal"
import ReviewsBySpot from "../Reviews/ReviewsBySpot"
import CreateReviewModal from "../Reviews/CreateReviewModal"
import CreateBookingModal from "../Bookings/CreateBookingModal"
import "./SpotsIndex.css"
import "./SpotDetails.css"
import "./Bookings.css"

const SpotDetails = ({ }) => {
    const history = useHistory()
    const { spotId } = useParams()
    const dispatch = useDispatch()
    const [spotIsLoaded, setSpotIsLoaded] = useState(false);
    const [checkInDate, setCheckInDate] = useState(`${new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}`)
    const [checkOutDate, setCheckOutDate] = useState(`${new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}`)
    const spot = useSelector(state => state.spots.singleSpot)
    const sessionUser = useSelector(state => state.session.user);

    // console.log(spot)
    useEffect(() => {
        dispatch(spotsActions.getOneSpot(Number(spotId)))
            .then(() => setSpotIsLoaded(true));
    }, [spot.address, spot.city, spot.state, spot.country, spot.name, spot.description, spot.price])



    if (spot.id === undefined) return null;
    if (spot.Owner === undefined) return null;

    const ownerName = spot.Owner.firstName


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
        if (sessionUser.id === spot.ownerId) {
            sessionLinks = (
                <div className="session-links">
                    <div className="edit-this-spot-button session-buttons">
                        <OpenModalButton
                            buttonText="Edit this Spot"
                            modalComponent={<EditSpotModal spot={spot} />} />
                    </div>
                    <button
                        className="delete-this-spot-button session-buttons"
                        onClick={deleteHandler}>Delete this Spot
                    </button>
                </div>
            )
        } else if (sessionUser.id !== spot.ownerId) {
            sessionLinks = (
                <div className="session-links">
                    <div className="create-a-review-button session-buttons">
                        <OpenModalButton
                            buttonText="Leave a Review"
                            modalComponent={<CreateReviewModal spotId={Number(spotId)} />} />
                    </div>
                </div>
            )
        }
    }

    const previewImageObj = spot.SpotImages.find(spotImage => spotImage.preview === true)
    const previewImageUrl = previewImageObj.url
    // const spotImagesClone = [...spot.SpotImages]
    const noPreviewSpotImages = spot.SpotImages.filter(spotImage => spotImage.preview === false)
    while (noPreviewSpotImages.length !== 4) {
        noPreviewSpotImages.push(
            { preview: false, url: "https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg" }
        )
    }

    let displayReserveButton
    if (sessionUser) {
        displayReserveButton = (spot.ownerId === sessionUser.id) ? false : true
    } else displayReserveButton = false;

    function setEndDateMin() {
        const startDate = new Date(document.getElementById("start-date").value);
        const endDateInput = document.getElementById("end-date");
        endDateInput.min = new Date(startDate.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      }
    return (
        <>
            <h1>{`${spot.name}`}</h1>
            <div className="avg-rating-and-location-container">
                <div className="star-rating-container">
                    <i className="fa-solid fa-star"></i>
                    {` ${avgRating} ~ ${spot.numReviews} reviews`}
                </div>
                <span className="spot-details-location-container">
                    {`${spot.city}, ${spot.state}, ${spot.country}`}
                </span>
            </div>
            <div className="spot-details-images-container rounded-corners">
                <div className="spot-preview-image-container">
                    <img className="spot-preview-image" src={previewImageUrl}></img>
                </div>
                <div className="quad-photos">
                    {spot.SpotImages &&
                        noPreviewSpotImages.map(spotImage => (
                            <div className="spot-details-image-container">
                                <img key={spotImage.id} className="spot-details-image" src={spotImage.url}></img>
                            </div>
                        ))}
                </div>
            </div>
            <div className="spot-details-bottom-container">
                <div className="spot-details-columns-container">
                    <div className="spot-details-left-column-container spot-details-column-container">
                        <div className="spot-details-home-and-price-container">
                            <div className="spot-details-home">{`Entire home hosted by ${ownerName}`}</div>
                        </div>
                        <div className="spot-details-description-container">
                            <div className="description-container">
                                <div className="spot-details-description">
                                    {spot.description}
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="spot-details-right-column-container spot-details-column-container">
                        <div className="bookings-container">
                            <div className="bookings-price-and-reviews-container">
                                <div className="bookings-price-container">
                                    <div className="bookings-price"><strong>${spot.price}</strong> night</div>
                                </div>
                                <div className="star-rating-container">
                                    <i className="fa-solid fa-star"></i>
                                    {` ${avgRating} ~ ${spot.numReviews} reviews`}
                                </div>
                            </div>
                            <div className="booking-dates-container">
                                <div className="booking-check-in-container booking-date-container">
                                    <label className="bookings-date-label">
                                        CHECK-IN
                                        <input
                                            type="date"
                                            min={`${new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}`}
                                            className="booking-date-input"
                                            value={checkInDate}
                                            onChange={(e) => {setCheckInDate(e.target.value); setEndDateMin()}}
                                            required
                                        />
                                    </label>
                                </div>
                                <div className="booking-check-out-container booking-date-container">
                                    <label className="bookings-date-label">
                                        CHECK-OUT
                                        <input
                                            type="date"
                                            min={`${new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}`}
                                            className="booking-date-input"
                                            value={checkOutDate}
                                            onChange={(e) => setCheckOutDate(e.target.value)}
                                            required
                                        />
                                    </label>
                                </div>
                            </div>
                            {displayReserveButton && (
                                <OpenModalButton
                                    className="booking-reserve-button"
                                    buttonText="Reserve"
                                    modalComponent={<CreateBookingModal bookingInfo={{startDate: checkInDate, endDate: checkOutDate, spotName: spot.name, spotId: spot.id}} />} />
                            )}
                            {sessionLinks}
                        </div>

                    </div>
                </div>
                <div className="spot-details-reviews-container">
                    {spotIsLoaded && <ReviewsBySpot spotId={spot.id} numReviews={spot.numReviews} avgStars={spot.avgStarRating} />}
                </div>
            </div>
        </>
    )
}
export default SpotDetails
