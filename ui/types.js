// @flow
import type { ServerSlug as BackendServerSlug } from '../services/presentation'
import type Router from 'next/router'

export type PageProps = {
  router: Router
}

export type ServerSlug = BackendServerSlug
