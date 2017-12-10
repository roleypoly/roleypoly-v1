import React, { Component } from 'react'
import superagent from 'superagent'
import './RolePicker.sass'

import Role from '../role'

class RolePicker extends Component {
  state = {
    roles: [],
    categories: {},
    hidden: true,
    serverMessage: `Hey there. This is a cool UI you can pick your roles from. If you have any questions, ask the mods on Discord!`
  }

  async componentDidUpdate (prevProps) {
    if (prevProps.match.params.server !== this.props.match.params.server) {
      this.setState({ hidden: true })
      setTimeout(async () => {
        this.setState({ roles: [] })      
        this.setState({ roles: await this.getRoles(this.props.match.params.server), hidden: false })
      }, 350)
    }
  }

  async componentWillMount () {
    this.setState({ roles: await this.getRoles(this.props.match.params.server), hidden: false })    
  }

  async getRoles (id) {
    const rsp = await superagent.get(`/api/server/${id}`)
    return rsp.body//.map(r => { r.selected = false; return r })
  }

  onChange = k => (newVal, oldVal) => {
    this.setState((prevState) => {
      return { roles: prevState.roles.map(r => {
        if (r.id === k) {
          r.selected = newVal
        }

        return r
      })}
    })
  }

  render () {
    return <div className={`role-picker ${(this.state.hidden) ? 'hidden' : ''}`}>
      <section>
        <h3>Server Message</h3>
        <p>{this.state.serverMessage}</p>
      </section>
      <section>
        <h3>Roles</h3>
          {
            this.state.roles.map((r, k) => {

              return <Role key={k} role={r} onToggle={this.onChange(r.id)} />
            })
          }
      </section>
    </div>
  }
}

export default RolePicker
