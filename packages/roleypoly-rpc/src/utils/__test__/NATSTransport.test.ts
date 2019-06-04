import NATSTransport from '../NATSTransport'
import Bento, { JSONSerializer } from '@kayteh/bento'
import { MockBackendClient } from './mock.bento'
import MockBackendServer from './mock-server'

const getCC = () => {
  const NOW = Date.now()
  const bento = new Bento()
  const bento2 = new Bento()

  const tt = new NATSTransport(bento, new JSONSerializer({ verbose: true }), 'nats://localhost:4222/', '' + NOW)

  bento.transport = tt
  bento2.transport = tt

  bento.service(MockBackendClient.__SERVICE__, MockBackendServer)
  const cc = bento2.client(MockBackendClient)

  return cc
}

describe('NATSTransport', () => {

  it('handles full flow properly', async () => {
    const cc = getCC()
    const out = await cc.helloBackend({ hello: 'yes!' })
    expect(out.message).toBe(`hello, yes!! i'm bot!!`)
  })
})
