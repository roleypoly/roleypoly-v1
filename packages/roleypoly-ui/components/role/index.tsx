// @flow
import * as React from 'react'
import { colors } from '../global-colors'
// import Color from 'color'
import * as cc from '@roleypoly/design/lib/helpers/colors'
import RoleStyled from './role.styled'
import Tooltip from '../tooltip'
// import logger from '../../../logger'
// const log = logger(__filename)

type RoleColors = {
  'outline': string
  'outline-alt': string
  'active': string
  'base': string
}

function fromColors (c: RoleColors) {
  return Object.entries(c).reduce((acc, [v, val]) => ({
    ...acc,
    [`--role-color-${v}` as any]: val
  }), {})
}

export type RoleData = {
  color: string,
  name: string
}

export type RoleProps = {
  active?: boolean, // is lit up as if it's in use
  disabled?: boolean, // is interaction-disabled
  type?: 'drag' | 'button',
  role: RoleData,
  isDragging?: boolean,
  onToggle?: (nextState: boolean, lastState: boolean) => void,
  connectDragSource?: (component: React.ReactNode) => void
}

// const tooltip = ({ show = true, text, ...rest }) => <div {...rest}>{text}</div>

type RoleState = {
  hovering: boolean
  roleColors: RoleColors
}

export default class Role extends React.Component<RoleProps, RoleState> {
  state = {
    hovering: false,
    roleColors: {
      'outline': '#fff',
      'outline-alt': '#fff',
      'active': '#fff',
      'base': '#fff'
    }
  }

  static getDerivedStateFromProps (props: RoleProps, prevState: RoleState): RoleState {
    const c = (props.role.color === '0') ? colors.white : props.role.color
    const CC = cc.color(c)
    return {
      ...prevState,
      roleColors: {
        'outline': CC.alpha(0.7).hsl().string(),
        'outline-alt': CC.alpha(0.4).hsl().string(),
        'active': CC.lighten(0.1).hsl().string(),
        'base': CC.hsl().string()
      }
    }
  }

  onToggle = () => {
    if (!this.props.disabled && this.props.onToggle) {
      const { active = false } = this.props
      this.props.onToggle(!active, active)
    }
  }

  onMouseOver = () => {
    // log.debug('caught hovering')
    if (this.props.disabled && this.state.hovering === false) {
      // log.debug('set hovering')
      this.setState({ hovering: true })
    }
  }

  onMouseOut = () => {
    // log.debug('out hovering')
    this.setState({ hovering: false })
  }

  render () {
    const name = (this.props.role.name !== '') ? this.props.role.name : ' '

    return <RoleStyled
      active={this.props.active}
      disabled={this.props.disabled}
      onClick={(this.props.disabled) ? undefined : this.onToggle}
      onTouchStart={(this.props.disabled) ? this.onMouseOver : undefined}
      onTouchEnd={(this.props.disabled) ? this.onMouseOut : undefined}
      style={fromColors(this.state.roleColors)}
      title={(this.props.disabled) ? 'This role has unsafe permissions.' : undefined}
      >
        {name}
        {
          (this.props.disabled && this.state.hovering) && <Tooltip>This role has unsafe permissions.</Tooltip>
        }
    </RoleStyled>
  }
}
