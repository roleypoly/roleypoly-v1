import { Map, Set } from 'immutable'
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
  const rsp = await superagent.get(`/api/server/${id}`)
  const data = rsp.body

  dispatch({
    type: Symbol.for('update server roles'),
    data: {
      id,
      roles: data
    }
  })

  dispatch(constructView(id))
}

export const constructView = id => (dispatch, getState) => {
  const server = getState().servers.get(id)
  const roles = server.get('roles')

  const categories = roles.groupBy(x => x.get('category'))
  const selected = roles.reduce((acc, r) => {
    return acc.set(r.id, r.selected)
  }, Map())

  console.log(categories, selected)
  dispatch({
    type: Symbol.for('setup role picker'),
    data: {
      viewMap: categories,
      rolesSelected: selected,
      originalRolesSelected: selected
    }
  })
}
