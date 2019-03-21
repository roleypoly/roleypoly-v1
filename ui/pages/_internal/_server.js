// @flow
import * as React from 'react'
import Head from 'next/head'
import type { PageProps } from '../../types'
import SocialCards from '../../components/social-cards'
import redirect from '../../lib/redirect'
import { connect } from 'react-redux'
import { fetchServerIfNeed, getCurrentServerState, type ServerState } from '../../stores/currentServer'
import { renderRoles, getCategoryViewState, toggleRole, type ViewState } from '../../stores/roles'
import styled from 'styled-components'
import Role from '../../components/role'

type ServerPageProps = PageProps & {
  currentServer: ServerState,
  view: ViewState,
  isDiscordBot: boolean
}

const mapStateToProps = (state, { router: { query: { id } } }) => {
  return {
    currentServer: getCurrentServerState(state, id),
    view: getCategoryViewState(state)
  }
}

const Category = styled.div``

const Hider = styled.div`
  /* opacity: ${(props: any) => props.visible ? '1' : '0'}; */
  /* opacity: 1; */
  /* transition: opacity 0.15s ease-out; */
  /* ${(props: any) => props.visible ? '' : 'display: none;'} */
`

const RoleHolder = styled.div`
  display: flex;
  flex-wrap: wrap;
`
class Server extends React.Component<ServerPageProps> {
  static async getInitialProps (ctx: *, rpc: *, router: *) {
    const isDiscordBot = ctx.req && ctx.req.headers['user-agent'].includes('Discordbot')
    if (ctx.user == null) {
      if (!isDiscordBot) {
        redirect(ctx, `/auth/login?r=${router.asPath}`)
      }
    }

    ctx.robots = 'NOINDEX, NOFOLLOW'
    await ctx.store.dispatch(fetchServerIfNeed(router.query.id, rpc))

    if (!isDiscordBot) {
      await ctx.store.dispatch(renderRoles(router.query.id))
    }
    return { isDiscordBot }
  }

  async componentDidMount () {
    const { currentServer, router: { query: { id } }, dispatch } = this.props
    if (currentServer == null) {
      this.props.router.push('/s/add')
    }

    await dispatch(fetchServerIfNeed(id))
    await dispatch(renderRoles(id))
  }

  onToggle = (role) => (nextState) => {
    if (role.safe) {
      this.props.dispatch(toggleRole(role.id, nextState))
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
        hello <span style={{ color: currentServer.gm.color }}>{currentServer.gm.nickname}</span> on {currentServer.server.name} ({ view.dirty ? 'dirty' : 'clean' })
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

export default connect(mapStateToProps)(Server)
