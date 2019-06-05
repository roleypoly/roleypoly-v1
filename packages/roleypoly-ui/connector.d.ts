import Next, { DevServer } from 'next'

declare module '@roleypoly/ui/connector' {
  export default function (opts: { dev: boolean }): DevServer
}
