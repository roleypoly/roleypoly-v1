// @flow
import * as React from 'react'
import dynamic from 'next/dynamic'
import styled from 'styled-components'
import * as logo from '../logo'

export type CommonProps = {
  children: React.Element<any>,
  noBackground: boolean
}

const Header = styled.div`
  ${({ noBackground }: any) => noBackground === false ? 'background-color: var(--c-dark);' : ''}
  position: relative;
  transition: background-color 0.3s ease-in-out;
`

const HeaderInner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 960px;
  width: 100vw;
  margin: 0 auto;
  height: 50px;
  padding: 3px 5px;
  position: relative;
  top: -1px;

  & > div {
    margin: 0 0.5em;
  }
`

export const Logotype = styled(logo.Logotype)`
  height: 30px;
`

export const Logomark = styled(logo.Logomark)`
  width: 40px;
  height: 40px;
`
//
const DebugBreakpoints = dynamic(() => import('../../kit/debug-breakpoints'))

const HeaderBarCommon = ({ children, noBackground }: CommonProps) => (
  <Header noBackground={noBackground}>
    { (process.env.NODE_ENV === 'development') && <DebugBreakpoints />}
    <HeaderInner>
      { children }
    </HeaderInner>
  </Header>
)

export default HeaderBarCommon
