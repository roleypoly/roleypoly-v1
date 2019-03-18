// @flow
// export default ({ id, icon, ...rest }) => <img src={`https://cdn.discordapp.com/icons/${id}/${icon}.png`} {...rest} />
import * as React from 'react'
import styled from 'styled-components'

export type GuildPicProps = {
  id: string,
  icon: string,
  name: string
}

export type GuildPicState = {
  src: ?string,
  ok: boolean
}

const Fallback = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: hsl(${(props: any) => '' + (props.serverName.codePointAt(0) % 360)},50%,50%);
`

export default class DiscordGuildPic extends React.Component<GuildPicProps, GuildPicState> {
  state = {
    src: this.src,
    ok: false
  }

  get src () {
    return `https://cdn.discordapp.com/icons/${this.props.id}/${this.props.icon}.png`
  }

  renderFallback () {
    const { name, id, icon, ...rest } = this.props
    return <Fallback serverName={name} {...rest}>{name[0]}</Fallback>
  }

  onError = () => {
    // console.log('onError')
    this.setState({
      src: null
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
    return (this.state.src === null) ? this.renderFallback() : this.renderImg()
  }
}
