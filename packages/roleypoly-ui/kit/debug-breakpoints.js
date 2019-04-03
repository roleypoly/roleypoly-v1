// @flow
import * as React from 'react'
import styled from 'styled-components'
import MediaQuery, { breakpoints } from './media'

const BreakpointDebugFloat = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  pointer-events: none;
  height: 1.4em;
  opacity: 0.4;
  font-family: monospace;
`

const Breakpoint = styled.div`
  padding: 0.1em;
  display: none;
  width: 1.5em;
  text-align: center;
  background-color: hsl(${(props: any) => props.hue}, 50%, 50%);
  ${(props: any) => MediaQuery({ [props.bp]: `display: inline-block` })}
`

const DebugFloater = () => {
  return <BreakpointDebugFloat>
    { Object.keys(breakpoints).map((x, i, a) => <Breakpoint key={x} bp={x} hue={(360 / a.length) * i}>{x}</Breakpoint>) }
  </BreakpointDebugFloat>
}

export default DebugFloater
