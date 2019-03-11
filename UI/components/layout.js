// @flow
import * as React from 'react'
import GlobalColors from './global-colors'
import SocialCards from './social-cards'
import HeaderBar from '../containers/header-bar'
import { type User } from '../containers/user'

const Layout = ({ children, user }: {children: React.Element<any>, user: User }) => <>
  <GlobalColors />
  <SocialCards />
  <div>
    <HeaderBar user={user} />
    {children}
  </div>
</>

export default Layout
