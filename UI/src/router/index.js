import React, { Component, Fragment } from 'react'
import { Route } from 'react-router-dom'
import { connect } from 'react-redux'

import Servers from '../components/servers'
import OauthCallback from '../components/oauth-callback'
import OauthFlow from '../components/oauth-flow'
import { withRouter } from 'react-router';

const aaa = (props) => (<div>{ JSON.stringify(props) }</div>)

@withRouter
@connect(({ appState }) => ({ ready: appState.ready }))
export default class AppRouter extends Component {
  render () {
    if (!this.props.ready) {
      return null
    }

    return <Fragment>
      <Route exact path='/' component={aaa} />
      <Route path='/s' component={Servers} />
      <Route path='/root' component={aaa} />
      <Route path='/oauth/callback' component={OauthCallback} />
      <Route path='/oauth/flow' component={OauthFlow} />
    </Fragment>
  }
}
