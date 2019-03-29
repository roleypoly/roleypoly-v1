/* eslint-env jest */
import * as React from 'react'
import { shallow } from 'enzyme'
import RoleDemo from './demo'

describe('<RoleDemo />', () => {
  it('renders', () => {
    const demo = shallow(<RoleDemo role={{ name: 'test demo role', color: '#ffffff' }} />)
    expect(demo.html()).toMatchSnapshot()
  })

  it('changes state when clicked', () => {
    const demo = shallow(<RoleDemo role={{ name: 'test demo role', color: '#ffffff' }} />)
    expect(demo.state().active).toEqual(false)
    demo.dive().simulate('click')
    expect(demo.state().active).toEqual(true)
  })
})
