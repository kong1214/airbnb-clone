import { csrfFetch } from "./csrf";

//Action Type Constants
const GET_REVIEWS_BY_SPOT = "reviews/getReviewsBySpot"
const CREATE_REVIEW = "reviews/getReviewsBySpot"

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
  const { review, stars, spotId, url } = reviewObj;
  console.log(reviewObj)
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "POST",
    body: JSON.stringify({
      review, stars, spotId
    })
  })
  let data
  if(response.ok) {
    data = await response.json()
    const response2 = await csrfFetch(`/api/reviews/${data.id}/images`, {
      method: "POST",
      body: JSON.stringify({
        url
      })
    })
    if (response2.ok) {
      dispatch(addReview(data))
      return data
    }
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
      newState = {...state}
      newState.spot[action.review.id] = action.review
    default:
      return state;
  }
};

export default reviewsReducer
