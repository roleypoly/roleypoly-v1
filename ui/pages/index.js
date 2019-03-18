import * as React from 'react'
import redirect from '../lib/redirect'
// import Link from 'next/link'
// import Head from '../components/head'
// import Nav from '../components/nav'
import TypingDemo from '../components/demos/typing'
import TapDemo from '../components/demos/tap'

export default class Home extends React.Component {
  static async getInitialProps (ctx, rpc) {
    if (ctx.user != null) {
      redirect(ctx, '/s/add')
    }

    ctx.layout.noBackground = true
  }

  render () {
    return <div>
      <h2>A bot to tame your self-assignable Discord roles.</h2>
      <div>
        <TypingDemo />
        <p>What is this? 2005?</p>
      </div>
      <div>
        <TapDemo />
        <p>Just click or tap.</p>
      </div>

    </div>
  }
}
