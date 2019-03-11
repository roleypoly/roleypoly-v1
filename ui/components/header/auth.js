// @flow
import * as React from 'react'
import HeaderBarCommon, { Logomark } from './common'
import { type User } from '../../containers/user'

const HeaderBarAuth: React.StatelessFunctionalComponent<{ user: User }> = ({ user }) => (
  <HeaderBarCommon>
    <>
      <Logomark />
      Hey there, {user.username}#{user.discriminator}
    </>
  </HeaderBarCommon>
)

export default HeaderBarAuth
