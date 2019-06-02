import { Context } from 'koa'
import { AppContext, Router } from '../Roleypoly'
export default (R: Router, $: AppContext) => {
  // note, this file only contains stuff for complicated routes.
  // next.js will handle anything beyond this.
  const processMappings = (mapping: { [path: string]: { path: string, noAutoFix?: boolean } }) => {
    for (let p in mapping) {
      R.get(p, (ctx: Context) => {
        ctx.status = 200
        return $.ui.render(ctx.req, ctx.res, mapping[p].path || mapping[p], { ...ctx.query, ...ctx.params })
      })

      const { path } = mapping[p]
      if (!mapping[p].noAutoFix) {
        R.get(path, ctx => ctx.redirect(p))
      }
    }
  }

  processMappings({
    '/s/add': { path: '/_internal/_server_add' },
    '/s/:id': { path: '/_internal/_server', noAutoFix: true },
    '/test': { path: '/test_wwsw' }
  })

  // edge cases
  R.get('/_internal/_server', (ctx: Context) => {
    if (ctx.query.id) {
      return ctx.redirect(`/s/${ctx.query.id}`)
    }

    return ctx.redirect('/s/add')
  })

  R.get('/s/', (ctx: Context) => ctx.redirect('/s/add'))
}
