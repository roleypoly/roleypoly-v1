import { combineReducers } from 'redux'

import servers from './servers'
import user from './user'
import rolePicker from './role-picker'
// import roles from './roles'

const initialState = {
  ready: false
}

const appState = (state = initialState, { type }) => {
  switch (type) {
    case Symbol.for('app ready'):
      return {
        ready: true
      }
    
    default:
      return state
  }
}

const rootReducer = combineReducers({
  appState,
  servers,
  user,
  // roles,
  rolePicker
})

export default rootReducer
