module.exports = (R, $) => {
  R.get('/api/servers', (ctx) => {
    ctx.body = 'hi'
    console.log($)
  })
}
