import { combineReducers } from 'redux'
import servers from './servers'
import user from './user'
import rolePicker from './role-picker'
import roleEditor from './role-editor'
// import roles from './roles'

const initialState = {
  ready: false,
  fade: true,
}

const appState = (state = initialState, { type, data }) => {
  switch (type) {
    case Symbol.for('app ready'):
      return {
        ...state,
        ready: true,
        fade: false,
      }

    case Symbol.for('app fade'):
      return {
        ...state,
        fade: data,
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
  rolePicker,
  roleEditor,
})

export default rootReducer
