import { Map, Set, fromJS } from 'immutable'
import superagent from 'superagent'

export const roleUpdate = (id, oldState) => (dispatch, getState) => {
  dispatch({
    type: Symbol.for('update selected roles'),
    data: {
      id,
      state: !oldState
    }
  })
}

export const setup = id => async dispatch => {
  // const rsp = await superagent.get(`/api/server/${id}`)
  // const data = rsp.body

  // dispatch({
  //   type: Symbol.for('update server roles'),
  //   data: {
  //     id,
  //     roles: data
  //   }
  // })
  dispatch(constructView(id))
}

export const constructView = id => (dispatch, getState) => {
  const server = getState().servers.get(id)
  const roles = server.get('roles')

  const categories = server.get('categories')

  const allRoles = server.get('roles').map(r => r.get('id')).toSet()
  const accountedRoles = categories.map(c => c.get('roles')).toSet().flatten()
  const unaccountedRoles = allRoles.subtract(accountedRoles)

  // console.log('roles', allRoles.toJS(), accountedRoles.toJS(), unaccountedRoles.toJS())

  const vm = categories.set('Uncategorized', fromJS({
    roles: unaccountedRoles,
    hidden: false,
    type: 'multi'
  })).map(c => {
    const roles = c.get('roles').map(r => server.get('roles').find(sr => sr.get('id') === r))
    return c.set('roles_map', roles)
  })

  const selected = roles.reduce((acc, r) => acc.set(r.get('id'), r.get('selected')), Map())

  console.log(categories, selected)
  dispatch({
    type: Symbol.for('setup role picker'),
    data: {
      viewMap: vm,
      rolesSelected: selected,
      originalRolesSelected: selected,
      hidden: false
    }
  })
}
