export type MenuItem = {
  id: string
  icon: string
  name: string
  slug: string
  styles: string
  binding?: string
  menu?: MenuItem[]
  display: boolean
  enableSty: boolean
  order?: number
  slugRoot?: string
  slugRelative?: string
}

export type MenuItemSave = {
  id: string
  icon: string
  name: string
  slug: string
  styles: string
  binding?: string
  menu?: MenuItem[] | string
  display: boolean
  enableSty: boolean
  order?: number
  slugRoot?: string
  slugRelative?: string
}

export type MenusResponse = {
  menus: MenuItem[]
}

export type DataMenu = MenuItem & {
  firstLevel?: string
  secondLevel?: string
}

export type DeleteArrayType = {
  deleteMenu: DataMenu[]
}

export type ShowAlertFunction = (
  show: boolean,
  messageAlert: string,
  newData: DeleteArrayType,
  type?: string
) => void

export type UpdateData = (data: DataMenu[], type: string) => void

export type ResponseFilterFunction = (filterArray: DataMenu[]) => void

export type BindingChangeFunction = (bindingId: string) => void

export type Orientation = 'vertical' | 'horizontal'
export interface GlobalConfig {
  title?: string
  orientation?: Orientation
  defaultDepartmentActive?: string
}

export interface IconProps {
  id: string
  size?: number
  isActive?: boolean
  viewBox?: string
  activeClassName?: string
  mutedClassName?: string
}
