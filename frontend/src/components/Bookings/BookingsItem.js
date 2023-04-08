import { NavLink } from "react-router-dom"
import * as bookingsActions from "../../store/bookings"
import OpenModalButton from "../OpenModalButton"
import EditBookingModal from "./EditBookingModal"
import { useDispatch } from "react-redux"
import "./Bookings.css"

function BookingItem({ booking }) {
    const dispatch = useDispatch()

    // console.log(booking)
    let bookingLocation
    if (booking.Spot.country === "United States of America") {
        bookingLocation = `${booking.Spot.city}, ${booking.Spot.state}`
    } else bookingLocation = `${booking.Spot.city}, ${booking.Spot.country}`

    let bookingDates = `${booking.startDate} to ${booking.endDate}`

    const date = new Date(booking.createdAt)
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();


    let bookedOn = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;

    const deleteHandler = (bookingId) => {
        return dispatch(bookingsActions.deleteOneBooking(bookingId))
            .then((res) => {
                // history.push(`/`)
            })
    }

    return (
        <div className="booking-item-container">
            <div className="booking-spot-image-container">
                <NavLink to={`/spots/${booking.Spot.id}`} className="booking-spot-link">
                    <img className="booking-spot-image" src={booking.Spot.previewImage}></img>
                </NavLink>
            </div>
            <div className="booking-spot-content-container">
                <div className="booking-spot-details-container">
                    <div className="booking-spot-details-header">Spot Details</div>
                    <div className="booking-spot-name booking-detail">{booking.Spot.name}</div>
                    <div className="booking-spot-address booking-detail">{booking.Spot.address}</div>
                    <div className="booking-spot-city-state-country booking-detail">{bookingLocation}</div>
                </div>
                <div className="booking-details-container">
                    <div className="booking-spot-details-header booking-detail">Booking Details</div>
                    <div className="booking-stay-date booking-detail">{bookingDates}</div>
                    <div className="booking-spot-address booking-detail">Booked On: <strong>{bookedOn}</strong></div>
                    <div className="booking-buttons">
                        <button onClick={() => deleteHandler(booking.id)} className="delete-booking-button">Delete Booking</button>
                        <OpenModalButton
                            className="edit-booking-button"
                            buttonText="Edit Booking"
                            modalComponent={<EditBookingModal booking={booking} />} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookingItem
