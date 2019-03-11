// @flow
import * as React from 'react'
import NextHead from 'next/head'

export type SocialCardProps = {
  title?: string,
  description?: string,
  image?: string,
  imageSize?: number
}

const defaultProps: SocialCardProps = {
  title: 'Roleypoly',
  description: 'Tame your Discord roles.',
  image: 'https://rp.kat.cafe/static/social.png',
  imageSize: 200
}

const SocialCards: React.StatelessFunctionalComponent<SocialCardProps> = (props) => {
  props = {
    ...defaultProps,
    ...props
  }

  return <NextHead>
    <meta key='og:title' property='og:title' content={props.title} />
    <meta key='og:description' property='og:description' content={props.description} />
    <meta key='twitter:card' name='twitter:card' content='summary_large_image' />
    <meta key='twitter:image' name='twitter:image' content={props.image} />
    <meta key='og:image' property='og:image' content={props.image} />
    <meta key='og:image:width' property='og:image:width' content={props.imageSize} />
    <meta key='og:image:height' property='og:image:height' content={props.imageSize} />
  </NextHead>
}

export default SocialCards
