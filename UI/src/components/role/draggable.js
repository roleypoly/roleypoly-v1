import React, { Component } from 'react'
import { DragSource } from 'react-dnd'
import Role from './index'

const dragSource = DragSource(
  Symbol.for('dnd: role'),
  {
    beginDrag({ role, categoryId }) {
      return { role, category: categoryId }
    },
  },
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  })
)

class DraggableRole extends Component {
  render() {
    return <Role {...this.props} type="drag" />
  }
}

export default dragSource(DraggableRole)
