// @flow
import { namespaceConfig } from 'fast-redux'
// import { Map } from 'immutable'

const DEFAULT_STATE = {}

export type ServersState = typeof DEFAULT_STATE

export const { action, getState: getServerState } = namespaceConfig('servers', DEFAULT_STATE)

export const updateServers = action('updateServers', (state: ServersState, serverData) => ({
  ...state,
  servers: serverData
}))

export const updateSingleServer = action('updateSingleServer', (state, data, server) => ({ ...state, [server]: data }))
