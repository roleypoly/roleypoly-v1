import color from 'color'

export const msgToReal = (msg) => msg.replace(/</g, '&lt;').replace(/\n/g, '<br />')

export const colorToCSS = (colorInt) => {
  if (colorInt === 0) {
    return '#fff'
  }

  return color(colorInt).hsl().string()
}
