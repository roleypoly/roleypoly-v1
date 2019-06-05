import { Command } from './_types'
import { withTyping } from '../utils'
import Bot from '../Bot'
import { Message } from 'eris'

const cmds: Command[] = [
  {
    regex: /^\blog ?in|auth\b/,
    usage: 'login',
    description: 'responds with a login token and link',

    handler: withTyping(async (bot: Bot, msg: Message) => {
      const chall = await bot.rpc.issueAuthChallenge(msg.author.id)
      return chall
    })
  },
  {
    regex: /^\blog ?out\b/,
    usage: 'logout',
    description: 'removes all sessions',

    handler: withTyping(async (bot: Bot, msg: Message) => {
      await bot.rpc.removeUserSessions(msg.author.id)
      return `I've logged you out!`
    })
  }
]

export default new Set<Command>(cmds)
