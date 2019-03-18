// @flow
import * as React from 'react'
import GlobalColors from './global-colors'
import SocialCards from './social-cards'
import HeaderBar from '../containers/header-bar'
import { type User } from '../containers/user'
import styled from 'styled-components'

const ContentBox = styled.div`
  margin: 0 auto;
  width: 960px;
  max-width: 100vw;
  padding: 5px;
  /* padding-top: 50px; */
  overflow-y: scroll;
  max-height: calc(100vh - 50px);
`

const Layout = ({ children, user, noBackground }: {children: React.Element<any>, user: User, noBackground: boolean }) => <>
  <GlobalColors />
  <SocialCards />
  <div>
    <HeaderBar user={user} noBackground={noBackground} />
    <ContentBox>
      {children}
    </ContentBox>
  </div>
</>

export default Layout
