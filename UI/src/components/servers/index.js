import React, { Component } from 'react'
import Radium from 'radium'
import superagent from 'superagent'
import './index.css'

import Navigation from './Navigation'

import mockData from './mockData'

class Servers extends Component {
  state = {
    user: mockData.user,
    servers: [],
  }

  async componentWillMount () {
    const rsp = await superagent.get(`/api/~/relevant-servers/62601275618889728`)

    this.setState({ servers: rsp.body })
  }

  render () {
    return <div className="servers">
      <Navigation className="servers__nav" servers={this.state.servers} user={this.state.user} />
      <div className="servers__content">
        {/* another router probably. */}
      </div>
    </div>
  }
}

export default Radium(Servers)
