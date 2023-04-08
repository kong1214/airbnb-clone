import { csrfFetch } from "./csrf";

//Action Type Constants
const GET_BOOKINGS_BY_SPOT = "bookings/getBookingsBySpot"
const CREATE_BOOKING = "bookings/createBooking"
const EDIT_BOOKING = "bookings/editBooking"
const GET_BOOKINGS_BY_USER = "bookings/getBookingsByUser"
const DELETE_BOOKINGS_BY_USER = 'bookings/deleteBookingsByUser'
const CLEAR_BOOKINGS = "bookings/clearBookings"
//Action creators

const addBooking = (booking) => {
  return {
    type: CREATE_BOOKING,
    booking
  }
}

const editBooking = (booking) => {
  return {
    type: EDIT_BOOKING,
    booking
  }
}
const loadBookingsByUser = (bookings) => {
  return {
    type: GET_BOOKINGS_BY_USER,
    bookings
  }
}

const deleteBooking = (bookingId) => {
  return {
    type: DELETE_BOOKINGS_BY_USER,
    bookingId
  }
}

export const clearBookings = () => {
  return {
    type: CLEAR_BOOKINGS
  }
}


export const createBookingBySpot = (bookingObj) => async (dispatch) => {
  const { startDate, endDate, spotId} = bookingObj;
  // console.log(reviewObj)
  const response = await csrfFetch(`/api/spots/${spotId}/bookings`, {
    method: "POST",
    body: JSON.stringify({
      startDate, endDate, spotId
    })
  })
  let data
  if(response.ok) {
    data = await response.json()
    dispatch(addBooking(data))
    return data
  }
}

export const editSingleBooking = (booking) => async (dispatch) => {
  const { startDate, endDate, bookingId } = booking
  const response = await csrfFetch(`/api/bookings/${bookingId}`, {
    method: "PUT",
    body: JSON.stringify({ startDate, endDate })
  })
  if (response.ok) {
    const data = await response.json()
    dispatch(editBooking(data))
    return data;
  }
}

export const getBookingsByUser = () => async (dispatch) => {
  const response = await csrfFetch(`/api/bookings/current`);
  const data = await response.json();
  let normalizedData = {}
  data.Bookings.forEach(booking => {
    normalizedData[booking.id] = booking
  })
  // console.log("normalizedData", normalizedData)
  dispatch(loadBookingsByUser(normalizedData));
  return normalizedData
}

export const deleteOneBooking = (bookingId) => async (dispatch) => {
  const response = await csrfFetch(`/api/bookings/${bookingId}`, {
    method: "DELETE"
  })
  if (response.ok) {
    dispatch(deleteBooking(bookingId))
  }
}

const initialState = {
  spot: {},
  user: {}
}

const bookingsReducer = (state = initialState, action) => {
  let newState
  switch (action.type) {
    case GET_BOOKINGS_BY_USER:
      newState = { spot: {}, user: {} }
      newState.user = action.bookings;
      return newState
    case EDIT_BOOKING:
      const spotInfo = state.user[action.booking.id].Spot
      newState = { ...state, spot: {}, user: {...state.user} }
      newState.user[action.booking.id] = action.booking
      newState.user[action.booking.id]["Spot"] = spotInfo
      return newState
    case DELETE_BOOKINGS_BY_USER:
      newState = { spot: {}, user: {...state.user} }
      delete newState.user[action.bookingId]
      return newState
    default:
      return state;
  }
};

export default bookingsReducer
