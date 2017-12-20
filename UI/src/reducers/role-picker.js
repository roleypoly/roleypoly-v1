import { Map, OrderedMap } from 'immutable'

const initialState = Map({
  hidden: true, // should the view be hidden?
  // emptyRoles: true, // helps derender roles so there's no visible element state change
  viewMap: OrderedMap({}), // roles in categories
  originalRolesSelected: Map({}), // Map<role id, bool> -- original roles for diffing against selected
  rolesSelected: Map({}) // Map<role id, bool> -- new roles for diffing
})

export default (state = initialState, { type, data }) => {
  switch (type) {
    case Symbol.for('setup role picker'):
      return Map(data)

    case Symbol.for('hide role picker ui'):
      return {
        ...state,
        hidden: data
      }

    case Symbol.for('reset role picker ui'):
      return {
        ...state,
        emptyRoles: data
      }

    case Symbol.for('update selected roles'):
      return state.setIn(['rolesSelected', data.id], data.state)

    // case Symbol.for('zero role picker'):
      // return initialState

    default:
      return state
  }
}
