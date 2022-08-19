import { menuQueries, menuMutations } from './menu'
import { settingsQueries, settingsMutations } from './settings'

export const resolvers = {
  Mutation: {
    ...menuMutations,
    ...settingsMutations,
  },
  Query: {
    ...menuQueries,
    ...settingsQueries,
  },
}
