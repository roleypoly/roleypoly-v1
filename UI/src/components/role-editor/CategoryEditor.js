import React, { Component } from 'react'
import { GoChevronUp, GoChevronDown, GoTrashcan, GoInfo } from 'react-icons/go'

export default class CategoryEditor extends Component {
  onKeyPress = (e) => {
    const { onSave } = this.props

    switch (e.key) {
      case 'Enter':
      case 'Escape':
        return onSave()
    }
  }

  render() {
    const { category } = this.props

    return (
      <div className="role-editor__category editor" onKeyDown={this.onKeyPress}>
        <div className="uk-form-stacked uk-light">
          <div>
            <label className="uk-form-label">Category Name</label>
            <div className="uk-form-controls">
              <input
                type="text"
                className="uk-input"
                placeholder=""
                value={category.get('name')}
                onChange={this.props.onEdit('name', Symbol.for('edit: text'))}
              />
            </div>
            <div className="role-editor__bumpers">
              <div
                onClick={this.props.onBump(-1)}
                className={`role-editor__bumpers-bump 
                ${category.get('position') === 0 ? 'yeet' : ''} 
                `}
                uk-tooltip="delay: 1s"
                title="Move category up"
              >
                <GoChevronUp />
              </div>
              <div
                onClick={this.props.onBump(1)}
                className={`role-editor__bumpers-bump 
                ${category.get('position') === this.props.arrMax - 1 ? 'yeet' : ''} 
                `}
                uk-tooltip="delay: 1s"
                title="Move category down"
              >
                <GoChevronDown />
              </div>
            </div>
          </div>
          <div style={{ marginTop: 10 }}>
            <div className="uk-form-controls">
              <label
                uk-tooltip="delay: 1s"
                title="Hides and disables roles in this category from being used."
              >
                <input
                  style={{ marginRight: 5 }}
                  type="checkbox"
                  className="uk-checkbox uk-light"
                  checked={category.get('hidden')}
                  onChange={this.props.onEdit('hidden', Symbol.for('edit: bool'))}
                />
                Hidden
              </label>
            </div>
          </div>
          <div style={{ marginTop: 10 }}>
            <div className="uk-form-label">
              <span
                uk-tooltip=""
                title="Single mode only lets a user pick one role in this category."
              >
                Type <GoInfo />
              </span>
            </div>
            <div className="uk-form-controls">
              <select
                className="uk-select"
                value={category.get('type')}
                onChange={this.props.onEdit('type', Symbol.for('edit: select'))}
              >
                <option value="multi">Multiple</option>
                <option value="single">Single</option>
              </select>
            </div>
          </div>
          <div className="role-editor__actions">
            <button
              className="uk-button rp-button secondary role-editor__actions_delete"
              onClick={this.props.onDelete}
            >
              <GoTrashcan />
            </button>
            <button
              className="uk-button rp-button primary role-editor__actions_save"
              onClick={this.props.onSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )
  }
}
