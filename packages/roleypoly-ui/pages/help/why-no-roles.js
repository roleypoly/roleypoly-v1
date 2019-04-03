import * as React from 'react'
import styled from 'styled-components'
import demoRoles from '../../config/demo'
import MediaQuery from '../../kit/media'

const admin = { name: 'admin', color: '#db2828' }
const bot = { name: 'roleypoly', color: 'var(--c-5)' }

const exampleGood = [
  admin,
  bot,
  ...demoRoles
]

const exampleBad = [
  admin,
  ...demoRoles,
  bot
]

const DiscordOuter = styled.div`
  background-color: var(--dark-but-not-black);
  padding: 10px;
  text-align: left;
  color: var(--c-white);
  border: 1px solid rgba(0, 0, 0, 0.25);
  width: 250px;
  margin: 0 auto;
  user-select: none;
`

const Collapser = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  ${() => MediaQuery({
    md: `flex-direction: row;`
  })}
`

const DiscordRole = styled.div`
  color: ${({ role: { color } }) => color};
  position: relative;
  padding: 0.3em 0.6em;
  border-radius: 3px;
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    transition: opacity 0.02s ease-in-out;
    opacity: 0;
    background-color: ${({ role: { color } }) => color};
    border-radius: 3px;
  }

  &:hover::before {
    opacity: 0.1;
  }

  ${
  ({ role }) => (role.name === 'roleypoly')
    ? `
    background-color: ${role.color};
    color: var(--c-white);
    `
    : ``
}
`

const MicroHeader = styled.div`
  font-size: 0.7em;
  font-weight: bold;
  color: #72767d;
  padding: 0.3rem 0.6rem;
`

const Center = styled.div`
  text-align: center;
  margin: 2em;
`

const Example = ({ data }) => (
  <DiscordOuter>
    <MicroHeader>
      ROLES
    </MicroHeader>
    {
      data.map(role => <DiscordRole role={role} key={role.name}>{role.name}</DiscordRole>)
    }
  </DiscordOuter>
)

export default () => <div>
  <h3>How come I can't see any of my roles?!</h3>
  <p>Discord doesn't let us act upon roles that are "higher" than Roleypoly's in the list. You must keep it's role higher than any role you may want to assign.</p>
  <Collapser>
    <Center>
      <h4 style={{ color: 'var(--c-red)' }}>Bad ❌</h4>
      <Example data={exampleBad} />
    </Center>
    <Center>
      <h4 style={{ color: 'var(--c-green)' }}>Good ✅</h4>
      <Example data={exampleGood} />
    </Center>
  </Collapser>
</div>
