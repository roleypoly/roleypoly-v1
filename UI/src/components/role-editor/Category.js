import React, { Component } from 'react'
import { DropTarget } from 'react-dnd'

import Role from '../role/draggable'
import CategoryEditor from './CategoryEditor'

@DropTarget(Symbol.for('dnd: role'), {
  drop (props, monitor, element) {
    props.onDrop(monitor.getItem())
  },
  canDrop (props) {
    return props.mode !== Symbol.for('edit')
  }
}, (connect, monitor) => ({ 
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  isOverCurrent: monitor.isOver({ shallow: true }),
  canDrop: monitor.canDrop(),
  itemType: monitor.getItemType()
}))
class Category extends Component {
  render () {
    const { category, name, isOver, connectDropTarget, mode, ...rest } = this.props

    if (mode === Symbol.for('edit')) {
      return <CategoryEditor category={category} name={name} {...rest} />
    }

    return connectDropTarget(<div key={name} className={`role-picker__category ${(isOver) ? 'is-over' : ''}`}>
      <h4>{ name }</h4>
      {
        category.get('roles_map')
          .sortBy(r => r.get('position'))
          .reverse()
          .map((r, k) => <Role key={k} role={r} categoryId={name} />)
          .toArray()
      }
    </div>)
  }
}
export default Category
