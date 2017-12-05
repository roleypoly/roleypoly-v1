import React, { Component, Fragment } from 'react'
import { Redirect } from 'react-router-dom'
import superagent from 'superagent'

class OauthCallback extends Component {
  state = {
    notReady: true,
    message: 'chotto matte kudasai...'
  }

  async componentDidMount () {
    // handle stuff in the url
    const sp = new URLSearchParams(this.props.location.search)
    const token = sp.get('code')

    if (token === '' || token == null) {
      this.setState({ message: 'token missing, what are you trying to do?!' })
      return
    } 
  

    this.props.history.replace(this.props.location.pathname)

    // pass token to backend, await it to finish it's business.
    try {
      await superagent.post('/api/auth/token').send({ token })
    } catch (e) {
      console.error('token pass error', e)
      this.setState({ message: 'g-gomen nasai... i broke it...' })
      return
    } 
    
    this.setState({ notReady: false })
    // update user stuff here
  }

  render () {
    return (this.state.notReady) ? this.state.message : <Redirect to='/s' />
  }
}

export default OauthCallback
