import React, { Component } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { NavLink } from 'react-router-dom'
import { GoSignOut } from 'react-icons/go'
import { connect } from 'react-redux'
import * as Actions from '../../actions'
import './UserCard.sass'

class UserCard extends Component {
  static propTypes = {
    user: ImmutablePropTypes.map,
  }

  get avatar() {
    const { user } = this.props
    const avatar = user.get('avatar')

    if (avatar === '' || avatar == null) {
      return `https://cdn.discordapp.com/embed/avatars/${
        Math.ceil(Math.random() * 9999) % 5
      }.png`
    }

    return `https://cdn.discordapp.com/avatars/${user.get('id')}/${avatar}.png`
  }

  render() {
    const { user } = this.props

    return (
      <div className="user-card">
        <div className="user-card__icon">
          <img src={this.avatar} alt={user.get('username')} />
        </div>
        <div className="user-card__info">
          <span className="user-card__info__name">{user.get('username')}</span>
          <span className="user-card__info__discrim">#{user.get('discriminator')}</span>
        </div>
        <div className="user-card__actions">
          <ul className="uk-iconnav uk-iconnav-vertical">
            <li>
              <a
                uk-tooltip=""
                title="Sign out"
                onClick={() => {
                  this.props.dispatch(Actions.userLogout)
                }}
              >
                <GoSignOut className="smol-bump" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}

export default connect()(UserCard)
