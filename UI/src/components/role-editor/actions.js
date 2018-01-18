import { Set } from 'immutable'
import * as UIActions from '../../actions/ui'
import { getViewMap, setup } from '../role-picker/actions'
import uuidv4 from 'uuid/v4'
import superagent from 'superagent'

export const constructView = id => async (dispatch, getState) => {
  await setup(id)(dispatch)
  const server = getState().servers.get(id)

  let { viewMap, hasSafeRoles } = getViewMap(server)
  viewMap = viewMap.map(c => c.set('mode', Symbol.for('drop')))

  dispatch({
    type: Symbol.for('re: setup'),
    data: {
      hasSafeRoles,
      viewMap,
      originalSnapshot: viewMap
    }
  })

  dispatch(UIActions.fadeIn)
}

export const addRoleToCategory = (id, oldId, role, flip = true) => (dispatch) => {
  dispatch({
    type: Symbol.for('re: add role to category'),
    data: {
      id,
      role
    }
  })

  if (flip) {
    dispatch(removeRoleFromCategory(oldId, id, role, false))
  }
}

export const removeRoleFromCategory = (id, oldId, role, flip = true) => (dispatch) => {
  dispatch({
    type: Symbol.for('re: remove role from category'),
    data: {
      id,
      role
    }
  })

  if (flip) {
    dispatch(addRoleToCategory(oldId, id, role, false))
  }
}

export const editCategory = ({ id, key, value }) => dispatch => {
  dispatch({
    type: Symbol.for('re: edit category'),
    data: {
      id,
      key,
      value
    }
  })
}

export const saveCategory = (id, category) => (dispatch) => {
  if (category.get('name') === '') {
    return
  }

  dispatch({
    type: Symbol.for('re: switch category mode'),
    data: {
      id,
      mode: Symbol.for('drop')
    }
  })
}

export const openEditor = (id) => ({
  type: Symbol.for('re: switch category mode'),
  data: {
    id,
    mode: Symbol.for('edit')
  }
})

export const deleteCategory = (id, category) => (dispatch, getState) => {
  const roles = category.get('roles')
  const rolesMap = category.get('roles_map')

  let uncategorized = getState().roleEditor.getIn(['viewMap', 'Uncategorized'])

  dispatch({
    type: Symbol.for('re: set category'),
    data: {
      id: 'Uncategorized',
      name: '',
      roles: uncategorized.get('roles').union(roles),
      roles_map: uncategorized.get('roles_map').union(rolesMap),
      hidden: true,
      type: 'multi',
      mode: null
    }
  })

  dispatch({
    type: Symbol.for('re: delete category'),
    data: id
  })
}

export const createCategory = (dispatch, getState) => {
  const { roleEditor } = getState()
  const vm = roleEditor.get('viewMap')

  let name = 'New Category'
  let idx = 1
  while (vm.find(c => c.get('name') === name) !== undefined) {
    idx++
    name = `New Category ${idx}`
  }

  const id = uuidv4()

  dispatch({
    type: Symbol.for('re: set category'),
    data: {
      id,
      name,
      roles: Set([]),
      roles_map: Set([]),
      hidden: true,
      type: 'multi',
      mode: Symbol.for('edit')
    }
  })
}

export const saveServer = id => async (dispatch, getState) => {
  const viewMap = getState().roleEditor.get('viewMap')
    .filterNot((_, k) => k === 'Uncategorized')
    .map(v => v.delete('roles_map').delete('mode').delete('id'))

  await superagent.patch(`/api/server/${id}`).send({ categories: viewMap.toJS() })
  dispatch({ type: Symbol.for('re: swap original state') })
}
