import Router from 'next/router'

export type PageProps = {
  router: typeof Router,
  dispatch: (...stuff: any) => any
}
