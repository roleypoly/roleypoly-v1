import React, { Component, Fragment } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'
import ServerCard from './ServerCard'
import UserCard from './UserCard'

class ServersNavigation extends Component {
  static propTypes = {
    user: ImmutablePropTypes.map.isRequired,
    servers: ImmutablePropTypes.orderedMapOf(ImmutablePropTypes.map).isRequired,
    className: PropTypes.string
  }

  render () {
    // console.log(this.props.servers)
    return <Fragment>
      <UserCard user={this.props.user} />
      <div className={this.props.className}>
        { 
          this.props.servers.reduce((acc, s, i) => {
            acc.push(<ServerCard server={s} user={this.props.user} key={i} />)
            return acc
          }, [])
        }
      </div>
    </Fragment>
  }
}

export default ServersNavigation
