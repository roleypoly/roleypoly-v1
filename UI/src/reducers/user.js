import { Map } from 'immutable'

const initialState = Map({
  username: 'あたし',
  discriminator: '0001',
  id: '',
  avatar: null
})

export default (state = initialState, { type, data }) => {
  switch (type) {
    default:
      return state
  }
}
