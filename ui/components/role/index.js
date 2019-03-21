// @flow
import * as React from 'react'
import { colors } from '../global-colors'
import Color from 'color'
import RoleStyled from './role.styled'
import Tooltip from '../tooltip'

export type RoleData = {
  color: string,
  name: string,
}

export type RoleProps = {
  active?: boolean, // is lit up as if it's in use
  disabled?: boolean, // is interaction-disabled
  type?: 'drag' | 'button',
  role: RoleData,
  isDragging?: boolean,
  onToggle?: (nextState: boolean, lastState: boolean) => void,
  connectDragSource?: (component: React.Node) => void
}

// const tooltip = ({ show = true, text, ...rest }) => <div {...rest}>{text}</div>

type RoleState = {
  hovering: boolean
}

export default class Role extends React.Component<RoleProps, RoleState> {
  state = {
    hovering: false
  }

  onToggle = () => {
    if (!this.props.disabled && this.props.onToggle) {
      const { active = false } = this.props
      this.props.onToggle(!active, active)
    }
  }

  onMouseOver = () => {
    console.log('caught hovering')
    if (this.props.disabled && this.state.hovering === false) {
      console.log('set hovering')
      this.setState({ hovering: true })
    }
  }

  onMouseOut = () => {
    console.log('out hovering')
    this.setState({ hovering: false })
  }

  render () {
    let color = Color(this.props.role.color)
    if (this.props.role.color === 0) {
      color = colors.white
    }

    const roleColors = {
      outline: Color(color).alpha(0.7).hsl().string(),
      outlineAlt: Color(color).alpha(0.4).hsl().string(),
      active: Color(color).lighten(0.1).hsl().string(),
      base: Color(color).hsl().string()
    }

    return <RoleStyled
      active={this.props.active}
      disabled={this.props.disabled}
      onClick={this.onToggle}
      onMouseOver={this.onMouseOver}
      onMouseOut={this.onMouseOut}
      onTouchStart={this.onMouseOver}
      onTouchEnd={this.onMouseOut}
      colors={roleColors}
      // title={(this.props.disabled) ? 'This role is disabled for safety.' : null}
    >
      {this.props.role.name}
      { (this.props.disabled && this.state.hovering) && <Tooltip>This role has unsafe permissions.</Tooltip> }
    </RoleStyled>
  }
}
