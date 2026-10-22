import { createContext, useContext } from 'react'

import type { DataMenu, ShowAlertFunction, UpdateData } from '..'

export interface DataMenuCtx {
  dataMenu: DataMenu[]
  showAlert: ShowAlertFunction
  updateData: UpdateData
}

const dataMenuDefault: DataMenuCtx = {
  dataMenu: [],
  showAlert: () => null,
  updateData: () => null,
}

export const DataMenuContext = createContext<DataMenuCtx>(dataMenuDefault)
export const DataMenuProvider = DataMenuContext.Provider
export const useDataMenu = () => useContext(DataMenuContext)
