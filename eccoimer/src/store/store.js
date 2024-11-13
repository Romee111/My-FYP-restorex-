import { createStore, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension'; // Import Redux DevTools
import cartReducer from './reducers/cartreducer';
import userReducer from './reducers/userprofilereducer';

const rootReducer = combineReducers({
  cart: cartReducer,
  user: userReducer,
});

// Use composeWithDevTools to enable Redux DevTools
const store = createStore(rootReducer, composeWithDevTools());

export default store;
