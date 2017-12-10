import { Map } from 'immutable'

const initialState = Map({
  isLoggedIn: false,
  username: 'あたし',
  discriminator: '0001',
  id: '',
  avatar: null
})

export default (state = initialState, { type, data }) => {
  switch (type) {
    case Symbol.for('set user'):
      return Map({...data, isLoggedIn: true})

    case Symbol.for('reset user'):
      return initialState
    
    default:
      return state
  }
}
