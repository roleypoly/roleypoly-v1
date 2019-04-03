// @flow
import * as React from 'react'
import dynamic from 'next/dynamic'
import { type User } from '../stores/user'

type Props = {
  user: ?User
}

const HeaderBarAuth = dynamic(() => import('../components/header/auth'))
const HeaderBarUnauth = dynamic(() => import('../components/header/unauth'))

const HeaderBar = (props: Props) => {
  if (props.user == null) {
    return <HeaderBarUnauth {...props} />
  } else {
    return <HeaderBarAuth {...props} />
  }
}

export default HeaderBar
