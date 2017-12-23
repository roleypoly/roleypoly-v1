import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import superagent from 'superagent'
import * as Actions from './actions'
import './RolePicker.sass'

import Category from './Category'
import { Scrollbars } from 'react-custom-scrollbars';

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
      dispatch(Actions.setup(nextProps.match.params.server))
    }
  }

  isSelected = id => {
    return this.props.data.getIn([ 'rolesSelected', id ])
  }

  get rolesHaveChanged () {
    const { data } = this.props
    return !data.get('rolesSelected').equals(data.get('originalRolesSelected'))
  }

  render () {
    const { data, server, dispatch } = this.props
    const vm = data.get('viewMap') 

    if (server === undefined) {
      return null
    }

    return <div className={`inner role-picker ${(data.get('hidden')) ? 'hidden' : ''}`}>
      {/* <Scrollbars> */}
      { (server.get('message') !== '')
        ? <section>
            <h3>Server Message</h3>
            <p>{server.get('message')}</p>
          </section>
        : null
      }
      <section>
        <div className="role-picker__roles-header">
          <h3>Roles</h3>
          <div className="role-picker__spacer"></div>
          <div className={`role-picker__actions ${(!this.rolesHaveChanged) ? 'hidden' : ''}`}>
            <button disabled={!this.rolesHaveChanged} onClick={() => dispatch(Actions.resetSelected)} className="uk-button action__button secondary">
              Reset
            </button>
            <button disabled={!this.rolesHaveChanged} onClick={() => dispatch(Actions.submitSelected(this.props.match.params.server))} className="uk-button action__button primary">
              Save Changes
            </button>
          </div>
        </div>
        <div className="role-picker__categories">
          {
            vm.map((c, name) => <Category name={name} category={c} isSelected={this.isSelected} onChange={(roles) => dispatch(Actions.updateRoles(roles))} />).toArray()
          }
        </div>
      </section>
      {/* </Scrollbars> */}

    </div>
  }
}

export default RolePicker
