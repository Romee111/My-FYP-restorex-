// userActions.js
import { SET_USER, UPDATE_USER, LOGOUT_USER } from './constant';

export const setUser = (userData) => {
  return {
    type: SET_USER,
    payload: userData,
  };
};

export const updateUser = (updatedData) => {
  return {
    type: UPDATE_USER,
    payload: updatedData,
  };
};

export const logoutUser = () => {
  return {
    type: LOGOUT_USER,
  };
};
