import Bento, { Transport, IBentoSerializer } from '@kayteh/bento'
import http from 'http'
import superagent from 'superagent'
import cookie from 'cookie'

const txtEnc = new TextEncoder()
const txtDec = new TextDecoder()

const castString = (val: string | string[] | undefined): string => {
  if (typeof val === 'string') {
    return val
  }

  if (Array.isArray(val)) {
    return val[0]
  }

  return val || ''
}

export type HTTPContext = {
  cookies: { [x: string]: string }
  headers: http.IncomingHttpHeaders
  requestor: {
    userAgent: string
    clientIp: string
  }
}

export default class HTTPTransport extends Transport {
  constructor (
    bento: Bento,
    serializer: IBentoSerializer,
    private endpoint: string,
    private injectHeaders: { [x: string]: string } = {}
  ) {
    super(bento, serializer)
  }
  handler = () => (req: http.IncomingMessage, res: http.ServerResponse) => {
    // we're using bare http, so this can get a little dicey
    // we do not assume we are routing in any special way here.
    // a standardized approach would be POST /api/_rpc
    if (req.method !== 'POST') {
      res.statusCode = 405
      res.end('Method not acceptable.')
      return
    }

    return this.run(req, res)
  }

  run = (req: http.IncomingMessage, res: http.ServerResponse) => {
    let buf = ''
    req.on('data', (chunk: string) => {
      buf += chunk
    })

    req.on('end', async () => {
      const o = await this.receiver({ buffer: txtEnc.encode(buf), ctx: this.getContext(req, res) })
      res.statusCode = 200
      res.end(txtDec.decode(o))
    })
  }

  /**
   * get real client IP from headers or fallback to a default.
   * since proxies add headers to tell a backend what is relevant,
   * we use this failover pattern:
   *  - True-Client-IP (from Cloudflare)
   *  - X-Forwarded-For (0 position is true client)
   *  - X-Client-IP (from Cloudfront, or even HAProxy by hand)
   *  - default
   * @param h http headers
   * @param def fallback (usually socket remoteAddr)
   */
  getClientIP (h: http.IncomingHttpHeaders, def: string): string {
    // we cast all of these to string because there will literally never be another.
    if (h['true-client-ip'] !== undefined) {
      return castString(h['true-client-ip'])
    }

    if (h['x-client-ip'] !== undefined) {
      return castString(h['x-client-ip'])
    }

    if (h['x-forwarded-for'] !== undefined) {
      return castString(h['x-forwarded-for']).split(', ')[0]
    }

    return def
  }

  // overridable
  getContext = (req: http.IncomingMessage, res: http.ServerResponse): HTTPContext => {
    return {
      headers: req.headers,
      cookies: cookie.parse(req.headers.cookie || ''),
      requestor: {
        clientIp: this.getClientIP(req.headers, req.socket.remoteAddress || ''),
        userAgent: req.headers['user-agent'] || ''
      }
    }
  }

  /**
   * creates a fake header that we extract JSON from to properly pass cookies in a server->server environment.
   * @param o cookie object
   */
  withCookies (o: { [x: string]: string }) {
    const out: string[] = []

    for (const [key, val] of Object.entries(o)) {
      out.push(cookie.serialize(key, val))
    }

    this.injectHeaders['@@-Set-Cookie'] = JSON.stringify(out)
  }

  withAuthorization (token: string) {
    this.injectHeaders['Authorization'] = token
  }

  /**
   * parses and removes the synthetic cookie header
   * @param o headers
   */
  cookiesFromSyntheticHeaders (o: { '@@-Set-Cookie'?: string }): string[] {
    if (o['@@-Set-Cookie'] !== undefined) {
      const out = JSON.parse(o['@@-Set-Cookie'])
      delete o['@@-Set-Cookie']
      return out
    }

    return []
  }

  async sender (data: ArrayBuffer, _: { service: string, fn: string }): Promise<ArrayBuffer> {
    const c = this.cookiesFromSyntheticHeaders(this.injectHeaders)

    const r = superagent.post(this.endpoint)
    .type('')
    .send(txtDec.decode(data))
    .set('User-Agent', 'roleypoly/2.0 bento http client (+https://roleypoly.com)')
    .withCredentials()
    .set(this.injectHeaders)
    .ok(() => true)

    if (c.length > 0) {
      r.set('Cookie', c)
    }

    const res = await r

    return txtEnc.encode(res.text)
  }
}
