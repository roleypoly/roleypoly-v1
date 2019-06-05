import * as React from 'react'
import styled from 'styled-components'

export type GuildPicProps = {
  id: string,
  icon: string,
  name: string
}

export type GuildPicState = {
  src: string | undefined,
  ok: boolean
}

const Fallback = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--fallback-color);
`

export default class DiscordGuildPic extends React.Component<GuildPicProps, GuildPicState> {
  state: GuildPicState = {
    src: undefined,
    ok: true
  }

  static getDerivedStateFromProps (nextProps: any, prevState: GuildPicState): GuildPicState {
    return {
      ...prevState,
      src: `https://cdn.discordapp.com/icons/${nextProps.id}/${nextProps.icon}.png`
    }
  }

  renderFallback () {
    const { name, id, icon, ...rest } = this.props
    // @ts-ignore
    return <Fallback
      serverName={name}
      style={{
        ['--fallback-color' as any]: `hsl(${(name.codePointAt(0) || 0 % 360)},50%,50%)`
      }}
      {...rest}
    >
      {name[0]}
    </Fallback>
  }

  onError = () => {
    // console.log('onError')
    this.setState({
      ok: false
    })
  }

  onLoad = () => {
    this.setState({
      ok: true
    })
  }

  renderImg () {
    const { name, id, icon, ...rest } = this.props
    return <img src={this.state.src} onError={this.onError} onLoad={this.onLoad} {...rest} />
  }

  render () {
    return (this.state.ok === false) ? this.renderFallback() : this.renderImg()
  }

}
