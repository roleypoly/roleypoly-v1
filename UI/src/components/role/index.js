import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Color from 'color'
import './Role.sass'

const whiteColor = Color('#efefef')

class Role extends Component {
  static propTypes = {
    role: PropTypes.object.isRequired,
    onToggle: PropTypes.func,
    type: PropTypes.string,
    selected: PropTypes.bool,
    disabled: PropTypes.bool,
  }

  render() {
    let { role, selected, disabled, type, isDragging } = this.props
    type = type || 'button'

    let color = Color(role.get('color'))

    if (color.rgbNumber() === 0) {
      color = whiteColor
    }

    const c = color
    let hc = color.lighten(0.1)

    const out = (
      <div
        onClick={() => {
          if (!disabled && this.props.onToggle != null) {
            this.props.onToggle(!selected, selected)
          }
        }}
        {...(disabled
          ? {
              'uk-tooltip': `I don't have permissions to grant this.`,
              title: "I don't have permissions to grant this.",
            }
          : {})}
        className={`role font-sans-serif ${disabled ? 'disabled' : ''} ${
          isDragging ? 'is-dragging' : ''
        } role__${type}`}
        title={role.get('name')}
        style={{
          '--role-color-hex': c.string(),
          '--role-color-hover': hc.string(),
          '--role-color-rgba': `rgba(${c.red()}, ${c.green()}, ${c.blue()}, 0.7)`,
        }}
      >
        <div className={`role__option ${selected ? 'selected' : ''}`} />
        <div className="role__name">{role.get('name')}</div>
      </div>
    )

    if (type === 'drag' && this.props.connectDragSource != null) {
      return this.props.connectDragSource(out)
    }

    return out
  }
}

export default Role
