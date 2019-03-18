// @flow
import * as React from 'react'
import styled from 'styled-components'
import MediaQuery from '../../kit/media'

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

const Outer = styled.div`
  box-sizing: border-box;
  padding: 4px 0.5em;
  padding-top: 2px;
  border: solid 1px var(--outer-color);
  display: inline-block;
  border-radius: 1.2em;
  margin: 0.3em;
  font-size: 1.2em;
  transition: box-shadow 0.3s ease-in-out;
  text-shadow: 1px 1px 1px rgba(0,0,0,0.45);
  cursor: pointer;
  user-select: none;
  ${(props: any) => (props.active) ? 'box-shadow: inset 0 0 0 3em var(--outer-color);' : ''}
  position: relative;

  &:hover::after {
    transform: translateY(-1px);
    box-shadow: 0 0 1px rgba(0,0,0,0.75);
  }

  &:active::after {
    transform: none;
  }

  &::after {
    display: none;
    content: '';
    position: absolute;
    box-sizing: border-box;
    top: 4px;
    left: 4px;
    bottom: 2px;
    border-radius: 100%;
    width: 22px;
    height: 22px;
    clip-path: border-box circle(50% at 50% 50%); /* firefox fix */
    transform: none;
    border: 1px solid var(--outer-color);
    transition: border 0.3s ease-in-out, transform 0.1s ease-in-out;
    ${(props: any) => (props.active) ? 'border-left-width: 21px;' : ''}
  }

  ${(props: any) => MediaQuery({
    md: `
      font-size: 1em;
      text-shadow: none;
      padding-left: 32px;
      ${(props.active) ? 'box-shadow: none;' : ''}
      &::after {
        display: block;
      }
    `
  })}


`

export default class Role extends React.Component<RoleProps> {
  onToggle = () => {
    if (!this.props.disabled && this.props.onToggle) {
      const { active = false } = this.props
      this.props.onToggle(!active, active)
    }
  }

  render () {
    return <Outer active={this.props.active} onClick={this.onToggle} style={{ '--outer-color': this.props.role.color }}>{this.props.role.name}</Outer>
  }
}
