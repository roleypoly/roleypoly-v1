import NATS, { connect, NatsError } from 'nats'
import Bento, { Transport, IBentoSerializer } from '@kayteh/bento'

export default class NATSTransport extends Transport {
  NATS: NATS.Client

  constructor (
    bento: Bento,
    serializer: IBentoSerializer,
    addr: string = 'nats://localhsot:4222/',
    private prefix: string = ''
  ) {
    super(bento, serializer)

    this.NATS = connect({
      url: addr,
      preserveBuffers: true
    })
  }

  public hookHandlers = () => {
    for (const svc in this.bento.serviceRegistry.keys) {
      this.NATS.subscribe(`${this.prefix}-rpc:${svc}`, this.rpcHandler)
    }
  }

  rpcHandler = async (request: ArrayBuffer, replyTo: string) => {
    this.NATS.publish(replyTo, await this.receiver({
      ctx: {},
      buffer: request
    }))
  }

  sender (data: ArrayBuffer, { service }: { service: string }): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      this.NATS.requestOne(`${this.prefix}-rpc:${service}`, data, 5000, (incoming: NatsError | Buffer) => {
        if (incoming instanceof NatsError) {
          reject(incoming)
          return
        }

        resolve(incoming)
        return
      })
    })
  }
}
