// userReducer.js
import { SET_USER, UPDATE_USER, LOGOUT_USER } from '../actions/constant';

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  avatar: '',
  isLoggedIn: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        ...action.payload,
        isLoggedIn: true,
      };
    case UPDATE_USER:
      return {
        ...state,
        ...action.payload,
      };
    case LOGOUT_USER:
      return initialState;
    default:
      return state;
  }
};

export default userReducer;
