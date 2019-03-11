// @flow
import * as React from 'react'
import HeaderBarCommon from './common'
import { type User } from '../../containers/user'

const HeaderBarAuth: React.StatelessFunctionalComponent<{ user: User }> = ({ user }) => (
  <HeaderBarCommon>
    <div>
      Hey there, {user.username}#{user.discriminator}
    </div>
  </HeaderBarCommon>
)

export default HeaderBarAuth
