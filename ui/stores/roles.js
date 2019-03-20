import { namespaceConfig } from 'fast-redux'
import { getCurrentServerState } from './currentServer'

export const { action, getState: getCurrentRoles } = namespaceConfig('roles', {})

export const updateCurrentRoles = action('updateCurrentRoles', (state, data) => data)

export const renderRoles = (dispatch, getState) => {
  const server = getCurrentServerState(getState())
}
