import HTTPTransport from '../HTTPTransport'
import Bento, { JSONSerializer } from '@kayteh/bento'
import { MockBackendClient } from './mock.bento'
import MockBackendServer from './mock-server'
import * as http from 'http'
import * as sinon from 'sinon'

describe('HTTPTransport', () => {
  const NOW = Date.now()
  const PORT = 20000 + (+(('' + NOW).slice(-4)))
  const bento = new Bento()
  const tt = new HTTPTransport(
      bento,
      new JSONSerializer(),
      `https://localhost:${PORT}/api/_rpc`,
      {}
    )
  const h = tt.handler()
  const spy = sinon.spy(h)
  const s = http.createServer(spy)
  s.listen(PORT)

  bento.transport = tt

  bento.service(MockBackendClient.__SERVICE__, MockBackendServer)
  const cc = bento.client(MockBackendClient)

  it('handles full flow properly', async () => {
    const out = await cc.helloBackend({ hello: 'yes!' })
    expect(out.message).toBe(`hello, yes!! i'm bot!!`)
  })

  s.close()
})
