import React, { Component } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { NavLink } from 'react-router-dom'
import './ServerCard.sass'

class ServerCard extends Component {
  static propTypes = {
    user: ImmutablePropTypes.map.isRequired,
    server: ImmutablePropTypes.map.isRequired,
  }

  render() {
    const { server, user } = this.props

    let icon = ''

    console.log(__filename, server)

    const s = server.get('server')
    const gm = server.get('gm')
    const perms = server.get('perms')

    if (perms.get('canManageRoles')) {
      icon = (
        <span
          title="Role Manager"
          uk-tooltip=""
          role="img"
          aria-label="Role Manager"
          className="server-list__item__tag"
          uk-icon="icon: bolt; ratio: 0.7"
        />
      )
    }

    if (perms.get('isAdmin')) {
      icon = (
        <span
          title="Server Admin"
          uk-tooltip=""
          role="img"
          aria-label="Server Admin"
          className="server-list__item__tag"
          uk-icon="icon: star; ratio: 0.7"
        />
      )
    }

    return (
      <NavLink
        className="server-list__item"
        activeClassName="active"
        to={`/s/${s.get('id')}`}
      >
        <div className="server-list__item__icon">
          <img
            src={`https://cdn.discordapp.com/icons/${s.get('id')}/${s.get('icon')}.png`}
            alt={s.name}
          />
        </div>
        <div className="server-list__item__info">
          <b>{s.get('name')}</b>
          <br />
          <span style={{ color: gm.get('color') }}>
            {gm.get('nickname') || user.get('username')}
          </span>{' '}
          {icon}
        </div>
      </NavLink>
    )
  }
}

export default ServerCard
