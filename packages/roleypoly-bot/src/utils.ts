// @flow
import Bot from './Bot'
import { Message } from 'eris'

export const withTyping = (fn: Function) => async (bot: Bot, msg: Message, ...args: any[]) => {
  await msg.channel.sendTyping()
  return fn(bot, msg, ...args)
}
