import { AppContext } from '../Roleypoly'
import { Context } from 'koa'
import { bot } from './_security'

export default ($: AppContext) => ({
  async checkAuthChallenge (ctx: Context, text: string): Promise<boolean> {
    const chall = await $.auth.fetchDMChallenge({ human: text.toLowerCase() })
    if (chall == null) {
      return false
    }

    $.auth.injectSessionFromChallenge(ctx, chall)
    $.auth.deleteDMChallenge(chall)
    return true
  },

  issueAuthChallenge: bot($, (ctx: Context, userId: string) => {
    return $.discord.issueChallenge(userId)
  }),

  botPing: bot($, () => {
    return true
  }),

  removeUserSessions: bot($, async (ctx: Context, userId: string) => {
    await $.auth.clearUserSessions(userId)
    return true
  })
})
