import { Set } from 'immutable'
import * as UIActions from '../../actions/ui'
import { getViewMap } from '../role-picker/actions'

export const constructView = id => (dispatch, getState) => {
  const server = getState().servers.get(id)

  let { viewMap } = getViewMap(server)
  viewMap = viewMap.map(c => c.set('mode', Symbol.for('drop')))

  dispatch({
    type: Symbol.for('re: setup'),
    data: {
      viewMap: viewMap
    }
  })

  dispatch(UIActions.fadeIn)
}

export const addRoleToCategory = (name, oldName, role, flip = true) => (dispatch) => {
  dispatch({
    type: Symbol.for('re: add role to category'),
    data: {
      name,
      role
    }
  })

  if (flip) {
    dispatch(removeRoleFromCategory(oldName, name, role, false))
  }
}

export const removeRoleFromCategory = (name, oldName, role, flip = true) => (dispatch) => {
  dispatch({
    type: Symbol.for('re: remove role from category'),
    data: {
      name,
      role
    }
  })
  
  if (flip) {
    dispatch(addRoleToCategory(oldName, name, role, false))
  }
}


export const editCategory = (stuff) => dispatch => {

}

export const saveCategory = (name) => ({
  type: Symbol.for('re: switch category mode'),
  data: {
    name,
    mode: Symbol.for('drop')
  }
})

export const deleteCategory = (name) => ({
  type: Symbol.for('re: delete category'),
  data: name
})

export const createCategory = (dispatch, getState) => {
  const { roleEditor } = getState()
  const vm = roleEditor.get('viewMap')

  let name = 'New Category'
  let idx = 1
  while (vm.has(name)) {
    idx++
    name = `New Category ${idx}`
  }

  dispatch({
    type: Symbol.for('re: set category'),
    data: {
      name,
      roles: Set([]),
      roles_map: Set([]),
      hidden: true,
      mode: Symbol.for('edit')
    }
  })
}
