// @flow
import * as React from 'react'
import Role, { type RoleData } from './index'

export type DemoRoleProps = {
  role: RoleData
}

type DemoRoleState = {
  active: boolean
}

export default class RoleDemo extends React.Component<DemoRoleProps, DemoRoleState> {
  state = {
    active: false
  }

  onToggle = (n: boolean) => {
    this.setState({ active: n })
  }

  render () {
    return <Role role={this.props.role} onToggle={this.onToggle} active={this.state.active} />
  }
}
