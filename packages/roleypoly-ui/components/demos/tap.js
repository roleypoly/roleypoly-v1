// @flow
import * as React from 'react'
import styled from 'styled-components'
import Role from '../role/demo'
import demoRoles from '../../config/demo'

const DemoWrapper = styled.div`
  justify-content: center;
  display: flex;
  flex-wrap: wrap;
`

export default () => <DemoWrapper>
  { demoRoles.map((v, i) => <Role key={i} role={v} />) }
</DemoWrapper>
