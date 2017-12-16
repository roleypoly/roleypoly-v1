import React, { Component } from 'react'
import { Route } from 'react-router-dom'
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
        <Route path='/s/:server' component={RolePicker} />
        <Route path='/s/:server/edit' component={RolePicker} />
      </div>
    </div>
  }
}

export default Servers
