import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import superagent from 'superagent'
import * as Actions from './actions'
import * as UIActions from '../../actions/ui'
import './RolePicker.sass'

import Category from './Category'
import { Scrollbars } from 'react-custom-scrollbars';
import { Link } from 'react-router-dom';

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

  componentWillReceiveProps (nextProps) {
    if (this.props.match.params.server !== nextProps.match.params.server) {
      const { dispatch } = this.props
      dispatch(UIActions.fadeOut(() => dispatch(Actions.setup(nextProps.match.params.server))))
    }
  }

  isSelected = id => {
    return this.props.data.getIn([ 'rolesSelected', id ])
  }

  get rolesHaveChanged () {
    const { data } = this.props
    return !data.get('rolesSelected').equals(data.get('originalRolesSelected'))
  }

  renderServerMessage (server) {
    const roleManager = server.getIn(['perms', 'canManageRoles'])
    const msg = server.get('message')
    if (!roleManager && msg !== '') {
      return <section>
        <h3>Server Message</h3>
        <p>{msg}</p>
      </section>
    }

    if (roleManager) {
      return <section>
        <div className="role-picker__header">
          <h3>Server Message</h3>
            <Link to={`/s/${server.get('id')}/edit`} uk-tooltip='' title='Edit' uk-icon="icon: file-edit"></Link>
        </div>
        <p>{msg || <i>no server message</i>}</p>
      </section>
    }

    return null
  }

  render () {
    const { data, server, dispatch } = this.props
    const vm = data.get('viewMap') 

    if (server === undefined) {
      return null
    }

    return <div className={`inner role-picker ${(data.get('hidden')) ? 'hidden' : ''}`}>
      { this.renderServerMessage(server) }
      <section>
        <div className="role-picker__header">
          <h3>Roles</h3>
          <div className="role-picker__spacer"></div>
          <div className={`role-picker__actions ${(!this.rolesHaveChanged) ? 'hidden' : ''}`}>
            <button disabled={!this.rolesHaveChanged} onClick={() => dispatch(Actions.resetSelected)} className="uk-button rp-button secondary">
              Reset
            </button>
            <button disabled={!this.rolesHaveChanged} onClick={() => dispatch(Actions.submitSelected(this.props.match.params.server))} className="uk-button rp-button primary">
              Save Changes
            </button>
          </div>
        </div>
        <div className="role-picker__categories">
          {
            vm.map((c, name) => <Category key={name} name={name} category={c} isSelected={this.isSelected} onChange={(roles) => dispatch(Actions.updateRoles(roles))} />).toArray()
          }
        </div>
      </section>
    </div>
  }
}

export default RolePicker
