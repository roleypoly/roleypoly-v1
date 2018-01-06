import React, { Component, Fragment } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import Servers from '../components/servers'
import OauthCallback from '../components/oauth-callback'
import OauthFlow from '../components/oauth-flow'
import OauthBotFlow from '../components/oauth-bot-flow'
import Pages, { Landing } from '../pages'

const aaa = (props) => (<div>{ JSON.stringify(props) }</div>)

@withRouter
@connect(({ appState, user }) => ({ ready: appState.ready, user }))
export default class AppRouter extends Component {
  render () {
    if (!this.props.ready) {
      return null
    }

    return <Switch>
      <Route path='/s' component={Servers} />
      
      <Route path='/root' component={aaa} />
      
      <Route path='/oauth/callback' component={OauthCallback} />
      <Route path='/oauth/flow' component={OauthFlow} />
      <Route path='/oauth/bot/flow' component={OauthBotFlow} />
      <Route path="/p/landing" exact component={Landing} />
      <Route path='/p' component={Pages} />
      <Route path='/help' component={Pages} />

      <Route exact path='/' render={() => 
        this.props.user.get('isLoggedIn') 
        ? <Redirect to="/s" />
        : <Landing root={true} />
      } />
    </Switch>
  }
}
