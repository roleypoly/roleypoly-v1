import color from 'color'

export const msgToReal = msg => msg.replace(/</g, '&lt;').replace(/\n/g, '<br />')

export const colorToCSS = colorInt => color(colorInt).hsl().string()