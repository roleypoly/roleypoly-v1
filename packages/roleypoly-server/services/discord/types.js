// @flow
import type {
  User,
  Member,
  Guild
} from 'eris'

export interface IFetcher {
  getUser: (id: string) => Promise<?User>;

  getGuild: (id: string) => Promise<?Guild>;

  getMember: (server: string, user: string) => Promise<?Member>;
}
