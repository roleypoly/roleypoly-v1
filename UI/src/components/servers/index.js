import React, { Component } from 'react'
import { Scrollbars } from 'react-custom-scrollbars'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import { Route, Switch } from 'react-router-dom'
import Error404 from '../../pages/Error404'
import AddServer from '../add-server'
import RoleEditor from '../role-editor'
import RolePicker from '../role-picker'
import './index.sass'
import Navigation from './Navigation'

// import mockData from './mockData'

const mapState = ({ servers, user, appState }) => {
  return {
    servers,
    user,
    fade: appState.fade,
  }
}

class Servers extends Component {
  get defaultPath() {
    console.log(this.props.servers.toJS())

    const first = this.props.servers.first()
    if (first != null) {
      return first.get('id')
    }

    return 'add'
  }

  render() {
    return (
      <div className="servers">
        <Navigation
          className="servers__nav"
          servers={this.props.servers}
          user={this.props.user}
        />
        <div className="servers__content">
          <Scrollbars
            className={`fade-element ${this.props.fade ? 'fade' : ''}`}
            autoHeight
            autoHeightMax="calc(100vh - 80px)"
          >
            <Switch>
              <Route path="/s/add" component={AddServer} exact />
              <Route path="/s/:server/edit" component={RoleEditor} />
              <Route path="/s/:server" component={RolePicker} />
              <Route
                path="/s"
                exact
                render={() => <Redirect to={`/s/${this.defaultPath}`} />}
              />
              <Route component={Error404} />
            </Switch>
          </Scrollbars>
        </div>
      </div>
    )
  }
}

export default connect(mapState)(Servers)
