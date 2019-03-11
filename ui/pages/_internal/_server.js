// @flow
import * as React from 'react'
import Head from 'next/head'
import type { PageProps } from '../../types'
import SocialCards from '../../components/social-cards'

export default class Server extends React.Component<PageProps> {
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
