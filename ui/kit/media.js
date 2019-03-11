// @flow
export type MediaQuery = $Shape<{
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

export default (mq: MediaQuery) => {
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
