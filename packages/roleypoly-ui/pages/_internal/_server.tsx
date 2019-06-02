// @flow
import * as React from 'react'
import Head from 'next/head'
import { PageProps } from '../../types'
import SocialCards from '../../components/social-cards'
import redirect from '../../util/redirect'
// import { connect } from 'react-redux'
import styled from 'styled-components'
import Role from '../../components/role'

type ServerPageProps = PageProps & {
  currentServer: any,
  view: any,
  isDiscordBot: boolean
}

const Category = styled.div``

type HiderProps = {
  visible: boolean
  children?: any
}
const Hider = styled.div<HiderProps>``

const RoleHolder = styled.div`
  display: flex;
  flex-wrap: wrap;
`
class Server extends React.PureComponent<ServerPageProps> {
  static async getInitialProps (ctx: any, rpc: any, router: any) {
    const isDiscordBot = ctx.req && ctx.req.headers['user-agent'].includes('Discordbot')
    if (ctx.user == null) {
      if (!isDiscordBot) {
        redirect(ctx, `/auth/login?r=${router.asPath}`)
      }
    }

    ctx.robots = 'NOINDEX, NOFOLLOW'
    // await ctx.store.dispatch(fetchServerIfNeed(router.query.id, rpc))

    if (!isDiscordBot) {
      // await ctx.store.dispatch(renderRoles(router.query.id))
    }
    return { isDiscordBot }
  }

  async componentDidMount () {
    const { currentServer, router: { query: { id } }, dispatch } = this.props
    if (currentServer == null) {
      this.props.router.push('/s/add')
    }

    // await dispatch(fetchServerIfNeed(id))
    // await dispatch(renderRoles(id))
  }

  onToggle = (role) => (/*nextState*/) => {
    if (role.safe) {
      // this.props.dispatch(toggleRole(role.id, nextState))
    }
  }

  renderSocial () {
    const { currentServer } = this.props
    return <SocialCards title={`${currentServer.server.name} on Roleypoly`} description='Manage your roles here.' />
  }

  render () {
    const { isDiscordBot, currentServer, view } = this.props
    // console.log({ currentServer })
    if (currentServer == null) {
      return null
    }

    if (isDiscordBot) {
      return this.renderSocial()
    }

    return (
      <div>
        <Head>
          <title key='title'>{currentServer.server.name} - Roleypoly</title>
        </Head>
        { this.renderSocial() }
        hello <span style={{ color: currentServer.gm.color }}>{currentServer.gm.nickname }</span> on {currentServer.server.name} ({ view.dirty ? 'dirty' : 'clean' })
        <Hider visible={true || currentServer.id !== null}>
          { !view.invalidated && view.categories.map(c => <Category key={`cat__${c.name}__${c.id}`}>
            <div>{ c.name }</div>
            <RoleHolder>
              {
                c._roles && c._roles.map(r => <Role key={`role__${r.name}__${r.id}`} role={r} active={view.selected.includes(r.id)} onToggle={this.onToggle(r)} disabled={!r.safe} />)
              }
            </RoleHolder>
          </Category>) }
        </Hider>
      </div>
    )
  }
}

export default Server
