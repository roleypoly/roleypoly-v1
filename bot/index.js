// @flow
import type DiscordService from '../services/discord'
import logger from '../logger'
const log = logger(__filename)

export default class Bot {
  svc: DiscordService
  log: typeof log
  constructor (DS: DiscordService) {
    this.svc = DS
    this.log = log
  }
}
