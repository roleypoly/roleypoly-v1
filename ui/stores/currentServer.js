// @flow
import { dynamicPropertyConfig } from 'fast-redux'
// import { Map } from 'immutable'
import type { PresentableServer } from '../../services/presentation'
// import type { Category } from '../../models/Server'
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
    color: '#ff00ff',
    roles: ['0000']
  },
  categories: {},
  perms: {
    isAdmin: false,
    canManageRoles: false
  },
  roles: []
}

// const testState = { 'id': '408821059161423873', 'gm': { 'nickname': 'katalinya', 'color': '#ec5174', 'roles': ['408821059161423873', '408824559379152896', '408822364567109633', '408827063605133314', '408827583191318528', '408824686479278081', '414874340387979277', '409101683335888896'] }, 'server': { 'id': '408821059161423873', 'name': '💝⚡', 'ownerID': '62601275618889728', 'icon': '49dfdd8b2456e2977e80a8b577b19c0d' }, 'roles': [{ 'id': '408821461395046409', 'color': 0, 'name': 'roleypoly', 'position': 31, 'safe': false, 'selected': false }, { 'id': '420899618243608577', 'color': 441288, 'name': '#06bbc8', 'position': 17, 'safe': true, 'selected': false }, { 'id': '408824634771767327', 'color': 2460260, 'name': 'D-type', 'position': 9, 'safe': true, 'selected': false }, { 'id': '408826094645542913', 'color': 7134112, 'name': 'They/Them', 'position': 11, 'safe': true, 'selected': false }, { 'id': '408834993683562498', 'color': 14685739, 'name': '#e0162b', 'position': 23, 'safe': true, 'selected': false }, { 'id': '408884120194908171', 'color': 16087726, 'name': '#f57aae', 'position': 19, 'safe': true, 'selected': false }, { 'id': '408884752586899457', 'color': 8818853, 'name': 'public use slave', 'position': 5, 'safe': true, 'selected': false }, { 'id': '558281183864160257', 'color': 0, 'name': 'roleypoly:beta', 'position': 29, 'safe': false, 'selected': false }, { 'id': '414874340387979277', 'color': 13508640, 'name': 'n͘͠͡o̒́͌ṫ̛̄ r̎͊͝ė̌̏a̽̔͞l̛̂̔', 'position': 3, 'safe': true, 'selected': true }, { 'id': '410504219242790912', 'color': 7695996, 'name': 'It/It', 'position': 10, 'safe': true, 'selected': false }, { 'id': '537024357759975474', 'color': 16371117, 'name': 'a very cute kitty', 'position': 16, 'safe': true, 'selected': false }, { 'id': '522117670053609476', 'color': 0, 'name': '--- Marker ---', 'position': 27, 'safe': true, 'selected': false }, { 'id': '536274514451890187', 'color': 0, 'name': 'LucoaDev', 'position': 1, 'safe': false, 'selected': false }, { 'id': '408885003733434369', 'color': 1474527, 'name': '#167fdf', 'position': 18, 'safe': true, 'selected': false }, { 'id': '408827583191318528', 'color': 10053479, 'name': 'mindless & empty', 'position': 6, 'safe': true, 'selected': true }, { 'id': '408834610093621249', 'color': 16711935, 'name': '#ff00ff', 'position': 26, 'safe': true, 'selected': false }, { 'id': '408824753881612289', 'color': 4689615, 'name': 'Switch', 'position': 7, 'safe': true, 'selected': false }, { 'id': '408822364567109633', 'color': 13544809, 'name': 'lewd af [but cute too]', 'position': 15, 'safe': true, 'selected': true }, { 'id': '408831648290045962', 'color': 0, 'name': 'medkit', 'position': 30, 'safe': false, 'selected': false }, { 'id': '497280603905982495', 'color': 1051535, 'name': '', 'position': 2, 'safe': true, 'selected': false }, { 'id': '522119581737811968', 'color': 10245587, 'name': 'Celestial Purple 🔸', 'position': 28, 'safe': true, 'selected': false }, { 'id': '408822694700777482', 'color': 6401415, 'name': 'server slaves', 'position': 14, 'safe': true, 'selected': false }, { 'id': '497280466668355605', 'color': 1051535, 'name': '#100b8f', 'position': 21, 'safe': true, 'selected': false }, { 'id': '408824559379152896', 'color': 15173834, 'name': 'She/Her', 'position': 13, 'safe': true, 'selected': true }, { 'id': '409101683335888896', 'color': 0, 'name': '★', 'position': 32, 'safe': false, 'selected': true }, { 'id': '408884848858628097', 'color': 13618062, 'name': 'meido', 'position': 4, 'safe': true, 'selected': false }, { 'id': '408827063605133314', 'color': 15487348, 'name': '#ec5174', 'position': 24, 'safe': true, 'selected': true }, { 'id': '408824605118169088', 'color': 7048169, 'name': 'He/Him', 'position': 12, 'safe': true, 'selected': false }, { 'id': '408836461291503616', 'color': 15735386, 'name': '#f01a5a', 'position': 22, 'safe': true, 'selected': false }, { 'id': '408860970996334592', 'color': 1974564, 'name': '#1e2124', 'position': 20, 'safe': true, 'selected': false }, { 'id': '408824686479278081', 'color': 8478402, 'name': 'S-type', 'position': 8, 'safe': true, 'selected': true }, { 'id': '427638815570526223', 'color': 0, 'name': '', 'position': 33, 'safe': false, 'selected': false }, { 'id': '454102358209724426', 'color': 15914992, 'name': '#f2d7f0', 'position': 25, 'safe': true, 'selected': false }], 'message': 'Hello Drone and/or Owner. HexCorp would like to remind you to remain calm and relaxed. The spirals are just for show.\n\nmhmmm', 'categories': { '9361a732-650d-482c-868a-cbb871491654': { 'hidden': false, 'name': 'Pronouns', 'roles': ['408824559379152896', '408824605118169088', '408826094645542913', '410504219242790912'], 'type': 'multi' }, '894c54b7-f80f-4e87-b301-e685f630e7f3': { 'hidden': false, 'name': 'Roles', 'roles': ['408824753881612289', '408824634771767327', '408824686479278081'], 'type': 'multi' }, 'b1dfb0cc-2070-4142-84c1-ae4fd2e0357d': { 'hidden': false, 'name': 'Colors', 'roles': ['454102358209724426', '420899618243608577', '408860970996334592', '408834610093621249', '408827063605133314', '408836461291503616', '408834993683562498', '408885003733434369', '408884120194908171'], 'type': 'single' }, '7ab1f6c8-d348-409b-a0c8-de4bcd4fac75': { 'hidden': false, 'name': 'Tags', 'roles': ['408827583191318528', '408828684896829442', '408884752586899457', '408884848858628097', '414874340387979277'], 'type': 'multi' }, '4a5c1e4d-3c7f-4ce5-85bd-3cf08327838f': { 'hidden': true, 'name': 'Utility (Hidden)', 'roles': ['408822694700777482', '408822364567109633'], 'type': 'multi' } }, 'perms': { 'isAdmin': true, 'canManageRoles': true } }

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
    // const server = testState
    dispatch(updateCurrentServer(id, server))
    // console.log({ state, server, fullStore: getState() })
  } else {
    console.log('did not update')
  }
}
