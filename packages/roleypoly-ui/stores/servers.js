// @flow
import { namespaceConfig } from 'fast-redux'
import RPC from '../config/rpc'
// import { Map } from 'immutable'
import type { PresentableServer as Server } from '@roleypoly/types'

export type ServersState = {
  [id: string]: Server
}

const DEFAULT_STATE: ServersState = {}

export const { action, getState: getServerState } = namespaceConfig('servers', DEFAULT_STATE)

export const updateServers = action('updateServers', (state: ServersState, serverData: Server[]) => ({
  ...state,
  ...serverData.reduce((acc, s) => ({ ...acc, [s.id]: s }), {})
}))

export const updateSingleServer = action('updateSingleServer', (state, data, server) => ({ ...state, [server]: data }))

export const fetchServerList = (rpc?: typeof RPC) => async (dispatch: *) => {
  if (rpc == null) {
    rpc = RPC
  }

  const servers: Server[] = await rpc.listOwnServers()
  dispatch(updateServers(servers))
}
