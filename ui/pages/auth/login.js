// @flow
import * as React from 'react'
import styled from 'styled-components'
import MediaQuery from '../../kit/media'
import DiscordButton from '../../components/discord-button'
import RPC from '../../config/rpc'
import redirect from '../../lib/redirect'

type AuthLoginState = {
  humanCode: string,
  waiting: boolean
}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 3em;
  ${() => MediaQuery({
    md: `
      padding-top: 0;
      align-items: center;
      min-height: 80vh;
    `
  })}
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

  &:focus, &:active, &:hover {
    background-color: var(--c-3);
  }

  &:focus, &:active {
    & ::placeholder {
      color: transparent;
    }
  }

  & ::placeholder {
    transition: all 0.3s ease-in-out;
    color: var(--c-7);
    text-align: center;
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

export default class AuthLogin extends React.Component<{}, AuthLoginState> {
  state = {
    humanCode: '',
    waiting: false
  }

  static async getInitialProps (ctx, rpc) {
    if (ctx.user != null) {
      redirect(ctx, '/')
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
        redirect(null, '/')
      }
    } finally {
      this.setState({ waiting: false })
    }
  }

  render () {
    return <Wrapper>
      <div>
        <DiscordButton href='/api/auth/redirect'>Sign in with Discord</DiscordButton>
        <Line />
        <div>
          <i>Or, send a DM to <b>roleypoly</b>#3712 saying: login</i>
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
