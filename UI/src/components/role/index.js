import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Color from 'color'
import './Role.sass'

const whiteColor = Color('#efefef')

class Role extends Component {
  static propTypes = {
    role: PropTypes.object.isRequired,
    onToggle: PropTypes.func,
    type: PropTypes.string
  }

  render () {
    const { role } = this.props
    let color = Color(role.color)

    if (color.rgbNumber() === 0) {
      color = whiteColor
    }

    const c = color
    let hc = color.lighten(0.1)

    return <div
      onClick={this.props.onToggle.bind(null, !role.selected, role.selected)}
      className='role'
      style={{
        '--role-color-hex': c.string(),
        '--role-color-hover': hc.string(),
        '--role-color-rgba': `rgba(${c.red()}, ${c.green()}, ${c.blue()}, 0.7)`
      }}>
      {/* circle svg */}
      <div className={`role__option ${(role.selected) ? 'selected' : ''}`}/>
      <div className='role__name'>
        {role.name}
      </div>
    </div>
  }
}

export default Role
