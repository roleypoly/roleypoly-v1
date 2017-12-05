import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import Radium from 'radium'
import './ServerCard.css'

class ServerCard extends Component {
  render () {
    const { server: { server, id, gm, perms }, user } = this.props

    let icon = ''
    
    if (perms.canManageRoles) {
      icon = <span title='Role Manager' uk-tooltip=''>🔰</span>
    }

    if (perms.isAdmin) {
      icon = <span title='Server Admin' uk-tooltip=''>🔰⭐️</span>
    }

    return <NavLink className='server-list__item' activeClassName='active' to={`/s/${id}`}>
      <div className='server-list__item__icon'>
        <img src={`https://cdn.discordapp.com/icons/${id}/${server.icon}.png`} />
      </div>
      <div className='server-list__item__info'>
        <b>{server.name}</b><br />
        <span style={{ color: gm.color }}>{ gm.nickname || user.username }</span> { icon }
      </div>
    </NavLink>
  }
}

export default Radium(ServerCard)
