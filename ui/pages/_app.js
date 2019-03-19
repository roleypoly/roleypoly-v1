// @flow
import * as React from 'react'
import App, { Container } from 'next/app'
import Head from 'next/head'
import Layout from '../components/layout'
import { withCookies } from '../config/rpc'
import ErrorP, { Overlay } from './_error'
import styled from 'styled-components'

type NextPage = React.Component<any> & React.StatelessFunctionalComponent<any> & {
  getInitialProps: (ctx: any, ...args: any) => any
}

const MissingJS = styled.noscript`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  font-size: 1.3em;
  padding: 1em;
`

class RoleypolyApp extends App {
  static async getInitialProps ({ Component, ctx }: { Component: NextPage, ctx: {[x:string]: any}}) {
    // Fix for next/error rendering instead of our error page.
    // Who knows why this would ever happen.
    if (Component.displayName === 'ErrorPage' || Component.constructor.name === 'ErrorPage') {
      Component = ErrorP
    }

    // console.log({ Component })

    let pageProps = {}
    const rpc = withCookies(ctx)

    const user = await rpc.getCurrentUser()
    ctx.user = user

    ctx.layout = {
      noBackground: false
    }

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx, rpc)
    }

    // console.log({ pageProps })

    return { pageProps, user, layout: ctx.layout }
  }

  catchFOUC () {
    setTimeout(() => {
      if (document.documentElement) document.documentElement.className += ' force-active'
    }, 1500)
  }

  render () {
    const { Component, pageProps, router, user, layout } = this.props
    // Fix for next/error rendering instead of our error page.
    // Who knows why this would ever happen.
    const ErrorCaughtComponent = (Component.displayName === 'ErrorPage' || Component.constructor.name === 'ErrorPage') ? ErrorP : Component
    return <Container>
      <MissingJS>
        <Overlay />
        Hey there... Unfortunately, we require JS for this app to work. Please take this rose as retribution. 🌹
      </MissingJS>
      <Head>
        <meta charSet='utf-8' />
        <title key='title'>Roleypoly</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/static/favicon.png' />
        <script key='typekit' dangerouslySetInnerHTML={{ __html: `
            (function(d) {
              var config = {
                kitId: 'bck0pci',
                scriptTimeout: 1500,
                async: true
              },
              h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\bwf-loading\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
            })(document);//
          ` }} />
      </Head>
      <Layout user={user} {...layout}>
        <ErrorCaughtComponent {...pageProps} router={router} originalName={Component.displayName || Component.constructor.name} />
      </Layout>
    </Container>
  }
}

export default RoleypolyApp
