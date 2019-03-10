// @flow
import { namespaceConfig } from 'fast-redux'

export type User = {
  id: string,
  username: string,
  discriminator: string,
  avatar: string,
  nicknameCache: {
    [server: string]: string
  }
}

export type UserState = {
  currentUser: User | null,
  userCache: {
    [id: string]: User
  }
}

const DEFAULT_STATE: UserState = {
  currentUser: null,
  userCache: {}
}

export const {
  action, getState: getUserStore
} = namespaceConfig('userStore', DEFAULT_STATE)

export const getCurrentUser = () => async (dispatch: Function) => {

}
