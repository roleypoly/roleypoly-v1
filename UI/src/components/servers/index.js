import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import { Scrollbars } from 'react-custom-scrollbars'
import { connect } from 'react-redux'
import { withRouter, Redirect } from 'react-router'
import './index.sass'

import Navigation from './Navigation'
import RolePicker from '../role-picker'
import RoleEditor from '../role-editor'
import AddServer from '../add-server'

// import mockData from './mockData'

const mapState = ({ servers, user, appState }) => {
  return {
    servers,
    user,
    fade: appState.fade
  }
}

@connect(mapState)
class Servers extends Component {
  get defaultPath () {
    const first = this.props.servers.first()
    if (first != null) {
      return first.get('id')
    }

    return 'add'
  }

  render () {
    return <div className="servers">
      <Navigation className="servers__nav" servers={this.props.servers} user={this.props.user} />
      <div className='servers__content'>
        <Switch>
          <Route path='/s/' exact render={() => <Redirect to={`/s/${this.defaultPath}`} />} />
          <Route path='/s/:server/edit' component={RoleEditor} />
          <Route path='/s/:server' render={() =>
            <Scrollbars className={`fade-element ${(this.props.fade) ? 'fade' : ''}`} autoHeight autoHeightMax='calc(100vh - 80px)'>
              <Switch>
                <Route path='/s/add' component={AddServer} exact />
                <Route path='/s/:server' component={RolePicker} exact />
              </Switch>
            </Scrollbars>
          } />
        </Switch>
      </div>
    </div>
  }
}

export default Servers
