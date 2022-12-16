import { csrfFetch } from "./csrf";

//Action Type Constants
const GET_REVIEWS_BY_SPOT = "spots/getReviewsBySpot"


//Action creators
const loadReviewsBySpot = (reviews) => {
    return {
      type: GET_REVIEWS_BY_SPOT,
      reviews
    };
};


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
};



const initialState = {
    spot: {},
    user: {}
}

const reviewsReducer = (state = initialState, action) => {
  let newState
  switch (action.type) {
    case GET_REVIEWS_BY_SPOT:
      newState = {spot: {}, user: {}}
      newState.spot = action.reviews;
      return newState;
    default:
      return state;
  }
};

export default reviewsReducer
