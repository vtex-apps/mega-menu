import type { Settings, ArgsSettings } from '../typings/custom'

const settings = async (_: unknown, __: unknown, ctx: Context) => {
  const {
    clients: { vbase },
  } = ctx

  let settingsItems: Settings[] = []

  try {
    settingsItems = await vbase.getJSON<Settings[]>('settings', 'menuSettings')
  } catch (err) {
    const errStr = err.toString()

    // If there are no menus, it is initialized empty
    if (errStr === 'Error: Request failed with status code 404') {
      await vbase.saveJSON('settings', 'menuSettings', [])
    } else {
      throw err
    }
  }

  return settingsItems
}

const createEditSettings = async (
  _: unknown,
  { settingsInput }: ArgsSettings,
  { clients: { vbase } }: Context
) => {
  let settingsItems: Settings[] = []

  // eslint-disable-next-line vtex/prefer-early-return
  if (settingsInput.idMenu) {
    try {
      settingsItems = await vbase.getJSON<Settings[]>(
        'settings',
        'menuSettings'
      )
    } catch (err) {
      const errStr = err.toString()

      if (errStr !== 'Error: Request failed with status code 404') {
        throw err
      }
    }

    const deleteDuplicates = settingsItems.map((obj) =>
      obj.idMenu === settingsInput.idMenu
        ? { ...obj, orientation: settingsInput.orientation }
        : obj
    )

    const saveData =
      deleteDuplicates.length > 0 ? deleteDuplicates : [settingsInput]

    return vbase
      .saveJSON('settings', 'menuSettings', saveData)
      .then(() => settingsInput)
  }

  return 'Error creating the item'
}

export const settingsQueries = {
  settings,
}

export const settingsMutations = {
  createEditSettings,
}
