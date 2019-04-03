import styled from 'styled-components'
import MediaQuery from '../kit/media'

export default styled.div`
  position: absolute;
  bottom: 35px;
  font-size: 0.9em;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 5px;
  color: var(--c-red);
  border-radius: 3px;
  border: 1px black solid;
  z-index: 10;
  opacity: 0.99;
  overflow: auto;
  pointer-events: none;
  white-space: normal;
  ${() => MediaQuery({ md: `
    white-space: nowrap;  `
  })}
`
