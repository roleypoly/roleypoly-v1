// @flow
import * as React from 'react'
import styled from 'styled-components'

export type ButtonProps = {
  children: React.Node
}

const Button = styled.a`
  background-color: var(--c-discord);
  color: var(--c-white);
  padding: 0.4em 1em;
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.25);
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(0);
  transition: all 0.3s ease-in-out;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    transition: all 0.35s ease-in-out;
    background-color: hsla(0, 0%, 100%, 0.1);
    pointer-events: none;
    opacity: 0;
    z-index: 2;
  }

  &:hover {
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.75);
    transform: translateY(-1px);

    &::after {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
`

const ButtonIcon = styled.img`
  height: 1.5em;
`

const DiscordButton = ({ children, ...props }: ButtonProps) => (
  <Button {...props}>
    <ButtonIcon src='/static/discord-logo.svg' />&nbsp;
    {children}
  </Button>
)

export default DiscordButton
