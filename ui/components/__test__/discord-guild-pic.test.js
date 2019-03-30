/* eslint-env jest */
import * as React from 'react'
// import renderer from 'react-test-renderer'
import { shallow, mount } from 'enzyme'
import DiscordGuildPic from '../discord-guild-pic'
import 'jest-styled-components'

describe('<DiscordGuildPic />', () => {
  const mockServer = {
    id: '0000',
    icon: 'aaa',
    name: 'Mock'
  }

  it('renders a snapshot', () => {
    const pic = mount(<DiscordGuildPic {...mockServer} />)
    expect(pic).toMatchSnapshot()
  })

  it('renders a well-formatted guild pic correctly', () => {
    const pic = shallow(<DiscordGuildPic {...mockServer} />)
    const expectedSrc = `https://cdn.discordapp.com/icons/${mockServer.id}/${mockServer.icon}.png`
    expect(pic.find('img').prop('src')).toEqual(expectedSrc)
  })

  it('falls-back to a default when things go bad.', () => {
    const pic = mount(<DiscordGuildPic {...mockServer} />)
    pic.find('img').simulate('error')
    expect(pic).toMatchSnapshot()

    expect(pic.text()).toEqual(mockServer.name[0])
  })
})
