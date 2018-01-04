import React, { Component } from 'react'
import { Set } from 'immutable'
import { connect } from 'react-redux'
import { DropTarget } from 'react-dnd'
import { Link, Prompt, Redirect } from 'react-router-dom'
import { Scrollbars } from 'react-custom-scrollbars'
import * as Actions from './actions'
import * as PickerActions from '../role-picker/actions'
import * as UIActions from '../../actions/ui'
import './RoleEditor.sass'

import Category from './Category'
import CategoryEditor from './CategoryEditor'
import Role from '../role/draggable'

const mapState = ({ rolePicker, roleEditor, servers }, ownProps) => ({
  rp: rolePicker,
  editor: roleEditor,
  server: servers.get(ownProps.match.params.server)
})

@connect(mapState)
@DropTarget(Symbol.for('dnd: role'), {
  drop (props, monitor, element) {
    element.dropRole({}, 'Uncategorized')(monitor.getItem())
  },
  canDrop (props, monitor) {
    return (monitor.getItem().category !== 'Uncategorized')
  }
}, (connect, monitor) => ({ 
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  isOverCurrent: monitor.isOver({ shallow: true }),
  canDrop: monitor.canDrop(),
  itemType: monitor.getItemType()
}))
class RoleEditor extends Component {
  componentWillMount () {
    const { dispatch, match: { params: { server } } } = this.props
    dispatch(Actions.constructView(server))
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.match.params.server !== nextProps.match.params.server) {
      const { dispatch } = this.props
      dispatch(UIActions.fadeOut(() => dispatch(Actions.constructView(nextProps.match.params.server))))
    }
  }

  dropRole = (category, name) => ({role, category}) => {
    const { dispatch } = this.props
    console.log(role)
    dispatch(Actions.addRoleToCategory(name, category, role))
  }

  createCategory = () => {
    const { dispatch } = this.props
    dispatch(Actions.createCategory)    
  }

  saveCategory = (category, name) => () => {
    const { dispatch } = this.props
    dispatch(Actions.saveCategory(name, category))    
  }

  deleteCategory = (category, id) => () => {
    const { dispatch } = this.props
    dispatch(Actions.deleteCategory(id, category))    
  }

  openEditor = (category, name) => () => {
    const { dispatch } = this.props
    dispatch(Actions.openEditor(name))
  }

  editCategory = (category, id) => (key, type) => event => {
    const { dispatch } = this.props
    let value

    switch (type) {
      case Symbol.for('edit: text'):
        value = event.target.value
        break

      case Symbol.for('edit: bool'):
        value = event.target.checked
        break
      
      case Symbol.for('edit: select'):
        value = event.target.value
        break
      
      default:
        value = null
    }

    dispatch(Actions.editCategory({ category, id, key, type, value }))
  }

  resetServer = () => {
    const { dispatch } = this.props
    dispatch({ type: Symbol.for('re: reset') })
  }

  saveServer = () => {
    const { dispatch, match: { params: { server } } } = this.props
    dispatch(Actions.saveServer(server))
  }

  get hasChanged () {
    return this.props.editor.get('originalSnapshot').hashCode() !== this.props.editor.get('viewMap').hashCode()
  }

  render () {
    const { server } = this.props
    if (server.getIn(['server', 'perms', 'canManageRoles']) !== true) {
      return <Redirect to={`/s/${server.get('id')}`} />
    }

    const vm = this.props.editor.get('viewMap')
    return <div className="inner role-editor">
      <Prompt when={this.hasChanged} message="Are you sure you want to leave? You have unsaved changes that will be lost." />
      <div className="role-picker__header" style={{ marginBottom: 10 }}>
        <h3>{this.props.server.getIn(['server','name'])}</h3>
        <div className="role-picker__spacer"></div>
        <div className={`role-picker__actions ${(!this.hasChanged) ? 'hidden' : ''}`}>
          <button onClick={this.resetServer} disabled={!this.hasChanged} className="uk-button rp-button secondary">
            Reset
          </button>
          <button onClick={this.saveServer} disabled={!this.hasChanged} className="uk-button rp-button primary">
            Save Changes
          </button>
        </div>
      </div>
      <div className="role-editor__grid">
        <div className="role-editor__grid__left">
        <Scrollbars autoHeight autoHeightMax='calc(100vh - 110px)'>
          {
            vm
              .filter((_, k) => k !== 'Uncategorized')
              .map((c, name) => <Category 
                key={name} 
                name={name} 
                category={c} 
                mode={c.get('mode')} 
                onDrop={this.dropRole(c, name)} 
                onEdit={this.editCategory(c, name)}
                onEditOpen={this.openEditor(c, name)}
                onSave={this.saveCategory(c, name)}
                onDelete={this.deleteCategory(c, name)}
                />)
              .toArray()
          }
          <div onClick={this.createCategory} uk-tooltip="pos: bottom" title="Add new category" className="role-editor__category add-button">
            <i uk-icon="icon: plus" />
          </div>
        </Scrollbars>
        </div>
        {
          this.props.connectDropTarget(
          <div className={`role-editor__grid__right drop-zone ${(this.props.canDrop) ? 'can-drop' : ''} ${(this.props.isOver && this.props.canDrop) ? 'is-over' : ''}`}>
            <Scrollbars autoHeight autoHeightMax='calc(100vh - 145px)'>
              <div className="role-editor__uncat-zone">
              {
                (vm.getIn(['Uncategorized', 'roles_map']) || Set())
                  .sortBy(r => r.get('position'))
                  .reverse()
                  .map((r, k) => <Role key={k} categoryId='Uncategorized' role={r} />)
                  .toArray()
              }
              {
                (this.props.editor.get('hasSafeRoles') !== true)
                ? <div className="role-editor__alert">
                    <Link to="/help/why-no-roles">Why are there no roles here? <i uk-icon="icon: info" /></Link>
                  </div>
                : null
              }
              </div>
            </Scrollbars>
          </div>)
        }
      </div>
    </div>
  }
}

export default RoleEditor
