import * as React from 'react'
import RPC, { withCookies } from '../config/rpc'

export default class TestRPC extends React.Component {
  static async getInitialProps (ctx) {
    const user = await withCookies(ctx).getCurrentUser()
    console.log(user)
    return {
      user
    }
  }

  async componentDidMount () {
    window.$RPC = RPC
  }

  componentDidCatch (error, errorInfo) {
    if (error) {
      console.log(error, errorInfo)
    }
  }

  render () {
    if (this.props.user == null) {
      return <div>hello stranger OwO</div>
    }

    const { username, avatar, discriminator } = this.props.user
    return <div>hello, {username}#{discriminator} <img src={avatar} width={50} height={50} /></div>
  }
}
