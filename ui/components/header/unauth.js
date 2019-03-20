// @flow
import * as React from 'react'
import HeaderBarCommon, { Logotype, type CommonProps } from './common'
import styled from 'styled-components'
import Link from 'next/link'

const LogoBox = styled.a`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
`

const LoginButton = styled.a`
  cursor: pointer;
  background-color: transparent;
  display: block;
  padding: 0.3em 1em;
  border-radius: 2px;
  border: 1px solid transparent;
  transition: all 0.3s ease-in-out;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 1px 2px rgba(0,0,0,0.75);
    background-color: var(--c-green);
    border-color: rgba(0,0,0,0.25);
    text-shadow: 1px 1px 0px rgba(0,0,0,0.25);
  }

  &:active {
    transform: translateY(0px);
    box-shadow: none;
  }
`

const HeaderBarUnauth: React.StatelessFunctionalComponent<CommonProps> = (props) => (
  <HeaderBarCommon {...props}>
    <>
      <Link href='/' prefetch>
        <LogoBox>
          <Logotype />
        </LogoBox>
      </Link>
      <Link href='/auth/login' prefetch>
        <LoginButton>Sign in →</LoginButton>
      </Link>
    </>
  </HeaderBarCommon>
)

export default HeaderBarUnauth
