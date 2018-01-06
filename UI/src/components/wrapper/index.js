import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Scrollbars from 'react-custom-scrollbars'
import Logotype from '../logotype'
import './wrapper.sass'
import discordLogo from '../../pages/images/discord-logo.svg'

class Wrapper extends Component {
  render () {
    return <div className='wrapper'>
      <Scrollbars autoHeight autoHeightMax='calc(100vh + 2px)'>
        <div className='wrapper__background' />
        <div className='wrapper__container'>
          <nav uk-navbar='' className='uk-navbar-transparent wrapper__nav'>
            <div className='uk-navbar-left'>
              <Link to="/">
                <Logotype style={{ height: '2rem' }} className='wrapper__logotype' />
              </Link>
            </div>
            <div className='uk-navbar-right'>
              <ul className='uk-navbar-nav'>
                <li><div className='wrapper__nav__button'>
                  <a href="/oauth/bot/flow" target="_blank" className="uk-button rp-button discord-alt"><img src={discordLogo} className="rp-button-logo" alt=""/> Add Roleypoly</a>
                </div></li>
                <li><a href='https://discord.gg/PWQUVsd'>Support Discord</a></li>
              </ul>
            </div>
          </nav>
          <main className="wrapper__content">
            {
              this.props.children
            }
          </main>
        </div>
      </Scrollbars>
    </div>
  }
}

export default Wrapper
