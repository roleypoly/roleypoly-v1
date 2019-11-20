import React, { Component } from 'react';
import { Map } from 'immutable';

import Role from './index';

export default class DemoRole extends Component {
  state = {
    isSelected: false,
  };

  handleToggle = () => {
    this.setState({ isSelected: !this.state.isSelected });
  };

  render() {
    return (
      <Role
        selected={this.state.isSelected}
        role={Map({ name: this.props.name, color: this.props.color })}
        onToggle={this.handleToggle}
        type="button"
      />
    );
  }
}
