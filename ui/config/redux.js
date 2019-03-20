import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'
import withNextRedux from 'next-redux-wrapper'
import { rootReducer } from 'fast-redux'

export const initStore = (initialState = {}) => {
  return createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
  )
}

export const withRedux = (comp) => withNextRedux(initStore, {
  debug: process.env.NODE_ENV === 'development'
})(comp)
