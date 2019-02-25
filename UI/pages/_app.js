import App, { Container } from 'next/app'
import Head from 'next/head'
import GlobalColors from '../components/global-colors'

class RoleypolyApp extends App {
  static async getInitialProps ({ Component, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  componentDidMount () {
    this.loadTypekit(document)
  }

  loadTypekit (d) {
    var config = {
      kitId: 'bck0pci',
      scriptTimeout: 3000,
      async: true
    }
    const h = d.documentElement
    const t = setTimeout(function () { h.className = h.className.replace(/\bwf-loading\b/g, '') + ' wf-inactive' }, config.scriptTimeout)
    const tk = d.createElement('script')
    const s = d.getElementsByTagName('script')[0]
    let f = false
    let a
    h.className += ' wf-loading'
    tk.src = 'https://use.typekit.net/' + config.kitId + '.js'
    tk.async = true
    tk.onload = tk.onreadystatechange = function () {
      a = this.readyState
      if (f || (a && a !== 'complete' && a !== 'loaded')) return
      f = true
      clearTimeout(t)
      try { window.Typekit.load(config) } catch (e) {}
    }
    s.parentNode.insertBefore(tk, s)
  }

  render () {
    const { Component, pageProps, router } = this.props

    return (
      <Container>
        <Head />
        <GlobalColors />
        <Component {...pageProps} router={router} />
      </Container>
    )
  }
}

export default RoleypolyApp
