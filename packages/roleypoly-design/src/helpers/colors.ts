import Color from 'color'

export const color = (i: Color | string) => {
  return new Color(i)
}

export const stepUp = (input: Color | string): string => {
  return color(input).lighten(0.1).string()
}
export const stepDown = (input: Color | string): string => {
  return color(input).darken(0.1).string()
}

export const textMode = (bg: Color | string, light: string = '#efefef', dark: string = '#1c1111'): string => {
  return color(bg).isDark() ? light : dark
}
