// @flow
import * as React from 'react'
import styled from 'styled-components'
import Role from '../role/demo'

const roles = [
  'cute', 'vanity', 'brave', 'proud', 'wonderful', '日本語'
]

const DemoWrapper = styled.div`
  text-align: center;
`

export default () => <DemoWrapper>
  { roles.map((v, i) => <Role key={i} role={{ name: `a ${v} role ♡`, color: `hsl(${(360 / roles.length) * i},40%,70%)` }} />) }
</DemoWrapper>
