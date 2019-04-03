import * as React from 'react'
import redirect from '../lib/redirect'
// import Link from 'next/link'
// import Head from '../components/head'
// import Nav from '../components/nav'
import TypingDemo from '../components/demos/typing'
import TapDemo from '../components/demos/tap'
import styled from 'styled-components'
import MediaQuery from '../kit/media'

const HeroBig = styled.h1`
  color: var(--c-7);
  font-size: 1.8em;
`

const HeroSmol = styled.h1`
  color: var(--c-5);
  font-size: 1.1em;
`

const Hero = styled.div`
  padding: 2em 0;
  text-align: center;
`

const Footer = styled.p`
  text-align: center;
  font-size: 0.7em;
  opacity: 0.3;
  transition: opacity 0.3s ease-in-out;

  &:hover {
    opacity: 1;
  }

  &:active {
    opacity: 1;
  }
`

const FooterLink = styled.a`
  font-style: none;
  color: var(--c-7);
  text-decoration: none;
  transition: color 0.3s ease-in-out;

  &:hover {
    color: var(--c-5);
  }
`

const DemoArea = styled.div`
  display: flex;
  flex-direction: column;
  ${() => MediaQuery({ md: `flex-direction: row;` })}

  & > div {
    flex: 1;
    padding: 10px;
  }

  & > div > p {
    text-align: center;
  }
`

const Wrapper = styled.div`
  flex-wrap: wrap;
  ${() => MediaQuery({
    md: `
      display: flex;
      justify-content: center;
      align-items: center;
      height: 80vh;
      min-height: 500px;
    `
  })}
`

export default class Home extends React.Component {
  static async getInitialProps (ctx, rpc) {
    if (ctx.user != null) {
      redirect(ctx, '/s/add')
    }

    ctx.layout.noBackground = true
  }

  render () {
    return <div>
      <Wrapper>
        <div>
          <Hero>
            <HeroBig>Discord roles for humans.</HeroBig>
            <HeroSmol>Ditch bot commands once and for all.</HeroSmol>
          </Hero>
          <DemoArea>
            <div>
              <TypingDemo />
              <p>What is this? 2005?</p>
            </div>
            <div>
              <TapDemo />
              <p>Just click or tap.</p>
            </div>
          </DemoArea>
        </div>
      </Wrapper>
      <Footer>
        © {new Date().getFullYear()}<br />
        Made with ♡&nbsp;
        <img src='/static/flags.svg' style={{ height: '1em', opacity: 0.5 }} /><br />
        <FooterLink target='_blank' href='https://ko-fi.com/roleypoly'>Ko-Fi</FooterLink>&nbsp;-&nbsp;
        <FooterLink target='_blank' href='https://github.com/kayteh/roleypoly'>GitHub</FooterLink>&nbsp;-&nbsp;
        <FooterLink target='_blank' href='https://discord.gg/PWQUVsd'>Discord</FooterLink>
      </Footer>
    </div>
  }
}
