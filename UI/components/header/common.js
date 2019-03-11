// @flow
import * as React from 'react'
import DebugBreakpoints from '../../kit/debug-breakpoints'
import styled from 'styled-components'

export type CommonProps = {
  children: React.Element<any>
}

const Header = styled.div`
`

const HeaderInner = styled.div``

const HeaderBarCommon = ({ children }: CommonProps) => (
  <Header>
    <HeaderInner>
      { (process.env.NODE_ENV === 'development') && <DebugBreakpoints />}
      { children }
    </HeaderInner>
  </Header>
)

export default HeaderBarCommon
