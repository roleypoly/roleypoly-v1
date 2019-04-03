// @flow
import { type AppContext } from '../Roleypoly'
import { type Context } from 'koa'
import * as secureAs from './_security'
export default ($: AppContext) => ({
  // i want RPC to be *dead* simple.
  // probably too simple.
  hello (_: Context, hello: string) {
    return `hello, ${hello} and all who inhabit it`
  },

  testJSON (_: Context, inobj: {}) {
    return inobj
  },

  testDecide: secureAs.decide($,
    [ secureAs.root, () => { return 'root' } ],
    [ secureAs.manager, () => { return 'manager' } ],
    [ secureAs.member, () => { return 'member' } ],
    [ secureAs.authed, () => { return 'authed' } ],
    [ secureAs.any, () => { return 'guest' } ]
  )
})
