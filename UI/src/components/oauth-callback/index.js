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
    // handle stuff in the url
    const sp = new URLSearchParams(this.props.location.search)
    const token = sp.get('code')

    if (token === '' || token == null) {
      this.setState({ message: 'token missing, what are you trying to do?!' })
      return
    } 

    this.props.history.replace(this.props.location.pathname)
    
    let counter = 0    
    const retry = async () => {
      try {
        const rsp = await superagent.get('/api/auth/user')
        this.setState({ notReady: false })
        this.props.dispatch({
          type: Symbol.for('set user'),
          data: rsp.body
        })
        this.props.dispatch(fetchServers)
      } catch (e) {
        counter++
        if (counter > 12) {
          this.setState({ message: "i couldn't log you in. :c" })
        } else {
          setTimeout(() => { retry() }, 250) 
        }
      }
    }

    // pass token to backend, await it to finish it's business.
    try {
      await superagent.post('/api/auth/token').send({ token })
      // this.props.onLogin(rsp.body)
      
      retry()

    } catch (e) {
      console.error('token pass error', e)
      this.setState({ message: 'g-gomen nasai... i broke it...' })
      return
    } 
    

    // update user stuff here
  }

  render () {
    return (this.state.notReady) ? this.state.message : <Redirect to='/s' />
  }
}

export default OauthCallback
