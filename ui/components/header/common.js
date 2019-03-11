// @flow
import * as React from 'react'
import dynamic from 'next/dynamic'
import styled from 'styled-components'
import * as logo from '../logo'

export type CommonProps = {
  children: React.Element<any>
}

const Header = styled.div`
  background-color: var(--c-dark);

`

const HeaderInner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 960px;
  width: 100vw;
  margin: 0 auto;
  height: 50px;
`

export const Logotype = styled(logo.Logotype)`
  height: 30px;
`

export const Logomark = styled(logo.Logomark)`
  width: 50px;
  height: 50px;
`

const DebugBreakpoints = dynamic(() => import('../../kit/debug-breakpoints'))

const HeaderBarCommon = ({ children }: CommonProps) => (
  <Header>
    <HeaderInner>
      { (process.env.NODE_ENV === 'development') && <DebugBreakpoints />}
      { children }
    </HeaderInner>
  </Header>
)

export default HeaderBarCommon
