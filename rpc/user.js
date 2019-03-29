// @flow
import { type AppContext } from '../Roleypoly'
import { type Context } from 'koa'
import * as secureAs from './_security'

export default ($: AppContext) => ({

  getCurrentUser: secureAs.authed($, (ctx: Context) => {
    return $.discord.getUserPartial(ctx.session.userId)
  }),

  isRoot: secureAs.root($, () => {
    return true
  })



})
