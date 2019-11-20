import { Set, OrderedMap, Map, fromJS } from 'immutable'

const blankServer = Map({
  id: '386659935687147521',
  gm: {
    nickname: null,
    color: '#cca1a1',
  },
  message: 'Hey hey!',
  server: {
    id: '386659935687147521',
    name: 'Roleypoly',
    ownerID: '62601275618889728',
    icon: '4fa0c1063649a739f3fe1a0589aa2c03',
  },
  roles: Set([]),
  categories: OrderedMap(),
  perms: {
    isAdmin: true,
    canManageRoles: true,
  },
})

const initialState = OrderedMap({})

export default (state = initialState, { type, data }) => {
  switch (type) {
    case Symbol.for('update servers'):
      return data.reduce((acc, s) => acc.set(s.id, fromJS(s)), OrderedMap())

    // case Symbol.for('update server roles'):
    //   return state.set(data.id,
    //     state.get(data.id).set('roles', Set(data.roles))
    //   )

    case Symbol.for('server: set'):
      return state.set(data.id, fromJS(data))

    case Symbol.for('server: edit message'):
      return state.setIn([data.id, 'message'], data.message)

    case Symbol.for('add debug server'):
      return state.set('0', blankServer)

    default:
      return state
  }
}
