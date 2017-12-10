import { Set, Map } from 'immutable'

const blankServer = Map({
  'id': '386659935687147521',
  'gm': {
    'nickname': null,
    'color': '#cca1a1'
  },
  'server': {
    'id': '386659935687147521',
    'name': 'Roleypoly',
    'ownerID': '62601275618889728',
    'icon': '4fa0c1063649a739f3fe1a0589aa2c03'
  },
  'perms': {
    'isAdmin': true,
    'canManageRoles': true
  }
})

const initialState = Set([])

export default (state = initialState, { type, data }) => {
  console.log(__filename, type, data)

  switch (type) {
    case Symbol.for('update servers'):
      return data.reduce((acc, s) => acc.add(Map(s)), Set())
    
    case Symbol.for('add debug server'):
      return Set([blankServer])

    default:
      return state
  }
}
