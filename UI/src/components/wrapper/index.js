import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Scrollbars from 'react-custom-scrollbars'
import Logotype, { TransFlag } from '../logotype'
import './wrapper.sass'
import discordLogo from '../../pages/images/discord-logo.svg'

let specialFills = {}
let showTransFlag = false

class Wrapper extends Component {
  render() {
    const date = new Date()
    if (
      (date.getMonth() === 2 && date.getDate() === 31) || // TDOV (2 is March)
      (date.getMonth() === 10 && date.getDate() === 20) // TDOR (10 is Nov)
    ) {
      specialFills = {
        circleFill: '#FFAEC6',
        typeFill: '#6FDCFF',
      }
      showTransFlag = true
    }
    return (
      <div className="wrapper">
        <Scrollbars autoHeight autoHeightMax="calc(100vh + 2px)">
          <div className="wrapper__background" />
          <div className="wrapper__container">
            <nav uk-navbar="" className="uk-navbar-transparent wrapper__nav">
              <div className="uk-navbar-left">
                <Link to="/">
                  <div style={{ display: 'flex' }}>
                    <Logotype
                      style={{ height: '2rem', marginRight: '12px' }}
                      className="wrapper__logotype"
                      {...specialFills}
                    />{' '}
                    {showTransFlag && (
                      <TransFlag
                        height="100%"
                        width="75px"
                        uk-tooltip="pos: bottom; title: Roleypoly says trans rights!"
                      />
                    )}
                  </div>
                </Link>
              </div>
              <div className="uk-navbar-right">
                <ul className="uk-navbar-nav">
                  <li>
                    <div className="wrapper__nav__button">
                      <a
                        href="/oauth/bot/flow"
                        target="_blank"
                        className="uk-button rp-button discord-alt"
                      >
                        <img src={discordLogo} className="rp-button-logo" alt="" /> Add
                        Roleypoly
                      </a>
                    </div>
                  </li>
                  <li>
                    <a href="https://discord.gg/PWQUVsd">Join the Discord</a>
                  </li>
                  <li>
                    <a href="https://patreon.com/kata">Patreon</a>
                  </li>
                </ul>
              </div>
            </nav>
            <main className="wrapper__content">{this.props.children}</main>
          </div>
        </Scrollbars>
      </div>
    )
  }
}

export default Wrapper
