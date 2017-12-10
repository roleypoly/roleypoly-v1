import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import Radium from 'radium'
import superagent from 'superagent'
import './index.sass'

import Navigation from './Navigation'
import RolePicker from '../role-picker'

// import mockData from './mockData'

class Servers extends Component {
  async componentWillMount () {
    const rsp = await superagent.get(`/api/servers`)

    this.setState({ servers: rsp.body })
  }

  render () {
    return <div className="servers">
      <Navigation className="servers__nav" servers={[]} user={{}} />
      <div className="servers__content">
        <Route path='/s/:server' component={RolePicker} />
        <Route path='/s/:server/edit' component={RolePicker} />
      </div>
    </div>
  }
}

export default Radium(Servers)
