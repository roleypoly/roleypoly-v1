import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import ServerCard from './ServerCard'
import UserCard from './UserCard'

class ServersNavigation extends Component {

  static propTypes = {
    user: PropTypes.object.isRequired,
    servers: PropTypes.arrayOf(PropTypes.object).isRequired,
    className: PropTypes.string
  }

  render () {
    // console.log(this.props.servers)
    return <Fragment>
      <UserCard user={this.props.user} />
      <div className={this.props.className}>
        { this.props.servers.map((s, i) => <ServerCard server={s} user={this.props.user} key={i} />) }
      </div>
    </Fragment>
  }
}

export default ServersNavigation
