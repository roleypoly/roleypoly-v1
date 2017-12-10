import React, { Component } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { NavLink } from 'react-router-dom'
import Radium from 'radium'
import './ServerCard.sass'

class ServerCard extends Component {
  static propTypes = {
    user: ImmutablePropTypes.map.isRequired,
    server: ImmutablePropTypes.map.isRequired,
  }

  render () {
    const { server, user } = this.props

    let icon = ''

    
    const s = server.get('server')
    const gm = server.get('gm')
    const perms = server.get('perms')
    if (perms.canManageRoles) {
      icon = <span title='Role Manager' uk-tooltip='' role='img' aria-label='Role Manager'>🔰</span>
    }

    if (perms.isAdmin) {
      icon = <span title='Server Admin' uk-tooltip='' role='img' aria-label='Server Admin'>🔰⭐️</span>
    }

    return <NavLink className='server-list__item' activeClassName='active' to={`/s/${s.id}`}>
      <div className='server-list__item__icon'>
        <img src={`https://cdn.discordapp.com/icons/${s.id}/${s.icon}.png`} alt={s.name} />
      </div>
      <div className='server-list__item__info'>
        <b>{s.name}</b><br />
        <span style={{ color: gm.color }}>{ gm.nickname || user.get('username') }</span> { icon }
      </div>
    </NavLink>
  }
}

export default Radium(ServerCard)
