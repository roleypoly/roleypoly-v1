// @flow
import * as React from 'react'
import HeaderBarCommon, { Logomark } from './common'
import { type User } from '../../containers/user'
import DiscordIcon from '../discord-guild-pic'
import styled from 'styled-components'
import { Hide } from '../../kit/media'
import Link from 'next/link'

const temporaryServer = {
  id: '423497622876061707',
  name: 'Placeholder',
  icon: '8d03476c186ec8b2f6a1a4f5e55b13fe'
}

const LogoBox = styled.a`
  flex: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`

const StyledServerPic = styled(DiscordIcon)`
  border-radius: 100%;
  box-shadow: 0 0 1px rgba(0,0,0,0.1);
  border: 1px solid rgba(0,0,0,0.25);
  height: 35px;
  width: 35px;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const StyledAvatar = styled.img`
  border-radius: 100%;
  border: 1px solid var(--c-green);
  height: 35px;
  width: 35px;
  margin-left: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ServerSelector = (props) => <div {...props}>
  <div>
    <StyledServerPic {...temporaryServer} />
  </div>
  <div>
    { temporaryServer.name }
  </div>
</div>

const StyledServerSelector = styled(ServerSelector)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: left;
`

const UserSection = ({ user, ...props }) => <div {...props}>
  <Hide.SM>{ user.username }</Hide.SM>
  <StyledAvatar src={user.avatar} />
</div>

const StyledUserSection = styled(UserSection)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  text-align: right;
`

const HeaderBarAuth: React.StatelessFunctionalComponent<{ user: User }> = ({ user }) => (
  <HeaderBarCommon noBackground={false}>
    <>
      <Link href='/s/add' prefetch>
        <LogoBox>
          <Logomark />
        </LogoBox>
      </Link>
      <StyledServerSelector />
      <StyledUserSection user={user} />
    </>
  </HeaderBarCommon>
)

export default HeaderBarAuth
