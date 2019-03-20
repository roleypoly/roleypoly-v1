// @flow
import * as React from 'react'
import Head from 'next/head'
import type { PageProps } from '../../types'
import SocialCards from '../../components/social-cards'
import redirect from '../../lib/redirect'
import { connect } from 'react-redux'
import { fetchServerIfNeed, getCurrentServerState, type ServerState } from '../../stores/currentServer'
import { renderRoles, getCurrentRoles } from '../../stores/roles'

type ServerPageProps = PageProps & {
  currentServer: ServerState
}

const mapStateToProps = (state, { router: { query: { id } } }) => {
  return {
    currentServer: getCurrentServerState(state, id),
    roles: getCurrentRoles(state, id)
  }
}

class Server extends React.Component<ServerPageProps> {
  static async getInitialProps (ctx: *, rpc: *, router: *) {
    if (ctx.user == null) {
      redirect(ctx, `/auth/login?r=${router.asPath}`)
    }

    ctx.robots = 'NOINDEX, NOFOLLOW'
    try {
      if (router.query.id == null) {
        console.warn({ query: router.query })
      }
      ctx.store.dispatch(fetchServerIfNeed(router.query.id, rpc))
      ctx.store.dispatch(renderRoles(router.query.id))
    } catch (e) {

    }
  }

  componentDidMount () {
    const { currentServer, router: { query: { id } }, dispatch } = this.props
    if (currentServer == null) {
      this.props.router.push('/s/add')
    }

    dispatch(fetchServerIfNeed(id))
  }

  render () {
    const { currentServer } = this.props
    console.log({ currentServer })
    if (currentServer == null) {
      return null
    }

    return (
      <div>
        <Head>
          <title key='title'>{currentServer.server.name} - Roleypoly</title>
        </Head>
        <SocialCards title={`${currentServer.server.name} on Roleypoly`} />
        hello <span style={{ color: currentServer.gm.color }}>{currentServer.gm.nickname}</span> on {currentServer.server.name}
      </div>
    )
  }
}

export default connect(mapStateToProps)(Server)
