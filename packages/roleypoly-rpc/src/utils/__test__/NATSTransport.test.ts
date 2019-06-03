import NATSTransport from '../NATSTransport'
import Bento, { JSONSerializer } from '@kayteh/bento'
import { MockBackendClient } from './mock.bento'
import MockBackendServer from './mock-server'

describe('NATSTransport', () => {
  const NOW = Date.now()
  const bento = new Bento()

  const tt = new NATSTransport(
    bento,
    new JSONSerializer(),
    'nats://localhost:4222/',
    '' + NOW
  )

  bento.transport = tt

  bento.service(MockBackendClient.__SERVICE__, MockBackendServer)
  const cc = bento.client(MockBackendClient)

  it('handles full flow properly', async () => {
    const out = await cc.helloBackend({ hello: 'yes!' })
    expect(out.message).toBe(`hello, yes!! i'm bot!!`)
  })
})
