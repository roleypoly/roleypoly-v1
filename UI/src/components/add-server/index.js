import React, { Component } from 'react'
import * as Actions from '../../actions'
import discordLogo from '../../pages/images/discord-logo.svg'
import RoleypolyDemo from '../demos/roleypoly'
import TypingDemo from '../demos/typing'
import './styles.sass'

export default class AddServer extends Component {
  polling = null

  componentDidMount() {
    if (this.props.match.params.server !== undefined) {
      this.pollingStop = Actions.startServerPolling(this.props.dispatch)
    }
  }

  componentWillUnmount() {
    if (this.pollingStop != null) {
      this.pollingStop()
    }
  }

  render() {
    return (
      <div className="inner add-server">
        <h2>What is Roleypoly?</h2>
        <p className="add-server__header">
          Roleypoly is a helper bot to help server members assign themselves roles on
          Discord.
        </p>
        <div className="add-server__grid">
          <div>
            <TypingDemo />
          </div>
          <div className="text">
            Could you easily remember 250 role names? You'd use images or bot commands to
            tell everyone what they can assign. This kinda limits how <i>many</i> roles
            you can reasonably have. And don't even start with emojis.{' '}
            <span alt="" role="img">
              💢
            </span>
          </div>
          <div className="text right">
            Just click. <span role="img">🌈 💖</span>
          </div>
          <div className="add-server__darkbg">
            <RoleypolyDemo />
          </div>
        </div>
        <div className="add-server__header">
          <a
            href="/oauth/bot/flow"
            target="_blank"
            className="uk-button rp-button discord"
          >
            <img src={discordLogo} className="rp-button-logo" alt="" /> Authorize via
            Discord
          </a>
        </div>
      </div>
    )
  }
}
