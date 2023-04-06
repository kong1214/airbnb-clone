import { csrfFetch } from "./csrf";

//Action Type Constants
const GET_BOOKINGS_BY_SPOT = "bookings/getBookingsBySpot"
const CREATE_BOOKING = "bookings/createBooking"
const GET_BOOKINGS_BY_USER = "bookings/getBookingsByUser"
const DELETE_BOOKINGS_BY_USER = 'bookings/deleteBookingsByUser'
const CLEAR_BOOKINGS = "bookings/clearBookings"
//Action creators

const loadBookingsBySpot = (bookings) => {
  return {
    type: GET_BOOKINGS_BY_SPOT,
    bookings
  };
};

const addBooking = (booking) => {
  return {
    type: CREATE_BOOKING,
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

// thunk action creators
// export const getReviewsBySpot = (spotId) => async (dispatch) => {
//   const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
//   const data = await response.json();
//   let normalizedData = {}
//   data.Reviews.forEach(review => {
//     normalizedData[review.id] = review
//   })
//   dispatch(loadReviewsBySpot(normalizedData));
//   return normalizedData
// }

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

// export const deleteOneReview = (reviewId) => async (dispatch) => {
//   const response = await csrfFetch(`/api/reviews/${reviewId}`, {
//     method: "DELETE"
//   })
//   if (response.ok) {
//     dispatch(deleteReview(reviewId))
//   }
// }

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
    default:
      return state;
  }
};

export default bookingsReducer
