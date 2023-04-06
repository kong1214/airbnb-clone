import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import * as bookingsActions from "../../store/bookings"
import BookingItem from "./BookingsItem"
import { clearSpot } from "../../store/spots"
import "./Bookings.css"

function BookingsByUser() {

    const dispatch = useDispatch()
    const history = useHistory()

    const sessionUser = useSelector(state => state.session.user);
    const data = useSelector(state => state.bookings.user)

    useEffect(() => {
        dispatch(clearSpot())
        dispatch(bookingsActions.getBookingsByUser())
    }, [dispatch, sessionUser])

    if (Object.values(data).length === 0) {
        return null
    }

    const bookings = Object.values(data)
    console.log(bookings)
    return (
        <div className='bookings-page-container'>
            <div className="bookings-by-user-container-with-header">
                <h1 className="bookings-by-user-header">Bookings</h1>
                <div className="bookings-by-user-container">
                    {bookings.map(booking => (
                        <div className="bookings-by-user-card-container" key={booking.id}>
                            <BookingItem booking={booking} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default BookingsByUser
