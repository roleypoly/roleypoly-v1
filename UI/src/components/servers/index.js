import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { Scrollbars } from 'react-custom-scrollbars'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import './index.sass'

import Navigation from './Navigation'
import RolePicker from '../role-picker'
import RoleEditor from '../role-editor'

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
  render () {
    return <div className="servers">
      <Navigation className="servers__nav" servers={this.props.servers} user={this.props.user} />
      <div className='servers__content'>
        <Scrollbars className={`fade-element ${(this.props.fade) ? 'fade' : ''}`} autoHeight autoHeightMax='calc(100vh - 80px)'>
          <Route path='/s/:server' component={RolePicker} exact />
        </Scrollbars>
        <Route path='/s/:server/edit' component={RoleEditor} />
      </div>
    </div>
  }
}

export default Servers
