import React, { Component } from 'react'
import { DropTarget } from 'react-dnd'
import Role from '../role/draggable'
import CategoryEditor from './CategoryEditor'

class Category extends Component {
  render() {
    const {
      category,
      name,
      isOver,
      canDrop,
      connectDropTarget,
      mode,
      onEditOpen,
      ...rest
    } = this.props

    if (mode === Symbol.for('edit')) {
      return <CategoryEditor category={category} name={name} {...rest} />
    }

    return connectDropTarget(
      <div
        key={name}
        className={`role-editor__category drop-zone ${canDrop ? 'can-drop' : ''} ${
          isOver && canDrop ? 'is-over' : ''
        }`}
      >
        <div className="role-editor__category-header">
          <h4>{category.get('name')}</h4>
          <div
            uk-tooltip=""
            title="Edit"
            uk-icon="icon: file-edit"
            onClick={onEditOpen}
          />
        </div>
        {category
          .get('roles_map')
          .reverse()
          .map((r, k) => <Role key={k} role={r} categoryId={name} />)
          .toArray()}
      </div>
    )
  }
}

const dropTarget = DropTarget(
  Symbol.for('dnd: role'),
  {
    drop(props, monitor, element) {
      props.onDrop(monitor.getItem())
    },
    canDrop(props, monitor) {
      return (
        props.mode !== Symbol.for('edit') && monitor.getItem().category !== props.name
      )
    },
  },
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType(),
  })
)

export default dropTarget(Category)
