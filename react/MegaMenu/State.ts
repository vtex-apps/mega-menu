import { makeAutoObservable } from 'mobx'

import type { DataMenu, GlobalConfig, MenuItem } from '../shared'

type ChangeOpenMenu = boolean | ((isOpen: boolean) => boolean)

class MegaMenuState {
  public config: GlobalConfig = {}
  public departments: MenuItem[] = []
  public departmentActive: MenuItem | null = null
  public isOpenMenu = false

  constructor() {
    makeAutoObservable(this)
  }

  public setConfig = (config: GlobalConfig) => {
    this.config = config
  }

  public setDepartments = (departments: MenuItem[]) => {
    this.departments = departments
  }

  public setDepartmentActive = (department: MenuItem | null) => {
    this.departmentActive = department
  }

  public openMenu = (value: ChangeOpenMenu = true) => {
    if (typeof value === 'boolean') {
      this.isOpenMenu = value
    } else {
      this.isOpenMenu = value(this.isOpenMenu)
    }
  }

  public getCategories = (departmentId?: string) => {
    let categories: DataMenu[] = []
    let department: DataMenu | null | undefined

    if (departmentId) {
      department = this.departments.find((x) => x.id === departmentId)
    } else {
      department = this.departmentActive
    }

    if (department?.menu?.length) {
      categories = department.menu
    }

    return categories
  }
}

export const megaMenuState = new MegaMenuState()
