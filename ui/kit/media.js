// @flow
import styled from 'styled-components'

export type MediaQueryConfig = $Shape<{
  xs: string,
  sm: string,
  md: string,
  lg: string,
  xl: string
}>

export const breakpoints = {
  xs: 0,
  sm: 544,
  md: 768,
  lg: 1012,
  xl: 1280
}

const MediaQuery = (mq: MediaQueryConfig) => {
  const out = []

  for (const size in mq) {
    if (breakpoints[size] == null) {
      continue
    }

    const inner = mq[size]

    out.push(`@media screen and (min-width: ${breakpoints[size]}px) {\n${inner}\n};`)
  }

  return out.join('\n')
}

export default MediaQuery

export const Hide = {
  XS: styled.div`
    display: none;
    ${() => MediaQuery({ sm: `display: block` })}
  `,
  SM: styled.div`
    display: none;
    ${() => MediaQuery({ md: `display: block` })}
  `,
  MD: styled.div`
    display: none;
    ${() => MediaQuery({ lg: `display: block` })}
  `,
  LG: styled.div`
    display: none;
    ${() => MediaQuery({ xl: `display: block` })}
  `
}

export const Show = {
  XS: styled.div`
    display: block;
    ${() => MediaQuery({ sm: `display: none` })}
  `,
  SM: styled.div`
    display: block;
    ${() => MediaQuery({ md: `display: none` })}
  `,
  MD: styled.div`
    display: block;
    ${() => MediaQuery({ lg: `display: none` })}
  `,
  LG: styled.div`
    display: block;
    ${() => MediaQuery({ xl: `display: none` })}
  `
}
