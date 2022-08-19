export interface Menu {
  id: string
  name: string
  icon: string
  slug: string
  styles: string
  menu: Menu[]
  display: boolean
  enableSty: boolean
  order: number
  slugRoot?: string
  slugRelative?: string
  mobile?: boolean
  desktop?: boolean
}

export interface Settings {
  idMenu: string
  orientation: string
}

interface Args {
  menuInput: Menu
}
interface ArgsUpload {
  menuData: [Menu]
}
interface ArgsSettings {
  settingsInput: Settings
}

export type Maybe<T> = T | void
