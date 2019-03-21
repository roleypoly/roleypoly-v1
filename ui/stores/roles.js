// @flow
// import { action } from './servers'
import { namespaceConfig } from 'fast-redux'
import { OrderedMap, OrderedSet, Set } from 'immutable'
import { getCurrentServerState, type ServerState } from './currentServer'

type RenderedRole = {
  id: string,
  name: string,
  color: string
}

type RenderedCategory = {
  id: string,
  name: string,
  _roles?: RenderedRole[],
  roles: string[],
  type: 'single' | 'multi',
  hidden: boolean,
  position?: number,
}

const MOCK_DATA: RenderedCategory = {
  id: '00000',
  name: 'Placeholder Category',
  hidden: false,
  type: 'multi',
  roles: [ '00000' ],
  _roles: OrderedSet([
    { id: '00000', name: 'Placeholder Role', color: '#ff00ff' }
  ])
}

const DEFAULT_VIEW_STATE = { server: '000', invalidated: true, categories: [ MOCK_DATA ], selected: Set<string>([]), originalSelected: Set<string>([]), dirty: false }
export type ViewState = typeof DEFAULT_VIEW_STATE

export const { action, getState: getCategoryViewState } = namespaceConfig('currentCategoryView', DEFAULT_VIEW_STATE)

export const toggleRole = action('toggleRole', (state: ViewState, role: string, nextState: boolean) => {
  let selected = state.selected

  if (nextState === true) {
    selected = selected.add(role)
  } else {
    selected = selected.delete(role)
  }

  const dirty = !selected.equals(state.originalSelected)

  return {
    ...state,
    selected,
    dirty
  }
})

const getUncategorized = (roleMap: OrderedMap<RenderedRole>, allCategories: Set): RenderedCategory => {
  const roles = roleMap.keySeq().toSet()
  const knownRoles = allCategories.map(v => v.roles).flatMap(v => v)
  const rolesLeft = roles.subtract(knownRoles)

  // console.log(Map({ roles, knownRoles, rolesLeft }).toJS())
  return {
    id: 'Uncategorized',
    name: 'Uncategorized',
    position: -1,
    roles: rolesLeft,
    _roles: rolesLeft.map(v => roleMap.get(v)).filter(v => v != null),
    hidden: true,
    type: 'multi'
  }
}

export const updateCurrentView = action('updateCurrentView', (state, data) => ({ ...state, ...data }))
export const invalidateView = action('invalidateView', (state, data) => ({ ...state, invalidated: true }))

export const renderRoles = (id: string) => (dispatch: *, getState: *) => {
  const active = getCategoryViewState(getState())
  const current: ServerState = getCurrentServerState(getState(), id)
  if (!active.invalidated && current.id === active.id && active.id === id) {
    return
  }

  const { roles, categories } = current
  if (roles == null) {
    return
  }

  // console.log({ roles, categories })

  const roleMap: OrderedMap<RenderedRole> = roles.reduce((acc: OrderedMap<RenderedRole>, r) => acc.set(r.id, r), OrderedMap())

  let render = OrderedSet()
  for (let catId in categories) {
    const category = categories[catId]
    category._roles = OrderedSet(
      category.roles.map(r => roleMap.get(r))
    ).filter(role => role != null).sortBy(role => role ? -(role.position || 0) : 0)
    render = render.add(category)
  }
  // console.log({id})
  render = render.add(getUncategorized(roleMap, render.toSet()))
  render = render.sortBy(h => (h.position) ? h.position : h.name)

  dispatch(updateCurrentView({ server: id, categories: render, invalidated: false, selected: Set(current.gm.roles), originalSelected: Set(current.gm.roles) }))
}
