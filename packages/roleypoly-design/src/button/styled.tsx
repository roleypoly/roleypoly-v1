// import * as React from 'react'
import styled, { keyframes } from 'styled-components'

import * as colorHelpers from '../helpers/colors'

// import { ButtonProps } from './types'

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
  border-radius: ${props => props.theme.button.borderRadius};

  &:disabled {
    cursor: not-allowed;
  }

  &:not(:disabled) {
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
  }
`

StyledButton.defaultProps = {
  theme: {
    actions: {
      primary: '#46b646'
    },
    button: {
      borderRadius: '2px'
    }
  }
}

export const StyledPrimaryButton = styled(StyledButton)`
  background-color: ${props => props.theme.actions.primary};
  color: ${props => colorHelpers.textMode(props.theme.actions.primary)};
`

StyledPrimaryButton.defaultProps = StyledButton.defaultProps
export const StyledSecondaryButton = styled(StyledButton)`
  background-color: transparent;
  border-color: transparent;

  &:hover {
    border-color: ${props => colorHelpers.stepUp(props.theme.actions.primary)};
  }

  &:active {
    border-color: ${props => colorHelpers.stepDown(props.theme.actions.primary)};
  }
`

const loadingAnim = keyframes`
  0% {
    background-image: linear-gradient(to right, 0px transparent, 1px red);
  }

  100% {
    background-image: linear-gradient(to right, 0px transparent, 100% red);
  }
`
export const StyledLoadingButton = styled(StyledButton)<{loadingPct?: number}>`
  --right: 0%;
  &::after {

    content: "";
    /* z-index: ; */
    top: 0;
    bottom: 0;
    left: 0;
    right: var(--right);
    border-radius: ${props => props.theme.button.borderRadius};
    position: absolute;
    opacity: 0.5;
    /* background-color: red; */
    background-image: linear-gradient(to right, 0px rgba(0,0,0,1), 100% red);

    animation: ${loadingAnim} forwards infinite 1s;
  }
`

StyledLoadingButton.defaultProps = {
  ...StyledButton.defaultProps,
  loadingPct: 100
}
