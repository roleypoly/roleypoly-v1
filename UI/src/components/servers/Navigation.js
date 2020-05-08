import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import { Scrollbars } from 'react-custom-scrollbars'
import { GoPlus } from 'react-icons/go'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { NavLink } from 'react-router-dom'
import ServerCard from './ServerCard'
import UserCard from './UserCard'

class ServersNavigation extends Component {
  static propTypes = {
    user: ImmutablePropTypes.map.isRequired,
    servers: ImmutablePropTypes.orderedMapOf(ImmutablePropTypes.map).isRequired,
    className: PropTypes.string,
  }

  render() {
    return (
      <Fragment>
        <UserCard user={this.props.user} />
        <div className={this.props.className}>
          <Scrollbars autoHeight autoHeightMax="calc(100vh - 180px)">
            {this.props.servers.reduce((acc, s, i) => {
              acc.push(<ServerCard server={s} user={this.props.user} key={i} />)
              return acc
            }, [])}
            <NavLink
              className="server-list__item add-new"
              activeClassName="active"
              to={`/s/add`}
            >
              <div className="server-list__item__info">
                <GoPlus className="smol-bump" />
                &nbsp; Add to your server
              </div>
            </NavLink>
          </Scrollbars>
        </div>
      </Fragment>
    )
  }
}

export default ServersNavigation
