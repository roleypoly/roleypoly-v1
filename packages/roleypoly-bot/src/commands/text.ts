// @flow
import type { Command } from './_types'
import type Bot from '../Bot'
import type { Message } from 'eris'

const cmds: Command[] = [
  {
    regex: /^hi/,
    usage: 'hi',
    description: 'says hello',

    handler: (bot: Bot, msg: Message) => {
      msg.channel.createMessage('Hi there!')
    }
  }
]

export default new Set<Command>(cmds)
