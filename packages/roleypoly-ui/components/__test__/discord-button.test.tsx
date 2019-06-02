/**
 *  @jest-environment jsdom
 */
/* eslint-env jest */
import * as React from 'react'
// import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'
import DiscordButton from '../discord-button'
import 'jest-styled-components'

describe('<DiscordButton />', () => {
  it('renders correctly', () => {
    const button = shallow(<DiscordButton>Hello!</DiscordButton>)
    expect(button).toMatchSnapshot()
    expect(button.text().trim()).toEqual('Hello!')
  })
})
