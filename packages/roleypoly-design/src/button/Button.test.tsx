import * as React from 'react'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import 'jest-styled-components'

import Button from './Button'
// import { StyledLoadingButton } from './styled'
// import { ButtonProps } from './types'

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

describe('<StyledLoadingButton />', () => {
  // it('clamps between 0-100%', () => {
  //   const button = shallow<ButtonProps>(<StyledLoadingButton loadingPct={-100} />)

  // })
})
