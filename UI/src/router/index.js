import React, { Component, Fragment } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import Servers from '../components/servers'
import OauthCallback from '../components/oauth-callback'
import OauthFlow from '../components/oauth-flow'
import OauthBotFlow from '../components/oauth-bot-flow'
import Pages, { Landing, Error404 } from '../pages'
import ServerLanding from '../components/servers/ServerLanding'

const aaa = (props) => (<div>{ JSON.stringify(props) }</div>)

export default 
  @withRouter 
  @connect(({ appState, user }) => ({ ready: appState.ready, user })) 
class AppRouter extends Component {
  render () {
    const isLoggedIn = this.props.user.get('isLoggedIn')

    if (!this.props.ready) {
      return null
    }

    return <Switch>
      { (isLoggedIn === true) 
      
          // YES LOGGED IN
        ? <Route path='/s' component={Servers} />


          // NOT LOGGED IN
        : [<Route path='/s/:server' key={1} component={ServerLanding} />, <Route path='/s' key={2} render={() => <Redirect to="/" />} />]

      }
      
      {/* GENERAL ROUTES */}
      <Route path='/oauth/callback' component={OauthCallback} />
      <Route path='/oauth/flow' component={OauthFlow} />
      <Route path='/oauth/bot/flow' component={OauthBotFlow} />
      <Route path="/p/landing" exact component={Landing} />
      <Route path='/p' component={Pages} />
      <Route path='/help' component={Pages} />

      <Route exact path='/' render={() => 
        isLoggedIn 
        ? <Redirect to="/s" />
        : <Landing root={true} />
      } />

      <Route component={Error404} />
    </Switch>
  }
}
