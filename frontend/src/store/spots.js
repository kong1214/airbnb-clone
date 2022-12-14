import { csrfFetch } from "./csrf";

//Action Type Constants
const GET_ALL_SPOTS = "spots/getAllSpots"
const GET_ONE_SPOT = "spots/getOneSpot"

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
  console.log(data)
  dispatch(loadOneSpot(data))
  return data
}


const initialState = {}

const spotsReducer = (state = initialState, action) => {
    let newState = {...state};
    switch (action.type) {
      case GET_ALL_SPOTS:
        newState.spots = action.spots;
        return newState;
      case GET_ONE_SPOT:
        newState.spot = action.spot
      default:
        return state;
    }
  };

export default spotsReducer
