import { combineReducers } from 'redux';
import cartReducer from './cartReducar';

export default combineReducers({
  hello: () => 'hi there',
  cart: cartReducer,
});