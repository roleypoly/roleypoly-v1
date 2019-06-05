import { Command } from './_types'
import Bot from '../Bot'
import { Message } from 'eris'
import { withTyping } from '../utils'

const cmds: Command[] = [
  {
    regex: /^remove sessions for/,
    usage: 'remove sessions for <mention>',
    description: 'removes all sessions for a given user.',

    handler: withTyping(async (bot: Bot, msg: Message) => {
      const u = msg.mentions[0]
      await bot.rpc.removeUserSessions(u.id)
      return `${u.mention} should no longer be logged in on any device.`
    })
  },
  {
    regex: /^always error/,
    usage: 'always error',
    description: 'creates an error',

    handler: () => {
      throw new Error('not an error, this is actually a success.')
    }
  }
]

export default new Set<Command>(cmds)
