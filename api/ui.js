// note, this file only contains stuff for complicated routes.
// next.js will handle anything beyond this.
module.exports = (R, $) => {
  const processMappings = mapping => {
    for (let p in mapping) {
      R.get(p, ctx => {
        $.ui.render(ctx.req, ctx.res, mapping[p], {...ctx.params, ...ctx.query})
      })
    }
  }

  processMappings({
    "/s/add": "/_server_add",
    "/s/:id": "/_server",
    "/help/:page": "/_help"
  })
}
