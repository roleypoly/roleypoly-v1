import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import Scrollbars from 'react-custom-scrollbars'
import Typist from 'react-typist'
import moment from 'moment'
import './landing.sass'
import discordLogo from './images/discord-logo.svg'
import RoleypolyDemo from '../components/demos/roleypoly'
import TypingDemo from '../components/demos/typing'

const Landing = ({ root = false }) =>
  <div className="landing uk-width-1-1 uk-text-center">
    <div className="uk-container">
      <section>
        <h1>Self-assignable Discord roles for humans.</h1>
        <h4>Ditch bot commands once and for all.</h4>
      </section>
      <section>
        <Link to="/oauth/flow" className="uk-button rp-button discord"><img src={discordLogo} className="rp-button-logo"/> Sign in with Discord</Link>
      </section>
      <section uk-grid="">
        {/* Typist */}
        <div className="uk-width-1-2">
          <TypingDemo />
          <p className="subtext">Why are we still using antiques?</p>
        </div>
        {/* role side */}
        <div className="uk-width-1-2">
          <RoleypolyDemo />
          <p className="subtext">It's {(new Date()).getUTCFullYear()}. We can do better.</p>
        </div>
      </section>
    </div>
  </div>
export default Landing
