import React, { Component } from 'react'

import Role from '../role'

class Category extends Component {
  render () {
    const { category, name } = this.props

    return <div key={name} className="role-picker__category">
      <h4>{ name }</h4>
      {
        category.get('roles_map')
          .sortBy(r => r.get('position'))
          .reverse()
          .map((r, k) => <Role key={k} role={r} type='drag' />)
          .toArray()
      }
    </div>
  }
}
export default Category
