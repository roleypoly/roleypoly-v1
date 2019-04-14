// @flow
import type Bot from './Bot'
import type { Message } from 'eris'

export const withTyping = (fn: Function) => async (bot: Bot, msg: Message, ...args: any[]) => {
  msg.channel.sendTyping()
  return fn(bot, msg, ...args)
}
