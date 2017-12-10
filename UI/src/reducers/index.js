import { combineReducers } from 'redux'

import servers from './servers'
import user from './user'

const rootReducer = combineReducers({
  servers,
  user
})

export default rootReducer
