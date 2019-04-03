import * as React from 'react'
import styled from 'styled-components'
import { md } from '../kit/media'

export const Overlay = styled.div`
  opacity: 0.6;
  pointer-events: none;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: -10;
  background-image: radial-gradient(circle, var(--c-dark), var(--c-dark) 1px, transparent 1px, transparent);
  background-size: 27px 27px;
`

const ResponsiveSplitter = styled.div`
  z-index: -1;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1.6;
  font-size: 1.3em;
  flex-direction: column;
  ${md`
    flex-direction: row; 
    min-height: 100vh; 
    position: relative; 
    top: -50px;
  `}

  & > div {
    margin: 1rem;
  }

  & section {
    text-align: center;
    ${md`text-align: left;`}
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
  ${md`font-size: 2em;`}
`

export default class CustomErrorPage extends React.Component {
  static getInitialProps ({ res, err, robots }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null
    robots = 'NOINDEX, NOFOLLOW'
    return { statusCode }
  }

  render400 = () => this.out('400', `Your client sent me something weird...`, '((((；゜Д゜)))')
  render403 = () => this.out('403', `You weren't allowed to access this.`, 'あなたはこの点に合格しないかもしれません')
  render404 = () => this.out('404', 'This page is in another castle.', 'お探しのページは見つかりませんでした')
  render419 = () => this.out('419', 'Something went too slowly...', 'おやすみなさい〜')
  render500 = () => this.out('500', `The server doesn't like you right now. Feed it a cookie.`, 'クッキーを送ってください〜  クッキーを送ってください〜')
  renderDefault = () => this.out('Oops', 'Something went bad. How could this happen?', 'おねがい？')
  renderServer = () => this.out('Oops.', 'Server was unhappy about this render. Try reloading or changing page.', 'クッキーを送ってください〜')
  renderAuthExpired = () => this.out('Woah.', 'That magic login link was expired.', 'What are you trying to do?')

  out (code, description, flair) {
    return <div>
      <Overlay />
      <ResponsiveSplitter>
        <div>
          <Code>{code}</Code>
        </div>
        <div>
          <section>
            {description}
          </section>
          <JapaneseFlair>{flair}</JapaneseFlair>
        </div>
      </ResponsiveSplitter>
    </div>
  }

  handlers = {
    400: this.render400,
    403: this.render403,
    404: this.render404,
    419: this.render419,
    500: this.render500,
    1001: this.renderAuthExpired
  }

  render () {
    // if (this.props.originalName === 'ErrorPage') {
    //   return this.renderServer()
    // }

    if (this.props.statusCode in this.handlers) {
      return this.handlers[this.props.statusCode]()
    }

    return this.renderDefault()
  }
}
