// note, this file only contains stuff for complicated routes.
// next.js will handle anything beyond this.
module.exports = (R, $) => {
  const processMappings = mapping => {
    for (let p in mapping) {
      R.get(p, ctx => {
        return $.ui.render(ctx.req, ctx.res, mapping[p], { ...ctx.query, ...ctx.params })
      })
    }
  }

  processMappings({
    '/s/add': '/_internal/_server_add',
    '/s/:id': '/_internal/_server',
    '/test': '/test'
  })
}
