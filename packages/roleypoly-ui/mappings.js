module.exports = {

  '/s/add': {
    path: '/_internal/_server_add',
    custom (router) {
      router.get('/s/', ctx => ctx.redirect('/s/add'))
    }
  },

  '/s/:id': {
    path: '/_internal/_server',
    noAutoFix: true,
    custom (router) {
      router.get('/_internal/_server', ctx => {
        if (ctx.query.id) {
          return ctx.redirect(`/s/${ctx.query.id}`)
        }

        return ctx.redirect('/s/add')
      })
    }
  }
}
