import { csrfFetch } from "./csrf";

//Action Type Constants
const GET_ALL_SPOTS = "spots/getAllSpots"
const GET_ONE_SPOT = "spots/getOneSpot"
const CREATE_A_SPOT = "spots/createSpot"
const EDIT_A_SPOT = "spots/editSpot"
const DELETE_SPOT = 'spots/deleteSpot'

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
  return {
    type: CREATE_A_SPOT,
    spot
  }
}

const editSpot = (spot) => {
  return {
    type: EDIT_A_SPOT,
    spot
  }
}

const deleteSpot = (spotId) => {
  return {
    type: DELETE_SPOT,
    spotId
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

export const editOneSpot = (spot, spotId) => async dispatch => {
  const { address, city, state, country, lat, lng, name, description, price } = spot
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "PUT",
    body: JSON.stringify({address, city, state, country, lat, lng, name, description, price})
  })
  if (response.ok) {
    const data = await response.json()
    dispatch(editSpot(data))
    return data;
  }
}

export const deleteOneSpot = (spotId) => async dispatch => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE"
  })
  if (response.ok) {
    dispatch(deleteSpot(spotId))
  }
}



const initialState = {
  allSpots: {},
  singleSpot: {}

}

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_SPOTS: {
      const newState = {allSpots: {}, singleSpot: {}}
      newState.allSpots = action.spots;
      return newState;
    }
    case GET_ONE_SPOT: {
      const newState = {allSpots: {}, singleSpot: {} }
      newState.singleSpot = action.spot
      return newState
    }
    case CREATE_A_SPOT: {
      const newState = {...state, allSpots: {...state.allSpots}, singleSpot: action.spot}
      newState.allSpots[action.spot.id] = action.spot
      // console.log("state", state)
      // console.log("newState", newState
      return newState
    }
    case EDIT_A_SPOT: {
      const newState = {...state, allSpots: {...state.allSpots}, singleSpot: action.spot}
      newState.allSpots[action.spot.id] = {...action.spot}
      return newState
    }
    case DELETE_SPOT: {
      const newState = {...state}
      delete newState.allSpots[action.spotId]
      return newState
    }
    default:
      return state;
  }
};

export default spotsReducer
