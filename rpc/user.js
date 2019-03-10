// @flow
import { type AppContext } from '../Roleypoly'
import { type Context } from 'koa'
// import { type Guild } from 'discord.js'

export default ($: AppContext) => ({
  getCurrentUser (ctx: Context) {
    const { userId } = ctx.session
    return $.discord.getUserPartial(ctx.session.userId)
  }
})
