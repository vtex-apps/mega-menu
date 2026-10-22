import { AuthenticationError, ForbiddenError } from '@vtex/api'

export async function requireAdminSession(ctx: Context) {
  const token = ctx.vtex.adminUserAuthToken

  if (!token) {
    throw new AuthenticationError('Missing VTEX ID session')
  }

  const session = await ctx.clients.vtexId.validate(token)

  if (
    !session?.user ||
    (session.account && session.account !== ctx.vtex.account)
  ) {
    throw new AuthenticationError('Invalid VTEX ID session')
  }

  const isAdmin = await ctx.clients.sphinx.isAdmin(session.user)

  if (!isAdmin) {
    throw new ForbiddenError('User is not an account admin')
  }
}
