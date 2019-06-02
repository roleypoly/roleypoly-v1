/**
 *  @jest-environment jsdom
 */
/* eslint-env jest */

import * as React from 'react'
// import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'
import Role from '../index'
import 'jest-styled-components'

describe('<Role />', () => {
  it('renders correctly', () => {
    const role = shallow(<Role role={{ name: 'Test Role', color: '#ffffff' }} />)
    expect(role).toMatchSnapshot()
  })

  it('triggers onToggle with new state', () => {
    let changed = false
    const role = shallow(
      <Role
        role={{ name: 'Test Role', color: '#ffffff' }}
        onToggle={(next) => { changed = next }}
        active={false}
      />
    )
    role.simulate('click')
    expect(changed).toBe(true)

    const role2 = shallow(
      <Role
        role={{ name: 'Test Role', color: '#ffffff' }}
        onToggle={(next) => { changed = next }}
        active
      />
    )
    role2.simulate('click')
    expect(changed).toBe(false)
  })

  it('fixes colors when they are not set', () => {
    const role = shallow(<Role role={{ name: 'Test Role', color: '0' }} />)
    expect(role.props().style['--role-color-base']).toEqual('hsl(0, 0%, 93.7%)')
  })

  it('has a single space for a name when empty', () => {
    const role = shallow(<Role role={{ name: '', color: '#ffffff' }} />)
    expect(role.text()).toEqual(' ')
  })

  describe('when disabled,', () => {
    it('handles touch hover events', () => {
      const el = <Role role={{ name: 'unsafe role', color: '#ffffff' }} disabled={true} />
      const role = shallow<typeof el>(el)

      role.simulate('touchstart')
      expect(role.state().hovering).toEqual(true)

      expect(role).toMatchSnapshot() // expecting tooltip
      expect(role.text().endsWith('This role has unsafe permissions.')).toBe(true)

      role.simulate('touchend')
      expect(role.state().hovering).toEqual(false)
    })

    it('does not trigger onToggle on click', () => {
      let changed = false
      const role = shallow(
        <Role
          role={{ name: 'Test Role', color: '#ffffff' }}
          onToggle={() => { changed = true }}
          active={changed}
          disabled
        />
      )
      expect(role).toMatchSnapshot()
      role.simulate('click')

      expect(role.html()).toBe(role.html())
      expect(changed).toBe(false)
    })
  })
})
