import { csrfFetch } from "./csrf";

//Action Type Constants
const GET_REVIEWS_BY_SPOT = "reviews/getReviewsBySpot"
const CREATE_REVIEW = "reviews/createReview"
const GET_REVIEWS_BY_USER = "reviews/getReviewsByUser"
const DELETE_REVIEWS_BY_USER = 'reviews/deleteReviewsByUser'
const CLEAR_REVIEWS = "reviews/clearReviews"
//Action creators
const loadReviewsBySpot = (reviews) => {
  return {
    type: GET_REVIEWS_BY_SPOT,
    reviews
  };
};

const addReview = (review) => {
  return {
    type: CREATE_REVIEW,
    review
  }
}

const loadReviewsByUser = (reviews) => {
  return {
    type: GET_REVIEWS_BY_USER,
    reviews
  }
}

const deleteReview = (reviewId) => {
  return {
    type: DELETE_REVIEWS_BY_USER,
    reviewId
  }
}

export const clearReviews = () => {
  return {
    type: CLEAR_REVIEWS
  }
}

// thunk action creators
export const getReviewsBySpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
  const data = await response.json();
  let normalizedData = {}
  data.Reviews.forEach(review => {
    normalizedData[review.id] = review
  })
  dispatch(loadReviewsBySpot(normalizedData));
  return normalizedData
}

export const createReviewBySpot = (reviewObj) => async (dispatch) => {
  const { review, stars, spotId} = reviewObj;
  // console.log(reviewObj)
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "POST",
    body: JSON.stringify({
      review, stars, spotId
    })
  })
  let data
  if(response.ok) {
    data = await response.json()
    dispatch(addReview(data))
    return data
  }
}


export const getReviewsByUser = () => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/current`);
  const data = await response.json();
  let normalizedData = {}
  data.Reviews.forEach(review => {
    normalizedData[review.id] = review
  })
  // console.log("normalizedData", normalizedData)
  dispatch(loadReviewsByUser(normalizedData));
  return normalizedData
}

export const deleteOneReview = (reviewId) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "DELETE"
  })
  if (response.ok) {
    dispatch(deleteReview(reviewId))
  }
}

const initialState = {
  spot: {},
  user: {}
}

const reviewsReducer = (state = initialState, action) => {
  let newState
  switch (action.type) {
    case GET_REVIEWS_BY_SPOT:
      newState = { spot: {}, user: {} }
      newState.spot = action.reviews;
      return newState;
    case CREATE_REVIEW:
      newState = {...state, spot: {...state.spot}, user: {...state.user}}
      newState.spot[action.review.id] = action.review
      return newState
    case GET_REVIEWS_BY_USER:
      newState = { spot: {}, user: {} }
      newState.user = action.reviews;
      return newState
    case DELETE_REVIEWS_BY_USER:
      newState = {...state}
      delete newState.user[action.reviewId]
      return newState
    case CLEAR_REVIEWS:
      newState = {...state}
      newState.user = {}
      newState.spot = {}
      return newState
    default:
      return state;
  }
};

export default reviewsReducer
