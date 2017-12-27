import React, { Component } from 'react'

export default class CategoryEditor extends Component {
  render () {
    const {
      name,
      category
    } = this.props

    return <div className="role-editor__category editor">
      <form onSubmit={(e) => e.preventDefault()} className="uk-form-stacked uk-light">
        <div>
          <label className="uk-form-label">Category Name</label>
          <div className="uk-form-controls">
            <input type="text" className="uk-input" placeholder='' value={name} onChange={this.props.onEdit('name', Symbol.for('edit: text'))} />
          </div>
        </div>
        <div style={{ marginTop: 10 }}>
          <div className="uk-form-controls">
            <label uk-tooltip="delay: 1s" title="Hides and disables roles in this category from being used.">
              <input
                style={{ marginRight: 5 }}
                type="checkbox"
                className="uk-checkbox"
                checked={category.get('hidden')}
                onChange={this.props.onEdit('hidden', Symbol.for('edit: bool'))}
              />
              Hidden
            </label>
          </div>
        </div>
        <div className='role-editor__actions'>
          <button className="uk-button rp-button secondary role-editor__actions_delete" onClick={this.props.onDelete}>
            <i uk-icon="icon: trash" />
          </button>
          <button className="uk-button rp-button primary role-editor__actions_save" onClick={this.props.onSave}>Save</button>
        </div>
      </form>
    </div>
  }
}
