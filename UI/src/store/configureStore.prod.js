import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';

import thunk from 'redux-thunk';
// import api from '../middleware/api'
import rootReducer from '../reducers';

const configureStore = (preloadedState, history) =>
  createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(thunk, routerMiddleware(history))
  );

export default configureStore;
