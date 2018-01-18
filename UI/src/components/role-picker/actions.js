import { Map, Set, fromJS } from 'immutable'
import superagent from 'superagent'
import * as UIActions from '../../actions/ui'

export const setup = id => async dispatch => {
  const rsp = await superagent.get(`/api/server/${id}`)
  const data = rsp.body

  dispatch({
    type: Symbol.for('server: set'),
    data: {
      id,
      ...data
    }
  })
  dispatch(constructView(id))
}

export const getViewMap = server => {
  const roles = server.get('roles')
  const categories = server.get('categories')

  const allRoles = server.get('roles').filter(v => v.get('safe')).map(r => r.get('id')).toSet()
  const accountedRoles = categories.map(c => c.get('roles')).toSet().flatten()
  const unaccountedRoles = allRoles.subtract(accountedRoles)

  // console.log('roles', allRoles.toJS(), accountedRoles.toJS(), unaccountedRoles.toJS())

  const viewMap = categories.set('Uncategorized', fromJS({
    roles: unaccountedRoles,
    hidden: true,
    type: 'multi',
    name: 'Uncategorized'
  })).map(c => {
    const roles = c.get('roles')
      // fill in roles_map
      .map(r =>
        server.get('roles').find(sr => sr.get('id') === r)
      )
      // sort by server position, backwards.
      .sort((a, b) => a.position > b.position)
    // force data to sets
    return c.set('roles_map', Set(roles)).set('roles', Set(c.get('roles')))
  })

  const selected = roles.reduce((acc, r) => acc.set(r.get('id'), r.get('selected')), Map())

  const hasSafeRoles = allRoles.size > 0

  return {
    viewMap,
    selected,
    hasSafeRoles
  }
}

export const constructView = id => (dispatch, getState) => {
  const server = getState().servers.get(id)

  const { viewMap, selected } = getViewMap(server)

  dispatch({
    type: Symbol.for('rp: setup role picker'),
    data: {
      viewMap: viewMap,
      rolesSelected: selected,
      originalRolesSelected: selected,
      hidden: false,
      isEditingMessage: false,
      messageBuffer: ''
    }
  })

  dispatch(UIActions.fadeIn)
}

export const resetSelected = (dispatch) => {
  dispatch({
    type: Symbol.for('rp: reset selected')
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
    type: Symbol.for('rp: sync selected roles')
  })
}

export const updateRoles = roles => ({
  type: Symbol.for('rp: update selected roles'),
  data: roles
})

export const openMessageEditor = id => (dispatch, getState) => {
  const message = getState().servers.getIn([id, 'message'])
  dispatch(editServerMessage(id, message))
  dispatch({
    type: Symbol.for('rp: set message editor state'),
    data: true
  })
}

export const saveServerMessage = id => async (dispatch, getState) => {
  const message = getState().rolePicker.get('messageBuffer')

  await superagent.patch(`/api/server/${id}`).send({ message })

  dispatch(closeMessageEditor)
  dispatch({
    type: Symbol.for('server: edit message'),
    data: {
      id,
      message
    }
  })
}

export const editServerMessage = (id, message) => ({
  type: Symbol.for('rp: edit message buffer'),
  data: message
})

export const closeMessageEditor = ({
  type: Symbol.for('rp: set message editor state'),
  data: false
})
