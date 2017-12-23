import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { Scrollbars } from 'react-custom-scrollbars'
import { connect } from 'react-redux'
import './index.sass'

import Navigation from './Navigation'
import RolePicker from '../role-picker'
import { withRouter } from 'react-router';

// import mockData from './mockData'

const mapState = ({ servers, user }) => {
  return {
    servers,
    user
  }
}

@connect(mapState)
class Servers extends Component {
  render () {
    return <div className="servers">
      <Navigation className="servers__nav" servers={this.props.servers} user={this.props.user} />
        <div className="servers__content">
          <Scrollbars autoHeight autoHeightMax='calc(100vh - 80px)'>
            <Route path='/s/:server' component={RolePicker} />
            <Route path='/s/:server/edit' component={RolePicker} />
          </Scrollbars>
        </div>
    </div>
  }
}

export default Servers
