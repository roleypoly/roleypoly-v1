import Router from 'next/router'

export type PageProps = {
  router: Router,
  dispatch: (...stuff: any) => any
}
