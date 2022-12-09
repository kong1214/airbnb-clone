import { csrfFetch } from './csrf';

//Action Type Constants
const SET_USER = "session/setUser"
const REMOVE_USER = "session/removeUser"

//Action creators
const setUser = (user) => {
    return {
        type: SET_USER,
        user
    }
}

const removeUser = () => {
    return {
      type: REMOVE_USER,
    };
  };

  export const login = (user) => async (dispatch) => {
    const { credential, password } = user;
    const response = await csrfFetch('/api/session', {
      method: 'POST',
      body: JSON.stringify({
        credential,
        password,
      }),
    });
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
  };

  export const restoreUser = () => async dispatch => {
    const response = await csrfFetch('/api/session');
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
  };


const initialState = { user: null }

const sessionReducer = (state = initialState, action) => {
    let newState = {...state};
    switch (action.type) {
      case SET_USER:
        newState.user = action.user;
        return newState;
      case REMOVE_USER:
        newState.user = null;
        return newState;
      default:
        return state;
    }
  };

export default sessionReducer
