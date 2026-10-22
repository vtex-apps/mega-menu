import type { Dispatch, SetStateAction } from 'react'
import { createContext, useContext } from 'react'

import type { GlobalConfig, MenuItem } from '../types'

export interface MegaMenuCtx {
  config: GlobalConfig
  departments: MenuItem[]
  departmentActive: MenuItem | null
  getCategories: (departmentId?: string) => MenuItem[]
  setDepartmentActive: Dispatch<SetStateAction<MenuItem | null>>
}

export const megaMenuCtxDefault: MegaMenuCtx = {
  config: {},
  departments: [],
  departmentActive: null,
  getCategories: () => [],
  setDepartmentActive: () => null,
}

export const MegaMenuContext = createContext<MegaMenuCtx>(megaMenuCtxDefault)
export const MegaMenuProvider = MegaMenuContext.Provider
export const useMegaMenu = () => useContext(MegaMenuContext)
