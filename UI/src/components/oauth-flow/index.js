import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import superagent from 'superagent'
import { connect } from 'react-redux'
import { fetchServers } from '../../actions'

@connect()
class OauthCallback extends Component {
  state = {
    notReady: true,
    message: 'chotto matte kudasai...'
  }

  async componentDidMount () {
    const { body: { url } } = await superagent.get('/api/auth/redirect?url=✔️')
    try {
      const rsp = await superagent.get('/api/auth/user')
      this.props.dispatch({
        type: Symbol.for('set user'),
        data: rsp.body
      })
      this.props.dispatch(fetchServers)
      this.setState({ notReady: false })
    } catch (e) {
      window.location.href = url
    }
  }

  render () {
    return (this.state.notReady) ? this.state.message : <Redirect to='/s' />
  }
}

export default OauthCallback
