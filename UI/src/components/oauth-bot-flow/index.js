import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import superagent from 'superagent'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { fetchServers } from '../../actions'

@connect()
class OauthCallback extends Component {
  state = {
    notReady: true,
    message: 'chotto matte kudasai...',
    url: null
  }

  async componentDidMount () {
    const { body: { url } } = await superagent.get('/api/oauth/bot?url=✔️')
    this.setState({ url, notReady: false })
    window.location.href = url
  }

  render () {
    return (this.state.notReady) ? this.state.message : <a style={{zIndex: 10000}} href={this.state.url}>Something oopsed, click me to get to where you meant.</a>
  }
}

export default OauthCallback
