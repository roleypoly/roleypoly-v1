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

const HeaderBarUnauth: React.StatelessFunctionalComponent<CommonProps> = (props) => (
  <HeaderBarCommon {...props}>
    <>
      <Link href='/' prefetch>
        <LogoBox>
          <Logotype />
        </LogoBox>
      </Link>
      Hey stranger.
    </>
  </HeaderBarCommon>
)

export default HeaderBarUnauth
