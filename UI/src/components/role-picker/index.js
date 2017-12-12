import React, { Component } from 'react'
import { connect } from 'react-redux'
import superagent from 'superagent'
import * as Actions from './actions'
import './RolePicker.sass'

import Role from '../role'

const mapState = ({ rolePicker, servers }, ownProps) => {
  console.log(servers)
  return {
    data: rolePicker,
    server: servers.get(ownProps.match.params.server)
  }
}

@connect(mapState)
class RolePicker extends Component {
  componentWillMount () {
    const { dispatch, match: { params: { server } } } = this.props
    dispatch(Actions.setup(server))
  }

  render () {
    console.log(this.props)
    if (this.props.server === undefined) {
      return null
    }

    return <div className={`role-picker ${(this.props.data.hidden) ? 'hidden' : ''}`}>
      { (this.props.server.get('message') !== '')
        ? <section>
            <h3>Server Message</h3>
            <p>{this.props.server.get('message')}</p>
          </section>
        : null
      }
      <section>
        <h3>Roles</h3>
          {/* {
            this.props.data.roles.map((r, k) => {
              return <Role key={k} role={r} onToggle={this.dispatch(Actions.roleUpdate(r.id, r.selected))} />
            })
          } */}
      </section>
    </div>
  }
}

export default RolePicker
