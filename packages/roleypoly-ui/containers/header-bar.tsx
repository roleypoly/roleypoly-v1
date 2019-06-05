import * as React from 'react'
// import dynamic from 'next/dynamic'
import HeaderBarAuth from '../components/header/auth'
import HeaderBarUnauth from '../components/header/unauth'
import { CommonProps } from '../components/header/common'
type Props = {
  user?: any,
  noBackground?: boolean
}

// dynamic import machine broke
// const HeaderBarAuth = dynamic<typeof HeaderBarAuthT>(() => import('../components/header/auth'))
// const HeaderBarUnauth = dynamic(() => import('../components/header/unauth'))

const HeaderBar = (props: Props & CommonProps) => {
  if (props.user === undefined) {
    return <HeaderBarUnauth {...props} />
  } else {
    return <HeaderBarAuth {...props} />
  }
}

export default HeaderBar
