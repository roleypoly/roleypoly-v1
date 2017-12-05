import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import Radium from 'radium'
import './ServerCard.css'

class ServerCard extends Component {
  render () {
    const { server } = this.props
    return <NavLink className='server-list__item' activeClassName='active' to={`/s/${server.id}`}>
      <div className='server-list__item__icon'>
        <img src={`https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png`} />
      </div>
      <div className='server-list__item__info'>
        <b>{server.name}</b><br />
        <span>{server.name}</span>
      </div>
    </NavLink>
  }
}

export default Radium(ServerCard)
