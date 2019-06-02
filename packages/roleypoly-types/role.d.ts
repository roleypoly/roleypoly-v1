
export declare type PresentableRole = {
  id: string,
  color: number,
  name: string,
  position: number,
  safe: boolean
}

export declare type Permissions = {
  canManageRoles: boolean,
  isAdmin: boolean,
  faked?: boolean,
  __faked?: Permissions
}

export declare type CachedRole = {
  id: string,
  position: number,
  color?: number
}
