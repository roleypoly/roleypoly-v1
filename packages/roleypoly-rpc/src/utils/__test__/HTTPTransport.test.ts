import HTTPTransport from '../HTTPTransport'
import Bento, { JSONSerializer } from '@kayteh/bento'
import { MockBackendClient } from './mock.bento'
import MockBackendServer from './mock-server'
import * as http from 'http'
import sinon from 'sinon'

const getCC = () => {
  const NOW = Date.now()
  const PORT = 20000 + (+(('' + NOW).slice(-4)))
  const bento = new Bento()
  const bento2 = new Bento()
  const tt = new HTTPTransport(bento, new JSONSerializer({ verbose: true }), `http://localhost:${PORT}/api/_rpc`, {})
  const h = tt.handler()
  const spy = sinon.spy(h)
  const s = http.createServer(spy)
  s.listen(PORT)

  bento.transport = tt
  bento2.transport = tt

  bento.service(MockBackendClient.__SERVICE__, MockBackendServer)
  const cc = bento2.client(MockBackendClient)

  return { cc, spy }
}

describe('HTTPTransport', async () => {

  it('handles full flow properly', async () => {
    const { cc, spy } = getCC()
    const out = await cc.helloBackend({ hello: 'yes!' })
    expect(out.message).toBe(`hello, yes!! i'm bot!!`)
    expect(spy.called).toBe(true)
  })
})
