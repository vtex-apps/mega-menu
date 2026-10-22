import { ExternalClient, IOContext, InstanceOptions } from '@vtex/api'

const DEFAULT_REGION = 'aws-us-east-1'

export class Sphinx extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    const region = process.env.VTEX_REGION ?? DEFAULT_REGION

    super(`http://sphinx.${region}.vtex.io`, context, options)
  }

  public isAdmin(email: string): Promise<boolean> {
    const { account, workspace } = this.context

    return this.http.get<boolean>(
      `${account}/${workspace}/user/${email}/isAdmin`,
      {
        headers: {
          Authorization: this.context.authToken,
        },
      }
    )
  }
}
