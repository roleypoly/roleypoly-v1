import React from 'react'
import './landing.sass'

const Error404 = ({ root = false }) =>
  <div className="landing uk-width-1-1 uk-text-center">
    <div className="uk-container">
      <section>
        <h1><span role="img">💔</span> g-gomen nasai</h1>
        <h4>I'm not sure what page you were looking for <span role="img">😢</span></h4>
      </section>
    </div>
  </div>

export default Error404
