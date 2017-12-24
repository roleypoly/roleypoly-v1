export const fadeOut = cb => dispatch => {
  dispatch({
    type: Symbol.for('app fade'),
    data: true
  })

  setTimeout(cb, 300)
}

export const fadeIn = {
  type: Symbol.for('app fade'),
  data: false
}
