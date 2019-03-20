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
  background-color: ${({ noBackground }: any) => noBackground === false ? 'var(--c-dark);' : 'var(--c-1);'}
  position: relative;
  transition: background-color 0.3s ease-in-out;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
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

const HeaderBarCommon = ({ children, noBackground = false }: CommonProps) => (
  <Header noBackground={noBackground}>
    { (process.env.NODE_ENV === 'development') && <DebugBreakpoints />}
    <HeaderInner>
      { children }
    </HeaderInner>
  </Header>
)

export default HeaderBarCommon
