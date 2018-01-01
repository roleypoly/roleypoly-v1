import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import Scrollbars from 'react-custom-scrollbars'
import Typist from 'react-typist'
import moment from 'moment'
import './landing.sass'
import discordLogo from './images/discord-logo.svg'
import RoleDemo from '../components/role/demo'

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
          <div className="landing__discord rp-discord">
            <div className="discord__chat">
              <span className="timestamp">{moment().format('LT')}</span>
              <span className="username">Kata カタ</span>
              <span className="text">Hey, I want some roles!</span>
            </div>
            <div className="discord__textarea">
              <Typist cursor={{ blink: true }}>
                <span>.iam a cute role ♡</span>
                <Typist.Backspace count={30} delay={1500} />
                <span>.iam a vanity role ♡</span>
                <Typist.Backspace count={30} delay={1500} />
                <span>.iam a brave role ♡</span>
                <Typist.Backspace count={30} delay={1500} />
                <span>.iam a proud role ♡</span>
                <Typist.Backspace count={30} delay={1500} />
                <span>.iam a wonderful role ♡</span>
                <Typist.Backspace count={30} delay={1500} />
                <span>i have too many roles.</span>
              </Typist>
            </div>
          </div>
          <p className="subtext">Why are we stuck in the stupid ages?</p>
        </div>
        {/* role side */}
        <div className="uk-width-1-2">
          <div className="landing__roleypoly">
            <RoleDemo name="a cute role ♡" color="#3EC1BF" />
            <RoleDemo name="a vanity role ♡" color="#F7335B" />
            <RoleDemo name="a brave role ♡" color="#A8D0B8" />
            <RoleDemo name="a proud role ♡" color="#5C8B88" />
            <RoleDemo name="a wonderful role ♡" color="#D6B3C7" />
          </div>
          <p className="subtext">It's 2018. We can do better.</p>
        </div>
      </section>
    </div>
  </div>
export default Landing
