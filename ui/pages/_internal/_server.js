// @flow
import * as React from 'react'
import Head from 'next/head'
import type { PageProps } from '../../types'
import SocialCards from '../../components/social-cards'
import redirect from '../../lib/redirect'

export default class Server extends React.Component<PageProps> {
  static async getInitialProps (ctx: *, rpc: *, router: *) {
    if (ctx.user == null) {
      redirect(ctx, `/auth/login?r=${router.asPath}`)
    }

    ctx.robots = 'NOINDEX, NOFOLLOW'
  }

  render () {
    return (
      <div>
        <Head>
          <title key='title'>server name!</title>
        </Head>
        <SocialCards title={'server test'} />
        hello {this.props.router.query.id}
      </div>
    )
  }
}
