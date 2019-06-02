import { Message } from 'eris'
import Bot from '../Bot'

export type Command = {
  regex: RegExp,
  usage: string,
  description: string,
  handler: (bot: Bot, message: Message, matches: string[]) => Promise<string | void> | string | void
}

export type CommandSet = Set<Command>