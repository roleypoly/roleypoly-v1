declare module '@roleypoly/ui/mappings' {
  export type Mappings = {
    [newPath: string]: {
      path: string,
      custom?: (router: { get: (ctx: any) => void }) => void,
      noAutoFix?: boolean
    }
  }

  const mappings: Mappings

  export default mappings
}
