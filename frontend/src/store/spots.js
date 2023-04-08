import { csrfFetch } from "./csrf";

//Action Type Constants
const GET_ALL_SPOTS = "spots/getAllSpots"
const GET_ONE_SPOT = "spots/getOneSpot"
const CREATE_A_SPOT = "spots/createSpot"
const EDIT_A_SPOT = "spots/editSpot"
const DELETE_SPOT = 'spots/deleteSpot'
const CLEAR_SPOT = 'spots/clearSpot'

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
export const clearSpot = () => {
  return {
    type: CLEAR_SPOT
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



// ///////////////////

export const createOneSpot = (spot) => async dispatch => {
  const { address, city, state, country, lat, lng, name, description, price, previewImage, imagesArr } = spot

  let createdSpot

  try {
    const response = await csrfFetch("/api/spots", {
      method: "POST",
      body: JSON.stringify({
        address, city, state, country, lat, lng, name, description, price, previewImage
      })
    })

    if (response.ok) {
      createdSpot = await response.json()
    } else {
      throw new Error("Failed to create spot")
    }

    const imagesData = await Promise.all([
      createSpotImage(createdSpot.id, previewImage, true),
      createSpotImages(createdSpot.id, imagesArr, false)
    ])

    if (imagesData.flat().every(data => data.ok)) {
      dispatch(addSpot(createdSpot))
      return createdSpot
    } else {
      throw new Error("Failed to create spot images")
    }
  } catch (error) {
    if (createdSpot) {
      await deleteASpot(createdSpot.id)
    }
    return error
  }
}

const createSpotImage = async (spotId, imageUrl, isPreview) => {
  const response = await csrfFetch(`/api/spots/${spotId}/images`, {
    method: "POST",
    body: JSON.stringify({
      url: imageUrl,
      preview: isPreview
    })
  })

  return response
}

const createSpotImages = async (spotId, imageUrls, isPreview) => {
  const fetchPromises = imageUrls.map(imageUrl =>
    createSpotImage(spotId, imageUrl, isPreview)
  )

  const responses = await Promise.all(fetchPromises)
  return responses
}

const deleteASpot = async (spotId) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE"
  })

  return response
}

// ///////////////////
export const editOneSpot = (spot, spotId) => async dispatch => {
  const { address, city, state, country, lat, lng, name, description, price } = spot
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "PUT",
    body: JSON.stringify({ address, city, state, country, lat, lng, name, description, price })
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
      const newState = { allSpots: {}, singleSpot: {} }
      newState.allSpots = action.spots;
      return newState;
    }
    case GET_ONE_SPOT: {
      const newState = { allSpots: {}, singleSpot: {} }
      newState.singleSpot = action.spot
      return newState
    }
    case CREATE_A_SPOT: {
      const newState = { ...state, allSpots: { ...state.allSpots }, singleSpot: action.spot }
      newState.allSpots[action.spot.id] = action.spot
      // console.log("state", state)
      // console.log("newState", newState
      return newState
    }
    case EDIT_A_SPOT: {
      const newState = { ...state, allSpots: { ...state.allSpots }, singleSpot: action.spot }
      newState.allSpots[action.spot.id] = { ...action.spot }
      return newState
    }
    case DELETE_SPOT: {
      const newState = { ...state }
      delete newState.allSpots[action.spotId]
      return newState
    }
    case CLEAR_SPOT: {
      const newState = {...state}
      newState.singleSpot = {}
      newState.allSpots = {...state.allSpots}
      return newState
    }
    default:
      return state;
  }
};

export default spotsReducer
