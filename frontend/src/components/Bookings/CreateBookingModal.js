import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { createBookingBySpot } from "../../store/bookings";
import { useState } from "react";
import "./CreateBookingModal.css"

function CreateBookingModal({ bookingInfo }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch()
    const history = useHistory()
    const [errors, setErrors] = useState([]);
    const dateFormatter = (date) => {
        const splitDate = date.split('-')
        return `${splitDate[1]}-${splitDate[2]}-${splitDate[0]}`
    }
    const handleConfirmation = async () => {
        console.log(bookingInfo)
        return dispatch(createBookingBySpot({
            startDate: bookingInfo.startDate,
            endDate: bookingInfo.endDate,
            spotId: bookingInfo.spotId
        }))
            .then(() => {
                console.log(bookingInfo.startDate)
                console.log(bookingInfo.endDate)
                closeModal()
                history.push("/bookings/current")
            })
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            })
    }

    return (
        <div className="create-booking-modal">
            <div className="create-reviews-errors-container">
                {errors.map((error, idx) => <div key={idx}>{error}</div>)}
            </div>
            <div className="confirmation-header">Are you sure you want to book:</div>
            <div className="create-booking-modal-spot-name">{bookingInfo.spotName}</div>
            <div className="create-booking-modal-spot-dates">
                for <strong>{dateFormatter(bookingInfo.startDate)}</strong> to <strong>{dateFormatter(bookingInfo.endDate)}</strong>?
            </div>
            <div className="create-booking-modal-buttons">
                <button className="create-booking-modal-cancel-button" onClick={() => closeModal()}>Cancel</button>
                <button className="create-booking-modal-confirm-button" onClick={() => handleConfirmation()}>Confirm</button>
            </div>
        </div>
    )
}

export default CreateBookingModal
