import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import superagent from 'superagent'
import { connect } from 'react-redux'
import uuidv4 from 'uuid/v4'
import { fetchServers } from '../../actions'

class OauthCallback extends Component {
  state = {
    notReady: true,
    message: 'sending you to discord...',
    redirect: '/s',
    url: null,
  }

  async fetchUser() {
    const rsp = await superagent.get('/api/auth/user')
    sessionStorage.setItem('user', JSON.stringify(rsp.body))
    sessionStorage.setItem('user.update', JSON.stringify(Date.now()))
    this.props.dispatch({
      type: Symbol.for('set user'),
      data: rsp.body,
    })
  }

  setupUser() {
    const userUpdateTime = sessionStorage.getItem('user.update') || 0
    if (+userUpdateTime + 1000 * 60 * 10 > Date.now()) {
      const user = sessionStorage.getItem('user')
      if (user != null && user !== '') {
        this.props.dispatch({
          type: Symbol.for('set user'),
          data: JSON.parse(user),
        })
      }
    }

    return this.fetchUser()
  }

  async componentDidMount() {
    const state = uuidv4()

    const oUrl = new URL(window.location.href)
    if (oUrl.searchParams.has('r')) {
      this.setState({ redirect: oUrl.searchParams.get('r') })
    }

    window.sessionStorage.setItem(
      'state',
      JSON.stringify({ state, redirect: oUrl.searchParams.get('r') })
    )

    try {
      await this.setupUser()

      this.props.dispatch(fetchServers)
      this.setState({ notReady: false })
    } catch (e) {
      const {
        body: { url },
      } = await superagent.get('/api/auth/redirect?url=✔️')
      const nUrl = new URL(url)

      nUrl.searchParams.set('state', state)
      this.setState({ url: nUrl.toString() })
      window.location.href = nUrl.toString()
    }
  }

  render() {
    return this.state.notReady ? (
      this.state.message
    ) : (
      <>
        <Redirect to={this.state.redirect} />
        <a style={{ zIndex: 10000 }} href={this.state.url}>
          Something oopsed, click me to get to where you meant.
        </a>
      </>
    )
  }
}

export default connect()(OauthCallback)
