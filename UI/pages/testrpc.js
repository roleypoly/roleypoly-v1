import * as React from 'react'
import RPC from '../config/rpc'

export default class TestRPC extends React.Component {
  static async getInitialProps (ctx) {
    return {
      // hello: await RPC.hello('world')
    }
  }

  componentDidMount () {
    window.$RPC = RPC
  }

  componentDidCatch (error, errorInfo) {
    if (error) {
      console.log(error, errorInfo)
    }
  }

  render () {
    return <div>hello, { this.props.hello }</div>
  }
}
