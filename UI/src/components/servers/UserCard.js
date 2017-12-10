import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import './UserCard.sass'

class UserCard extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired
  }

  get avatar () {
    const { user } = this.props
    const avatar = user.get('avatar')

    if (avatar === '' || avatar == null) {
      return `https://cdn.discordapp.com/embed/avatars/${Math.ceil(Math.random() * 9999) % 4}.png`
    }

    return `https://cdn.discordapp.com/avatars/${user.get('id')}/${avatar}.png`
  }

  render () {
    const { user } = this.props

    // console.log(this.props)

    return <div className='user-card'>
      <div className='user-card__icon'>
        <img src={this.avatar} alt={user.get('username')} />
      </div>
      <div className='user-card__info'>
        <span className='user-card__info__name'>{user.get('username')}</span><span className='user-card__info__discrim'>#{user.get('discriminator')}</span>
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

export default UserCard
