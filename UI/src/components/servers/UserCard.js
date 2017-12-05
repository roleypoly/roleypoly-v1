import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import Radium from 'radium'
import './UserCard.css'

class UserCard extends Component {
  render () {
    const { user } = this.props

    return <div className='user-card'>
      <div className='user-card__icon'>
        <img src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`} />
      </div>
      <div className='user-card__info'>
      <span className='user-card__info__name'>{user.username}</span><span className='user-card__info__discrim'>#{user.discriminator}</span>
      </div>
      <div className='user-card__actions'>
        <ul className='uk-iconnav uk-iconnav-vertical'>
          <li><NavLink uk-tooltip='' title='Sign out' uk-icon='icon: sign-out' to='/auth/signout' activeClassName='uk-active' /></li>
          {
            (this.props.user.isRoot === true)
              ? <li><NavLink uk-tooltip='' title='Root' uk-icon='icon: bolt' to='/root/' activeClassName='uk-active' /></li>
              : null
          }
        </ul>
      </div>
    </div>
  }
}

export default Radium(UserCard)
