import { menuQueries, menuMutations } from './menu'

export const resolvers = {
  Mutation: {
    ...menuMutations,
  },
  Query: {
    ...menuQueries,
  },
}
