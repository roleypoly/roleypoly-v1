import * as React from 'react'
import { shallow } from 'enzyme'
import * as sinon from 'sinon'

import Button from './Button'

describe('<Button />', () => {
  it('calls onButtonPress when not disabled', () => {
    const spy = sinon.spy()
    const b = shallow(<Button onButtonPress={spy}>Testing</Button>)
    b.simulate('click')

    expect(spy.calledOnce).toBeTruthy()
  })

  it('does not call onButtonPress when disabled', () => {
    const spy = sinon.spy()
    const b = shallow(<Button disabled onButtonPress={spy}>Testing</Button>)
    b.simulate('click')

    expect(spy.notCalled).toBeTruthy()
  })
})
