import type { ServiceContext } from '@vtex/api'
import type { Clients } from '../clients'

declare global {
  // We declare a global Context type just to avoid re-writing ServiceContext<Clients, State> in every handler and resolver
  type Context = ServiceContext<Clients>
}

export {}
