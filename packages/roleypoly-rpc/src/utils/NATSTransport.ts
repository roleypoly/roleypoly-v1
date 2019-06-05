import NATS, { connect, NatsError } from 'nats'
import Bento, { Transport, IBentoSerializer } from '@kayteh/bento'
import console = require('console')

const txtEnc = new TextEncoder()
const txtDec = new TextDecoder()

export default class NATSTransport extends Transport {
  NATS: NATS.Client

  constructor (
    bento: Bento,
    serializer: IBentoSerializer,
    addr: string = 'nats://localhost:4222/',
    private prefix: string = 'roleypoly'
  ) {
    super(bento, serializer)

    this.NATS = connect({
      url: addr,
      preserveBuffers: true
    })
  }

  public hookHandlers = () => {
    for (let service of this.bento.serviceRegistry.keys()) {
      this.NATS.subscribe(`rp:${this.prefix}:${service}`, this.rpcHandler)
    }
  }

  rpcHandler = async (request: string, replyTo: string) => {
    // console.log('rpcHandler', { request, replyTo })
    const output = await this.receiver({
      ctx: {},
      buffer: txtEnc.encode(request)
    })
    this.NATS.publish(replyTo, txtDec.decode(output))
  }

  sender (data: ArrayBuffer, { service }: { service: string }): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      this.NATS.requestOne(`rp:${this.prefix}:${service}`, txtDec.decode(data), 5000, (incoming: NatsError | ArrayBuffer) => {
        if (incoming instanceof NatsError) {
          console.error('NATSError', incoming)
          reject(incoming)
          return
        }

        resolve(incoming)
        return
      })
    })
  }
}
