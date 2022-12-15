import { csrfFetch } from "./csrf";

//Action Type Constants
const GET_ALL_SPOTS = "spots/getAllSpots"
const GET_ONE_SPOT = "spots/getOneSpot"
const CREATE_A_SPOT = "spots/createSpot"

//Action creators
const loadSpots = (spots) => {
    return {
      type: GET_ALL_SPOTS,
      spots
    };
};

const loadOneSpot = (spot) => {
  return {
    type: GET_ONE_SPOT,
    spot
  };
}

const addSpot = (spot) => {
  console.log("spot in addSpot action creator", spot)
  return {
    type: CREATE_A_SPOT,
    spot
  }
}

  // thunk action creators
export const getAllSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots');
    const data = await response.json();
    let normalizedData = {}
    data.Spots.forEach(spot => {
      normalizedData[spot.id] = spot
    })
    dispatch(loadSpots(normalizedData));
    return normalizedData
};

export const getOneSpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`);
  const data = await response.json()
  dispatch(loadOneSpot(data))
  return data
}

export const createOneSpot = (spot) => async dispatch => {
  const { address, city, state, country, lat, lng, name, description, price, previewImage } = spot
  const response = await csrfFetch("/api/spots", {
    method: "POST",
    body: JSON.stringify({
      address, city, state, country, lat, lng, name, description, price, previewImage
    })
  })
  let data
  if (response.ok) {
    data = await response.json()
    const spotImageFetchResponse = await csrfFetch(`/api/spots/${data.id}/images`, {
      method: "POST",
      body: JSON.stringify({
        url: previewImage,
        preview: true
      })
    })
    if (spotImageFetchResponse.ok) {
      dispatch(addSpot(data))
      return data
    }
  }
}


const initialState = {
  allSpots: {},
  singleSpot: {}

}

const spotsReducer = (state = initialState, action) => {
  let newState
  switch (action.type) {
    case GET_ALL_SPOTS:
      newState = {allSpots: {}, singleSpot: {}}
      newState.allSpots = action.spots;
      return newState;
    case GET_ONE_SPOT:
      newState = {...state, singleSpot: {} }
      newState.singleSpot = action.spot
      return newState
    case CREATE_A_SPOT:
      newState = {...state}
      newState.allSpots[action.spot.id] = action.spot
      return newState
    default:
      return state;
  }
};

export default spotsReducer
