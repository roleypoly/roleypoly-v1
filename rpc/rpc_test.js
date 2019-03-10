// @flow
import { type AppContext } from '../Roleypoly'
import { type Context } from 'koa'
export default ($: AppContext) => ({
  // i want RPC to be *dead* simple.
  // probably too simple.
  hello (_: Context, hello: string) {
    return `hello, ${hello}!`
  },

  testJSON (_: Context, inobj: {}) {
    return inobj
  }
})
