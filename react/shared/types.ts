export type MenuItem = {
  id: string
  icon: string
  name: string
  slug: string
  styles: string
  menu?: MenuItem[]
  display: boolean
  enableSty: boolean
  order?: number
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
  newData: DeleteArrayType
) => void

export type UpdateData = (data: DataMenu[], type: string) => void

export type ResponseFilterFunction = (filterArray: DataMenu[]) => void

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
