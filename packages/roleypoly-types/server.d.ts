import { Category } from './category'
import { PresentableRole, Permissions } from './role'

export declare type ServerSlug = {
  id: string,
  name: string,
  ownerID: string,
  icon: string
}

export declare type ServerModel = {
  id: string,
  categories: {
    [uuid: string]: Category
  },
  message: string
}

export declare type PresentableServer = ServerModel & {
  id: string,
  gm?: {
    color?: number | string,
    nickname: string,
    roles: string[]
  },
  server: ServerSlug,
  roles?: PresentableRole[],
  perms: Permissions
}
