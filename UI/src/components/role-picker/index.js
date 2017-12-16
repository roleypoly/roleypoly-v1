import React, { Component } from 'react'
import { connect } from 'react-redux'
import superagent from 'superagent'
import * as Actions from './actions'
import './RolePicker.sass'

import Role from '../role'

const mapState = ({ rolePicker, servers }, ownProps) => {
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

  isSelected (id) {
    return this.props.data.getIn([ 'rolesSelected', id ])
  }

  render () {
    console.log(this.constructor.name, this.props)
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
          {
            this.props.server.get('roles').map((r, k) => {
              return <Role key={k} role={r} selected={this.isSelected(r.get('id'))} onToggle={() => this.props.dispatch(Actions.roleUpdate(r.get('id'), this.isSelected(r.get('id'))))} />
            })
          }
      </section>
    </div>
  }
}

export default RolePicker
