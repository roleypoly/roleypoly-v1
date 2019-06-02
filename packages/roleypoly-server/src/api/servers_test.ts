import { Context } from 'koa'
import { AppContext, Router } from '../Roleypoly'

export default (R: Router, $: AppContext) => {
  R.get('/api/~/relevant-servers/:user', async (ctx: Context, next: () => void) => {
    // ctx.body = 'ok'
    const srv = $.discord.getRelevantServers(ctx.params.user)
    ctx.body = $.P.presentableServers(srv, ctx.params.user)
  })

  // R.get('/api/~/roles/:id/:userId', (ctx, next) => {
  //   // ctx.body = 'ok'
  //   const { id, userId } = ctx.params

  //   const srv = $.discord.client.guilds.get(id)

  //   if (srv === undefined) {
  //     ctx.body = { err: 'not found' }
  //     ctx.status = 404
  //     return
  //   }

  //   const gm = srv.members.get(userId)
  //   const roles = $.P.presentableRoles(id, gm)

  //   ctx.boy = roles
  // })
}
