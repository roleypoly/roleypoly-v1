// @flow
import { dynamicPropertyConfig } from 'fast-redux'
// import { Map } from 'immutable'
import type { PresentableServer } from '../../services/presentation'
import RPC from '../config/rpc'
import { action } from './servers'

const DEFAULT_STATE: $Shape<PresentableServer> | { id: ?string } = {
  id: null,
  server: {
    name: 'PLACEHOLDER',
    id: '386659935687147521',
    icon: '4fa0c1063649a739f3fe1a0589aa2c03',
    ownerID: '62601275618889728'
  },
  gm: {
    nickname: 'person',
    color: '#ff00ff'
  },
  categories: {},
  perms: {
    isAdmin: false,
    canManageRoles: false
  },
  roles: []
}

export type ServerState = PresentableServer

// export const { action, getState: getCurrentServerState } = namespaceConfig('currentServer', DEFAULT_STATE)

export const { propertyAction: currentServerAction, getPropertyState: getCurrentServerState } = dynamicPropertyConfig(action, DEFAULT_STATE)

export const updateCurrentServer = currentServerAction('updateCurrentServer', (state, newState) => ({ ...state, ...newState }))

export const fetchServerIfNeed = (id: string, rpc?: typeof RPC) => async (dispatch: *, getState: *) => {
  if (rpc == null) {
    rpc = RPC
  }

  if (id == null) {
    console.warn({ id })
  }

  const state: ServerState = getCurrentServerState(getState(), id)
  if (state.id == null || state.id !== id) {
    const server = await rpc.getServer(id)
    dispatch(updateCurrentServer(id, server))
    console.log({ state, server, fullStore: getState() })
  } else {
    console.log('did not update')
  }
}
