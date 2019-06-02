import * as React from 'react'
import dynamic from 'next/dynamic'
import { User } from '../stores/user'
import HeaderBarAuthT from '../components/header/auth'
import HeaderBarUnauthT from '../components/header/unauth'
type Props = {
  user?: User
}

const HeaderBarAuth = dynamic<typeof HeaderBarAuthT>(() => import('../components/header/auth'))
const HeaderBarUnauth = dynamic<typeof HeaderBarUnauthT>(() => import('../components/header/unauth'))

const HeaderBar = (props: Props) => {
  if (props.user === undefined) {
    return <HeaderBarUnauth {...props} />
  } else {
    return <HeaderBarAuth {...props} />
  }
}

export default HeaderBar
