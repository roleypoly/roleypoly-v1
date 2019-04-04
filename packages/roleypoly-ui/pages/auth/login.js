// @flow
import * as React from 'react'
import styled from 'styled-components'
import { md } from '../../kit/media'
import DiscordButton from '../../components/discord-button'
import RPC from '../../config/rpc'
import redirect from '../../util/redirect'
import dynamic from 'next/dynamic'
import type { PageProps } from '../../types'
import type { ServerSlug } from '@roleypoly/types'
import getConfig from 'next/config'
const { publicRuntimeConfig: { BOT_HANDLE } } = getConfig()

type AuthLoginState = {
  humanCode: string,
  waiting: boolean
}

type AuthLoginProps = PageProps & {
  redirect: ?string,
  redirectSlug: ?ServerSlug
}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 3em;
  width: 400px;
  max-width: calc(98vw - 10px);
  margin: 0 auto;
  text-align: center;
  ${md`
    padding-top: 0;
    align-items: center;
    min-height: 80vh;
  `}
`

const Line = styled.div`
  height: 1px;
  background-color: var(--c-9);
  margin: 1em 0.3em;
`

const SecretCode = styled.input`
  background-color: transparent;
  border: 0;
  padding: 1em;
  color: var(--c-9);
  margin: 0.5rem 0;
  width: 100%;
  font-size: 0.9em;
  appearance: none;
  transition: all 0.3s ease-in-out;

  & ::placeholder {
    transition: all 0.3s ease-in-out;
    color: var(--c-7);
    text-align: center;
  }

  &:focus,
  &:active,
  &:hover {
    background-color: var(--c-3);
  }

  &:focus,
  &:active {
    & ::placeholder {
      color: transparent;
    }
  }
`

const HiderButton = styled.button`
  appearance: none;
  display: block;
  cursor: pointer;
  width: 100%;
  background-color: var(--c-3);
  color: var(--c-white);
  border: none;
  padding: 1em;
  font-size: 0.9em;
  transition: all 0.3s ease-in-out;

  &[disabled] {
    cursor: default;
    opacity: 0;
    pointer-events: none;
  }
`
const SlugWrapper = styled.div`
  padding-bottom: 2em;
  text-align: center;
`

const DiscordGuildPic = dynamic(() => import('../../components/discord-guild-pic'))
const StyledDGP = styled(DiscordGuildPic)`
  border-radius: 100%;
  border: 2px solid rgba(0, 0, 0, 0.2);
  height: 4em;
  margin-top: 1em;
`

const ServerName = styled.span`
  font-weight: bold;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 370px;
  display: block;
`

const Slug = (slug: ServerSlug) => <SlugWrapper>
  <StyledDGP {...slug} />
  <br />Hey there.<br /><ServerName>{slug.name}</ServerName> uses Roleypoly to manage its roles.
</SlugWrapper>

export default class AuthLogin extends React.Component<AuthLoginProps, AuthLoginState> {
  state = {
    humanCode: '',
    waiting: false
  }

  static async getInitialProps (ctx: *, rpc: typeof RPC, router: *) {
    let { r } = (router.query: { r: string })

    if (ctx.user != null) {
      redirect(ctx, r || '/')
    }

    ctx.robots = 'NOINDEX, NOFOLLOW'

    if (r != null) {
      let redirectSlug = null
      if (r.startsWith('/s/') && r !== '/s/add') {
        redirectSlug = await rpc.getServerSlug(r.replace('/s/', ''))
      }
      return { redirect: r, redirectSlug }
    }
  }

  componentDidMount () {
    if (this.props.redirect != null) {
      this.props.router.replace(this.props.router.pathname)
    }
  }

  onChange = (event: any) => {
    this.setState({ humanCode: event.target.value })
  }

  onSubmit = async () => {
    this.setState({ waiting: true })
    try {
      const result = await RPC.checkAuthChallenge(this.state.humanCode)
      if (result === true) {
        redirect(null, this.props.redirect || '/')
      }
    } catch (e) {
      this.setState({ waiting: false })
    }
  }

  get dm () {
    if (BOT_HANDLE) {
      const [username, discrim] = BOT_HANDLE.split('#')
      return <><b>{ username }</b>#{discrim}</>
    }

    return <><b>roleypoly</b>#3712</>
  }

  render () {
    return <Wrapper>
      <div>
        {(this.props.redirectSlug != null) ? <Slug {...this.props.redirectSlug} /> : null}
        <DiscordButton href={`/api/auth/redirect?r=${this.props.redirect || '/'}`}>Sign in with Discord</DiscordButton>
        <Line />
        <div>
          <i>Or, send a DM to {this.dm} saying: login</i>
        </div>
        <div>
          <SecretCode placeholder='click to enter super secret code' onChange={this.onChange} value={this.state.humanCode} />
          <HiderButton onClick={this.onSubmit} disabled={this.state.humanCode === ''}>{
            (this.state.waiting) ? 'One sec...' : 'Submit Code →'
          }</HiderButton>
        </div>
      </div>
    </Wrapper>
  }
}
