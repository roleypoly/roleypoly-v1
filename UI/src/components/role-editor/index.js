import React, { Component } from 'react'
import { Set } from 'immutable'
import { connect } from 'react-redux'
import { DropTarget } from 'react-dnd'
import * as Actions from './actions'
import * as PickerActions from '../role-picker/actions'
import * as UIActions from '../../actions/ui'
import './RoleEditor.sass'

import Category from './Category'
import CategoryEditor from './CategoryEditor'
import Role from '../role/draggable'
import { Scrollbars } from 'react-custom-scrollbars';

const mapState = ({ rolePicker, roleEditor, servers }, ownProps) => ({
  rp: rolePicker,
  editor: roleEditor,
  server: servers.get(ownProps.match.params.server)
})

@connect(mapState)
@DropTarget(Symbol.for('dnd: role'), {
  drop (props, monitor, element) {
    element.dropRole({}, 'Uncategorized')(monitor.getItem())
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
    dispatch(Actions.saveCategory(name))    
  }

  deleteCategory = (category, name) => () => {
    const { dispatch } = this.props
    dispatch(Actions.deleteCategory(name))    
  }

  editCategory = (category, name) => (key, type) => event => {
    const { dispatch } = this.props
    let value

    switch (type) {
      case Symbol.for('edit: text'):
        value = event.target.value
        break

      case Symbol.for('edit: bool'):
        value = event.target.checked
        break
      
      default:
        value = null
    }

    dispatch(Actions.editCategory({ category, name, key, type, value }))
  }

  render () {
    const vm = this.props.editor.get('viewMap')
    return <div className="inner role-editor">
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
                // onEditOpen={this.openEditor(c, name)}
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
          <div className="role-editor__grid__right">
            {
              (vm.getIn(['Uncategorized', 'roles_map']) || Set())
                .sortBy(r => r.get('position'))
                .reverse()
                .map((r, k) => <Role key={k} categoryId='Uncategorized' role={r} />)
                .toArray()
            }
          </div>)
        }
      </div>
    </div>
  }
}

export default RoleEditor
