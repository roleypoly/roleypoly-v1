import * as React from 'react'
import styled from 'styled-components'
import MediaQuery from '../kit/media'

export const Overlay = styled.div`
  opacity: 0.6;
  pointer-events: none;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: -1;
  background-image: radial-gradient(circle, var(--c-dark), var(--c-dark) 1px, transparent 1px, transparent);
  background-size: 27px 27px;
`

const ResponsiveSplitter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1.6;
  font-size: 1.3em;
  flex-direction: column;

  ${() => MediaQuery({
    md: `flex-direction: row; min-height: 100vh; position: relative; top: -50px;`
  })}

  & > div {
    margin: 1rem;
  }

  & section {
    text-align: center;
  ${() => MediaQuery({
    md: `text-align: left;`
  })}
  }
`

const JapaneseFlair = styled.section`
  color: var(--c-3);
  font-size: 0.9rem;
`

const Code = styled.h1`
  margin: 0;
  padding: 0;
  font-size: 4em;
  ${() => MediaQuery({
    md: `font-size: 2em;`
  })}
`

export default class CustomErrorPage extends React.Component {
  static getInitialProps ({ res, err }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null
    return { statusCode }
  }

  render404 () {
    return <div>
      <Overlay />
      <ResponsiveSplitter>
        <div>
          <Code>404</Code>
        </div>
        <div>
          <section>
            This page is in another castle.
          </section>
          <JapaneseFlair>お探しのページは見つかりませんでした</JapaneseFlair>
        </div>
      </ResponsiveSplitter>
    </div>
  }

  render403 () {
    return <div>
      <Overlay />
      <ResponsiveSplitter>
        <div>
          <Code>403</Code>
        </div>
        <div>
          <section>
            You weren't allowed to access this.
          </section>
          <JapaneseFlair>あなたはこの点に合格しないかもしれません</JapaneseFlair>
        </div>
      </ResponsiveSplitter>
    </div>
  }

  render500 () {
    return <div>
      <Overlay />
      <ResponsiveSplitter>
        <div>
          <Code>500</Code>
        </div>
        <div>
          <section>
            The server doesn't like you right now. Feed it a cookie.
          </section>
          <JapaneseFlair>クッキーを送ってください〜  クッキーを送ってください〜</JapaneseFlair>
        </div>
      </ResponsiveSplitter>
    </div>
  }

  renderDefault () {
    return <div>
      <Overlay />
      <ResponsiveSplitter>
        <div>
          <Code>Oops.</Code>
        </div>
        <div>
          <section>
            Something went bad. How could this happen?
          </section>
          <JapaneseFlair>おねがい？</JapaneseFlair>
        </div>
      </ResponsiveSplitter>
    </div>
  }

  renderServer () {
    return <div>
      <Overlay />
      <ResponsiveSplitter>
        <div>
          <Code>Oops.</Code>
        </div>
        <div>
          <section>
            Server was unhappy about this render. Try reloading or changing page.
          </section>
          <JapaneseFlair>クッキーを送ってください〜</JapaneseFlair>
        </div>
      </ResponsiveSplitter>
    </div>
  }

  handlers = {
    403: this.render403,
    404: this.render404,
    500: this.render500
  }

  render () {
    if (this.props.originalName === 'ErrorPage') {
      return this.renderServer()
    }

    if (this.props.statusCode in this.handlers) {
      return this.handlers[this.props.statusCode]()
    }

    return this.renderDefault()
  }
}
