// import * as React from 'react'
import styled from 'styled-components'

export const StyledButton = styled.button`
  /* reset some styles */
  box-shadow: none;
  appearance: none;
  outline: none;
  cursor: pointer;
  background-color: rgba(0,0,0,0.1);

  /* real styles */
  position: relative;
  transition: all 0.05s ease-in-out;
  padding: 1em 1.4em;
  font-weight: bold;
  border: 1px solid rgba(0,0,0,0.1);

  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;

    /* transparent by default */
    background-color: transparent;

    transition: background-color 0.05s ease-in-out;

    /* put the overlay behind the text */
    z-index: -1;
  }

  /* on hover, raise, brighten and shadow */
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);

    &::after {
      background-color: rgba(255, 255, 255, 0.3);
    }
  }

  /* on click, lower and darken */
  &:active {
    outline: none;
    box-shadow: none;
    border-color: rgba(0,0,0,0.2);

    transform: translateY(0);

    &::after {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
`

StyledButton.defaultProps = {
  theme: {
    actions: {
      primary: '#46b646',
      primaryText: '#efefef',
      secondary: '#e95353',
      secondaryText: '#efefef'
    }
  }
}

export const StyledPrimaryButton = styled(StyledButton)`
  background-color: ${props => props.theme.actions.primary};
  color: ${props => props.theme.actions.primaryText};
`

StyledPrimaryButton.defaultProps = StyledButton.defaultProps
export const StyledSecondaryButton = styled(StyledButton)`
  background-color: ${props => props.theme.actions.secondary};
  color: ${props => props.theme.actions.secondaryText};
`
