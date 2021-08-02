import { createContext, useContext } from 'react'

import type { DataMenu, ShowAlertFunction, UpdateData } from '..'

export interface DataMenuCtx {
  dataMenu: DataMenu[]
  showAlert: ShowAlertFunction
  updateData: UpdateData
  loading: boolean
}

const dataMenuDefault: DataMenuCtx = {
  dataMenu: [],
  showAlert: () => null,
  updateData: () => null,
  loading: true,
}

export const DataMenuContext = createContext<DataMenuCtx>(dataMenuDefault)
export const DataMenuProvider = DataMenuContext.Provider
export const useDataMenu = () => useContext(DataMenuContext)
