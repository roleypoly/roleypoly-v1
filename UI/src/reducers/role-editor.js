import { Map, OrderedMap, fromJS } from 'immutable'

const initialState = Map({
  viewMap: OrderedMap({})
})

const reducer = (state = initialState, { type, data }) => {
  switch (type) {
    case Symbol.for('re: setup'):
      const { viewMap, ...rest } = data
      return Map({ viewMap: OrderedMap(viewMap), ...rest })

    case Symbol.for('re: set category'):
      return state.setIn(['viewMap', data.name], Map(data))

    case Symbol.for('re: delete category'):
      return state.deleteIn(['viewMap', data])

    case Symbol.for('re: switch category mode'):
      return state.setIn(['viewMap', data.name, 'mode'], data.mode)

    case Symbol.for('re: add role to category'):
      const category = state.getIn(['viewMap', data.name])
      return state.setIn(['viewMap', data.name],
        category
          .set('roles', category.get('roles').add(data.role.get('id')))
          .set('roles_map', category.get('roles_map').add(data.role))
      )

    case Symbol.for('re: remove role from category'):
      const rmCat = state.getIn(['viewMap', data.name])
      return state.setIn(['viewMap', data.name],
        rmCat
          .set('roles', rmCat.get('roles').filterNot(r => r === data.role.get('id')))
          .set('roles_map', rmCat.get('roles_map').filterNot(r => r.get('id') === data.role.get('id')))
      )

    default:
      return state
  }
}

export default reducer
