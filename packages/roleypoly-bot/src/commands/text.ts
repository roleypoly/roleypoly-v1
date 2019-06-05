import { Command } from './_types'
import Bot from '../Bot'
import { Message } from 'eris'

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
