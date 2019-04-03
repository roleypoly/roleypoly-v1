export default ($, ctx) => {
  ctx.res.statusCode = ctx.status
  return $.ui.renderError(null, ctx.req, ctx.res, '/_error', {})
}
