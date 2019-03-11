// @flow
import * as React from 'react'
import HeaderBarCommon, { Logotype } from './common'

const HeaderBarUnauth: React.StatelessFunctionalComponent<{}> = () => (
  <HeaderBarCommon>
    <>
      <Logotype />
      Hey stranger.
    </>
  </HeaderBarCommon>
)

export default HeaderBarUnauth
