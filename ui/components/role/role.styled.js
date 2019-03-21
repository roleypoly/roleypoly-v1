import styled from 'styled-components'
import MediaQuery from '../../kit/media'

export default styled.div`
  border: solid 1px var(--role-color-outline);
  border-radius: 1.2em;

  box-sizing: border-box;
  cursor: pointer;

  position: relative;
  display: inline-flex;
  overflow: hidden;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  flex-direction: column;

  font-size: 1.2em;
  line-height: 20px;

  margin: 0.3em;
  padding: 4px 0.5em;

  min-height: 32px;
  max-width: 90vw;

  transition: box-shadow 0.3s ease-in-out;

  text-shadow: 1px 1px 1px rgba(0,0,0,0.45);
  text-overflow: ellipsis;
  user-select: none;
  white-space: nowrap;
  transform: rotateZ(0);

  ${(props: any) => (props.active) ? `
    box-shadow: inset 0 0 0 3em var(--role-color-outline-alt);
  ` : `
  `}

  .wf-active & {
    /* padding-top: 4px; */
  }

  &[disabled]:hover {
    overflow: visible;
  }

  &:hover::after {
    transform: translateY(-1px) rotateZ(0);
    box-shadow: 0 0 1px rgba(0,0,0,0.75);
    border-color: var(--role-color-active);
    clip-path: border-box circle(50.2% at 49.6% 50%); /* firefox fix */
  }

  &:active::after {
    transform: none;
  }

  &::after {
    content: '';
    display: none;
    box-sizing: border-box;

    position: absolute;
    left: 4px;
    bottom: 2px;
    top: 4px;

    width: 22px;
    height: 22px;

    border: 1px solid var(--role-color-base);
    border-radius: 100%;

    clip-path: border-box circle(50.2% at 50% 50%); /* firefox fix */

    transform: rotateZ(0);
    ${(props: any) => (props.active) ? `
      transition: border 0.3s ease-in-out, transform 0.1s ease-in-out, background-color 1ms ease-in-out 0.29s;
      border-left-width: 21px;
    ` : `
      transition: border 0.3s ease-in-out, transform 0.1s ease-in-out;
    `}
  }

  ${(props: any) => MediaQuery({
    md: `
      font-size: 1em;
      text-shadow: none;
      padding-left: 32px;
      ${(props.active) ? `box-shadow: none;` : ''}
      &::after {
        ${(props.active) ? `background-color: var(--role-color-base);` : ''}
        display: block;
      }
    `
  })}

  &[disabled] {
    border-color: hsl(0,0%,40%);
    color: hsla(0,0%,40%,0.7);
    cursor: default;
    box-shadow: none;
    ${(props: any) => (props.active) ? `box-shadow: inset 0 0 0 3em hsla(0,0%,40%,0.1);` : ``};

    &::after {
      border-color: hsl(0,0%,40%);
    }

    &:hover::after {
      border-color: hsl(0,0%,40%);
      transform: none;
      box-shadow: none;
    }
  }
`
