// @flow
import { type AppContext } from '../Roleypoly'
import { type Context } from 'koa'

export default ($: AppContext) => ({
  async checkAuthChallenge (ctx: Context, text: string): Promise<boolean> {
    const chall = await $.auth.fetchDMChallenge({ human: text.toLowerCase() })
    if (chall == null) {
      return false
    }

    $.auth.injectSessionFromChallenge(ctx, chall)
    $.auth.deleteDMChallenge(chall)
    return true
  }
})
