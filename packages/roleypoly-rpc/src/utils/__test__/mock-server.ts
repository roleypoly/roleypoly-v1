import { IMockBackendService, HelloMsg, HelloReply } from './mock.bento'

export default class MockBackendService implements IMockBackendService {
  helloBackend (ctx: any, msg: HelloMsg): HelloReply {
    return {
      message: `hello, ${msg.hello}! i'm bot!!`
    }
  }
}
