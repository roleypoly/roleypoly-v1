import React, { Component } from 'react'
import Radium from 'radium'
import './index.css'

import Navigation from './Navigation'

import mockData from './mockData'

class Servers extends Component {
  render () {
    return <div className="servers">
      <Navigation className="servers__nav" servers={mockData.servers} user={mockData.user} />
      <div className="servers__content">
        {/* another router probably. */}
      </div>
    </div>
  }
}

export default Radium(Servers)
