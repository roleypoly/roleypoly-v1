import React, { Component } from 'react'
import { Map } from 'immutable'

import Role from '../role'

class Category extends Component {
  toggleRoleMulti(id, next) {
    this.props.onChange(Map({ [id]: next }))
  }

  toggleRoleSingle(id, next) {
    this.props.onChange(
      this.props.category
        .get('roles')
        .reduce((acc, i) => acc.set(i, false), Map())
        .set(id, next)
    )
  }

  onRoleToggle = id => (next, old) => {
    const type = this.props.category.get('type')

    switch (type) {
      case 'single':
        return this.toggleRoleSingle(id, next)
      case 'multi':
        return this.toggleRoleMulti(id, next)
      default:
        return this.toggleRoleMulti(id, next)
    }
  }

  render() {
    const { category, name, isSelected } = this.props
    if (category.get('hidden')) {
      return null
    }

    if (category.get('roles').count() === 0) {
      return null
    }

    return (
      <div key={name} className="role-picker__category">
        <h4>{category.get('name')}</h4>
        {category
          .get('roles_map')
          .sortBy(r => r.get('position'))
          .reverse()
          .map((r, k) => {
            const id = r.get('id')
            return (
              <Role
                key={k}
                role={r}
                disabled={r.get('safety') !== 0}
                selected={isSelected(id)}
                onToggle={this.onRoleToggle(id)}
              />
            )
          })
          .toArray()}
      </div>
    )
  }
}
export default Category
