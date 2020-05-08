import { Map, OrderedMap } from 'immutable'

const initialState = Map({
  hidden: true, // should the view be hidden?
  // emptyRoles: true, // helps derender roles so there's no visible element state change
  isEditingMessage: false,
  messageBuffer: '',
  viewMap: OrderedMap({}), // roles in categories
  originalRolesSelected: Map({}), // Map<role id, bool> -- original roles for diffing against selected
  rolesSelected: Map({}), // Map<role id, bool> -- new roles for diffing
  lockedInterations: false,
})

export default (state = initialState, { type, data }) => {
  switch (type) {
    case Symbol.for('rp: setup role picker'):
      return Map(data)

    case Symbol.for('rp: hide role picker ui'):
      return state.set('hidden', data)

    case Symbol.for('rp: reset role picker ui'):
      return state.set('emptyRoles', data)

    case Symbol.for('rp: update selected roles'):
      return state.mergeIn(['rolesSelected'], data)

    case Symbol.for('rp: sync selected roles'):
      return state.set('originalRolesSelected', state.get('rolesSelected'))

    case Symbol.for('rp: reset selected'):
      return state.set('rolesSelected', state.get('originalRolesSelected'))

    case Symbol.for('rp: set message editor state'):
      return state.set('isEditingMessage', data)

    case Symbol.for('rp: edit message buffer'):
      return state.set('messageBuffer', data)

    case Symbol.for('rp: lock'):
      return state.set('lockedInteractions', true)

    case Symbol.for('rp: unlock'):
      return state.set('lockedInteractions', false)
    // case Symbol.for('rp: zero role picker'):
    // return initialState

    default:
      return state
  }
}
