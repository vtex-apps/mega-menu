import { IOClients } from '@vtex/api'

import { Sphinx } from './sphinx'
import { VtexId } from './vtexId'

export class Clients extends IOClients {
  public get vtexId() {
    return this.getOrSet('vtexId', VtexId)
  }

  public get sphinx() {
    return this.getOrSet('sphinx', Sphinx)
  }
}
