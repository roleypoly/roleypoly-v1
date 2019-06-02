import { Member as ErisMember } from 'eris'

export declare type UserPartial = {
  id: string,
  username: string,
  discriminator: string,
  avatar: string
}

export declare type Member = ErisMember & {
  color?: number,
  __faked?: true
}
