//Action Type Constants
const GET_ALL_SPOTS = "spots/getSpots"


//Action creators
const loadSpots = (spots) => {
    return {
      type: GET_ALL_SPOTS,
      spots
    };
};

  // thunk action creators
export const getAllSpots = () => async (dispatch) => {
    const response = await fetch('/api/spots');
    const data = await response.json();
    dispatch(loadSpots(data.Spots));
    return data.Spots
};


const initialState = {}

const spotsReducer = (state = initialState, action) => {
    let newState = {...state};
    switch (action.type) {
      case GET_ALL_SPOTS:
        newState.spots = action.spots;
        return newState;
      default:
        return state;
    }
  };

export default spotsReducer
