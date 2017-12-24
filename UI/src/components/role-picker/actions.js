import { Map, Set, fromJS } from 'immutable'
import superagent from 'superagent'
import * as UIActions from '../../actions/ui'

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

  const allRoles = server.get('roles').filter(v => v.get('safe')).map(r => r.get('id')).toSet()
  const accountedRoles = categories.map(c => c.get('roles')).toSet().flatten()
  const unaccountedRoles = allRoles.subtract(accountedRoles)

  // console.log('roles', allRoles.toJS(), accountedRoles.toJS(), unaccountedRoles.toJS())

  const vm = categories.set('Uncategorized', fromJS({
    roles: unaccountedRoles,
    hidden: false,
    type: 'multi'
  })).map(c => {
    const roles = c.get('roles')
      .map(r =>
        server.get('roles').find(sr => sr.get('id') === r)
      )
      .sort((a, b) => a.position > b.position)
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

  dispatch(UIActions.fadeIn)
}

export const resetSelected = (dispatch) => {
  dispatch({
    type: Symbol.for('reset selected')
  })
}

export const submitSelected = serverId => async (dispatch, getState) => {
  const { rolePicker } = getState()
  const original = rolePicker.get('originalRolesSelected')
  const current = rolePicker.get('rolesSelected')

  const diff = original.reduce((acc, v, k) => {
    if (current.get(k) !== v) {
      // if original value is false, then we know we're adding, otherwise removing.
      if (v !== true) {
        return acc.set('added', acc.get('added').add(k))
      } else {
        return acc.set('removed', acc.get('removed').add(k))
      }
    }

    return acc
  }, Map({ added: Set(), removed: Set() }))

  await superagent.patch(`/api/servers/${serverId}/roles`).send(diff.toJS())

  dispatch({
    type: Symbol.for('sync selected roles')
  })
}

export const updateRoles = roles => ({
  type: Symbol.for('update selected roles'),
  data: roles
})
