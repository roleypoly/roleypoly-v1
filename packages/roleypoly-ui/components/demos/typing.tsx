import * as React from 'react'
import moment from 'moment'
import Typist from 'react-typist'
import styled from 'styled-components'
import { sm } from '../../kit/media'
import demoRoles from '../../config/demo'

const Outer = styled.div`
  background-color: var(--dark-but-not-black);
  padding: 10px;
  text-align: left;
  color: var(--c-white);
`

const Chat = styled.div`
  padding: 10px 0;
  font-size: 0.8em;
  ${sm`font-size: 1em;`}

  & span {
    display: inline-block;
    margin-left: 5px;
  }
`

const TextArea = styled.div`
  background-color: hsla(218, 5%, 47%, 0.3);
  border-radius: 5px;
  padding: 10px;
  font-size: 0.8em;
  ${sm`font-size: 1em;`}

  & .Typist .Cursor {
    display: inline-block;
    color: transparent;
    border-left: 1px solid var(--c-white);
    user-select: none;

    &--blinking {
      opacity: 1;
      animation: blink 2s ease-in-out infinite;

      @keyframes blink {
        0% {
          opacity: 1;
        }

        50% {
          opacity: 0;
        }

        100% {
          opacity: 1;
        }
      }
    }
  }
`

const Timestamp = styled.span`
  font-size: 0.7em;
  color: hsla(0, 0%, 100%, 0.2);
`

const Username = styled.span`
  font-weight: bold;
`

const Typing = () => <Outer>
  <Chat>
    <Timestamp className='timestamp'>{moment().format('LT')}</Timestamp>
    <Username className='username'>okano「岡野」</Username>
    <span className='text'>Hey, I want some roles!</span>
  </Chat>
  <TextArea>
    <Typist cursor={{ blink: true }}>
      { demoRoles.map(({ name }) => [
        <span>.iam {name}</span>,
        <Typist.Backspace count={30} delay={1500} />
      ]) }
      <span>i have too many roles.</span>
    </Typist>
  </TextArea>
</Outer>

export default Typing
