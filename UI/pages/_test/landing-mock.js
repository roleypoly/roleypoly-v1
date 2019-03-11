// @flow
import * as React from 'react'
import type { PageProps } from '../../types'
import HeaderBar from '../../containers/header-bar'
import { withCookies } from '../../config/rpc'
import { type UserPartial } from '../../../services/discord'

type InitialProps = {
  user: ?UserPartial
}

export default class LandingTest extends React.Component<PageProps & InitialProps> {
  static async getInitialProps (ctx: PageProps): Promise<InitialProps> {
    const rpc = withCookies(ctx)

    return {
      user: await rpc.getCurrentUser()
    }
  }

  render () {
    return <div>
      <HeaderBar user={this.props.user} />
    </div>
  }
}
