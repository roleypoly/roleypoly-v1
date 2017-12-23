import React, { Component, Fragment } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'
import ServerCard from './ServerCard'
import UserCard from './UserCard'
import { Scrollbars } from 'react-custom-scrollbars';

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
        <Scrollbars autoHeight autoHeightMax='calc(100vh - 180px)'>
          { 
            this.props.servers.reduce((acc, s, i) => {
              acc.push(<ServerCard server={s} user={this.props.user} key={i} />)
              return acc
            }, [])
          }
        </Scrollbars>
      </div>
    </Fragment>
  }
}

export default ServersNavigation
