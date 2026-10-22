import { ExternalClient, IOContext, InstanceOptions } from '@vtex/api'

export interface VtexIdUser {
  user: string
  account?: string
}

export class VtexId extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(
      `http://${context.account}.vtexcommercestable.com.br/api/vtexid`,
      context,
      options
    )
  }

  public async validate(token: string): Promise<VtexIdUser | null> {
    try {
      return await this.http.post<VtexIdUser>(
        `credential/validate?an=${this.context.account}`,
        { token },
        {
          headers: {
            'X-VTEX-Proxy-To': `https://${this.context.account}.vtexcommercestable.com.br`,
          },
        }
      )
    } catch (error) {
      const status = (error as { response?: { status?: number } }).response
        ?.status

      if (status === 401) {
        return null
      }

      throw error
    }
  }
}
