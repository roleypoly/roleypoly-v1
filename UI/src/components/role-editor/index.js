import React, { Component } from 'react'
import { Set } from 'immutable'
import { connect } from 'react-redux'
import * as Actions from './actions'
import * as PickerActions from '../role-picker/actions'
import * as UIActions from '../../actions/ui'
import './RoleEditor.sass'

import Category from './Category'
import Role from '../role'
import { Scrollbars } from 'react-custom-scrollbars';

const mapState = ({ rolePicker, roleEditor, servers }, ownProps) => ({
  rp: rolePicker,
  editor: roleEditor,
  server: servers.get(ownProps.match.params.server)
})

@connect(mapState)
class RoleEditor extends Component {
  componentWillMount () {
    const { dispatch, match: { params: { server } } } = this.props
    dispatch(PickerActions.setup(server))
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.match.params.server !== nextProps.match.params.server) {
      const { dispatch } = this.props
      dispatch(UIActions.fadeOut(() => dispatch(PickerActions.setup(nextProps.match.params.server))))
    }
  }

  render () {
    const vm = this.props.rp.get('viewMap')
    console.log(vm.toJS())
    return <div className="inner role-editor">
      <div className="role-editor__grid">
        <div className="role-editor__grid__left">
        <Scrollbars autoHeight autoHeightMax='calc(100vh - 110px)'>
          {
            vm
            .filter((_, k) => k !== 'Unassigned')
            .map((c, name) => <Category key={name} name={name} category={c} />)
            .toArray()
          }
        </Scrollbars>
        </div>
        <div className="role-editor__grid__right">
        {
          (vm.getIn(['Uncategorized', 'roles_map']) || Set())
          .sortBy(r => r.get('position'))
          .reverse()
          .map((r, k) => <Role key={k} role={r} type='drag' />)
          .toArray()
        }
        </div>
      </div>
    </div>
  }
}

export default RoleEditor
