import React, { Component, Fragment } from 'react'
import { Route } from 'react-router-dom'

import Servers from '../components/servers'
import OauthCallback from '../components/oauth-callback'

const aaa = (props) => (<div>{ JSON.stringify(props) }</div>)

export default class AppRouter extends Component {
  render () {
    return <Fragment>
      <Route exact path='/' component={aaa} />
      <Route path='/s' component={Servers} />
      <Route path='/root' component={aaa} />
      <Route path='/oauth/callback' component={OauthCallback} />
    </Fragment>
  }
}
