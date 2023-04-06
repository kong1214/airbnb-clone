import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { editSingleBooking } from "../../store/bookings";
import { useState } from "react";
import "./EditBookingModal.css"
function EditBookingModal({ booking }) {

    const dateFormatter = (date) => {
        const splitDate = date.split('-')
        console.log(date)
        return `${splitDate[1]}-${splitDate[2]}-${splitDate[0]}`
    }

    const { closeModal } = useModal();
    const dispatch = useDispatch()
    const history = useHistory()
    const [checkInDate, setCheckInDate] = useState(booking.startDate)
    const [checkOutDate, setCheckOutDate] = useState(booking.endDate)
    const [errors, setErrors] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault()
        return dispatch(editSingleBooking({
            startDate: checkInDate,
            endDate: checkOutDate,
            bookingId: booking.id
        }))
            .then(() => {
                closeModal()
            })
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            })
    }

    return (
        <div className="edit-booking-modal">
            <div className="edit-booking-errors-container">
                {errors.map((error, idx) => <div key={idx}>{error}</div>)}
            </div>
            <div className="edit-booking-dates-container">
                <div className="booking-check-in-container booking-date-container">
                    <label className="bookings-date-label">
                        CHECK-IN
                        <input
                            type="date"
                            min={`${new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}`}
                            className="booking-date-input"
                            value={checkInDate}
                            onChange={(e) =>  setCheckInDate(e.target.value)}
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
            <button className="edit-booking-submit-button" onClick={handleSubmit}>Edit</button>
        </div>
    )
}

export default EditBookingModal
