import {
  User,
  Member,
  Guild
} from 'eris'

export interface IFetcher {
  getUser: (id: string) => Promise<User | undefined>

  getGuild: (id: string) => Promise<Guild | undefined>

  getMember: (server: string, user: string) => Promise<Member | undefined>

  getGuilds: () => Promise<Guild[]>
}
