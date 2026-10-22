import type { Menu, Args } from '../typings/custom'
import { requireAdminSession } from '../middlewares/requireAdminSession'

const reorderArray = (menu: Menu[]) => {
  for (let i = 1; i < menu.length; i++) {
    for (let j = 0; j < menu.length; j++) {
      if (menu[i].order < menu[j].order) {
        const tempValueItem = menu[i]

        menu[i] = menu[j]
        menu[j] = tempValueItem
      }
    }
  }

  return menu
}

const orderArray = (menuArray: Menu[]) => {
  menuArray.forEach((value: Menu) => {
    if (value.menu) {
      if (!value.menu.length) return
      reorderArray(value.menu)
    }
  })

  menuArray.forEach((item: Menu) => {
    if (item.menu) {
      item.menu.forEach((subitem: Menu) => {
        if (subitem.menu) {
          if (!subitem.menu.length) return
          reorderArray(subitem.menu)
        }
      })
    }
  })

  reorderArray(menuArray)

  return menuArray
}

const convertToJson = (menuString: string) => {
  menuString = menuString.replace(/\s+/g, '')

  return `{${menuString.replace(
    /([a-zA-Z0-9-]+):([a-zA-Z0-9-]+)/g,
    '"$1":"$2"'
  )}}`
}

const replaceStyles = (menuStyle: Menu[]) => {
  menuStyle.forEach((i: Menu) => {
    if (i.styles) {
      i.styles = convertToJson(i.styles)
    }

    if (i.menu) {
      i.menu.forEach((j: Menu) => {
        if (j.styles) j.styles = convertToJson(j.styles)

        if (j.menu) {
          j.menu.forEach((t: Menu) => {
            if (t.styles) t.styles = convertToJson(t.styles)
          })
        }
      })
    }
  })
}

export const menus = async (_: unknown, __: unknown, ctx: Context) => {
  const {
    clients: { vbase },
  } = ctx

  let menuItems: Menu[] = []

  try {
    menuItems = await vbase.getJSON<Menu[]>('menu', 'menuItems')
  } catch (err) {
    const errStr = err.toString()

    // If there are no menus, it is initialized empty
    if (errStr === 'Error: Request failed with status code 404') {
      await vbase.saveJSON('menu', 'menuItems', [])
    } else {
      throw err
    }
  }

  replaceStyles(menuItems)

  return orderArray(menuItems)
}

export const menu = async (
  _: unknown,
  { id }: { id: string },
  ctx: Context
) => {
  const menusId = await ctx.clients.vbase.getJSON<Menu[]>('menu', 'menuItems')
  const response = menusId.filter((x: Menu) => x.id === id)

  return response[0]
}

export const createMenu = async (
  _: unknown,
  { menuInput }: Args,
  ctx: Context
) => {
  await requireAdminSession(ctx)

  const {
    clients: { vbase },
  } = ctx

  let menuItems: Menu[] = []

  try {
    menuItems = await vbase.getJSON<Menu[]>('menu', 'menuItems')
  } catch (err) {
    const errStr = err.toString()

    if (errStr !== 'Error: Request failed with status code 404') {
      throw err
    }
  }

  menuInput.order = menuItems.length + 1

  return vbase.saveJSON('menu', 'menuItems', [...menuItems, menuInput])
}

export const editMenu = async (
  _: unknown,
  { menuInput }: Args,
  ctx: Context
) => {
  await requireAdminSession(ctx)

  const {
    clients: { vbase },
  } = ctx

  const menuEdit = await vbase.getJSON<Menu[]>('menu', 'menuItems')
  let newArray = menuEdit.filter((x: Menu) => x.id !== menuInput.id)

  newArray.push(menuInput)

  newArray = orderArray(newArray)

  return vbase.saveJSON('menu', 'menuItems', newArray).then(() => newArray)
}

export const deleteMenu = async (
  _: unknown,
  { id, idSecond, idThird }: { id: string; idSecond: string; idThird: string },
  ctx: Context
) => {
  await requireAdminSession(ctx)

  const {
    clients: { vbase },
  } = ctx

  const menuDelete = await vbase.getJSON<Menu[]>('menu', 'menuItems')
  let deleteArray: Menu[] = []

  if (id && !idSecond && !idThird) {
    deleteArray = menuDelete.filter((x: Menu) => x.id !== id)
    const getMenuOrder = menuDelete.filter((x: Menu) => x.id === id)

    for (let i = 0; i < menuDelete.length; i++) {
      const valueOrder = menuDelete[i].order

      if (menuDelete[i].order > getMenuOrder[0].order) {
        menuDelete[i].order = valueOrder - 1
      }
    }
  } else if (id && idSecond && !idThird) {
    deleteArray = menuDelete.filter((x: Menu) => x.id === id)
    const tempSecondArray = deleteArray[0].menu.filter(
      (i: Menu) => i.id !== idSecond
    )

    const getMenuOrder = deleteArray[0].menu.filter(
      (x: Menu) => x.id === idSecond
    )

    for (let i = 0; i < tempSecondArray.length; i++) {
      const valueOrder = tempSecondArray[i].order

      if (tempSecondArray[i].order > getMenuOrder[0].order) {
        tempSecondArray[i].order = valueOrder - 1
      }
    }

    deleteArray[0].menu = tempSecondArray

    menuDelete.forEach((x: Menu) => {
      if (x.id === deleteArray[0].id) {
        x.menu = deleteArray[0].menu
      }
    })

    deleteArray = menuDelete
  } else {
    deleteArray = menuDelete.filter((x: Menu) => x.id === id)
    const tempSecondArray = deleteArray[0].menu.filter(
      (i: Menu) => i.id === idSecond
    )

    const tempThirdArray = tempSecondArray[0].menu.filter(
      (j: Menu) => j.id !== idThird
    )

    const getMenuOrder = tempSecondArray[0].menu.filter(
      (x: Menu) => x.id === idThird
    )

    for (let i = 0; i < tempThirdArray.length; i++) {
      const valueOrder = tempThirdArray[i].order

      if (tempThirdArray[i].order > getMenuOrder[0].order) {
        tempThirdArray[i].order = valueOrder - 1
      }
    }

    tempSecondArray[0].menu = tempThirdArray

    menuDelete.forEach((x: Menu) => {
      if (x.id === deleteArray[0].id) {
        x.menu.forEach((j: Menu) => {
          if (j.id === idSecond) {
            j.menu = tempSecondArray[0].menu
          }
        })
      }
    })

    deleteArray = menuDelete
  }

  return vbase
    .saveJSON('menu', 'menuItems', deleteArray)
    .then(() => deleteArray)
}

export const menuQueries = {
  menu,
  menus,
}

export const menuMutations = {
  createMenu,
  editMenu,
  deleteMenu,
}
