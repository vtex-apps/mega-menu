import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import { Card, Dropdown } from 'vtex.styleguide'
import type { InjectedIntlProps } from 'react-intl'
import { injectIntl } from 'react-intl'
import { formatIOMessage } from 'vtex.native-types'

import type { DataMenu } from '../shared'
import { useDataMenu, messageThirdLevel } from '../shared'
import NewButtonComponent from './Components/NewButtonComponent'
import SearchComponent from './Components/SearchComponent'
import TableComponent from './Components/TableComponent'

interface TempArrayType {
  id: string
  label: string
  menu?: DataMenu[]
  value: string
}

interface TypeLevel {
  value: string
  label: string
  id: string
}

const messages = messageThirdLevel

const ThirdLevelContainer: FC<InjectedIntlProps> = ({ intl }) => {
  const { dataMenu, showAlert, updateData, loading } = useDataMenu()

  const [level1, setLevel1] = useState('')
  const [level2, setLevel2] = useState('')
  const [idFirstlvl, setIdFirstlvl] = useState('')
  const [idSecondlvl, setIdSecondlvl] = useState('')
  const [secondLevel, setSecondLevel] = useState<TempArrayType[]>([])
  const [thirdLevel, setThirdLevel] = useState<DataMenu[]>([])
  const [dataMenuFilter, setdataMenuFilter] = useState<DataMenu[]>([])
  const [dataMainMenu, setDataMainMenu] = useState<DataMenu[]>([])
  let dataMenus: DataMenu[] = []

  dataMenus = dataMenu
  const firstLevel: TypeLevel[] = []

  useEffect(() => {
    if (!thirdLevel.length) return

    dataMenus.forEach((i: DataMenu) => {
      if (i.id === idFirstlvl) {
        if (i.menu) {
          const tempDelete = i.menu.filter(
            (j: DataMenu) => j.id === idSecondlvl
          )

          if (tempDelete.length) {
            setThirdLevel(tempDelete[0].menu ? tempDelete[0].menu : [])
          }
        }
      }
    })
  }, [dataMenus]) // eslint-disable-line react-hooks/exhaustive-deps

  if (dataMenus) {
    dataMenus.forEach((menuValue: DataMenu) => {
      const bodyLevel1 = {
        value: menuValue.name,
        label: menuValue.name,
        id: menuValue.id,
      }

      firstLevel.push(bodyLevel1)
    })
  }

  const getValueMenu = (data: DataMenu[], idName: string) => {
    const getSubMenu = data.filter(
      (subMenuItem: DataMenu) => subMenuItem.name === idName
    )

    setDataMainMenu(data)

    const tempArray: TempArrayType[] = []

    if (getSubMenu[0].menu) {
      getSubMenu[0].menu.forEach((menuItem: DataMenu) => {
        const bodyLevel = {
          value: menuItem.name,
          label: menuItem.name,
          id: menuItem.id,
          menu: menuItem.menu,
        }

        tempArray.push(bodyLevel)
      })
    }

    return tempArray
  }

  const onChangeLevel1 = (menu: string) => {
    setLevel1(menu)
    setThirdLevel([])
    setLevel2('')
    localStorage.setItem('idFirstlvl', menu)

    const idFirstLevel = firstLevel.find(
      (firstMenu: TypeLevel) => firstMenu.value === menu
    )

    if (idFirstLevel) {
      setIdFirstlvl(idFirstLevel.id)
      localStorage.setItem('idlvl1', idFirstLevel.id)
      setIdSecondlvl('')
    }

    setSecondLevel(getValueMenu(dataMenus, menu))
  }

  const onChangeLevel2 = (submenu: string) => {
    let arraySL: DataMenu[] = []

    setThirdLevel([])

    localStorage.setItem('idSecondlvl', submenu)

    setLevel2(submenu)

    const idSecondLevel = secondLevel.find(
      (menuSecond: TypeLevel) => menuSecond.value === submenu
    )

    const arrayFL = dataMenus.filter(
      (flMenu: DataMenu) =>
        flMenu.name === (level1 || localStorage.getItem('idFirstlvl'))
    )

    if (idSecondLevel) {
      localStorage.setItem('idlvl2', idSecondLevel.id)
      setIdSecondlvl(idSecondLevel.id)
    } else if (localStorage.getItem('idlvl2')) {
      setIdSecondlvl(localStorage.getItem('idlvl2') ?? '')
    }

    if (arrayFL[0].menu) {
      arraySL = arrayFL[0].menu.filter((i: DataMenu) => i.name === submenu)
    }

    if (arraySL[0]) {
      if (arraySL[0].menu) {
        arraySL[0].menu.forEach((i: DataMenu) => {
          i.firstLevel = idFirstlvl
          i.secondLevel = idSecondlvl
        })
        setThirdLevel(arraySL[0].menu)
      }
    } else {
      setThirdLevel([])
    }
  }

  const responseFilter = (filterArray: DataMenu[]) => {
    setdataMenuFilter(filterArray)
  }

  if (!level1 && !level2) {
    const idFirstLocal = localStorage.getItem('idFirstlvl')
    const idSecondLocal = localStorage.getItem('idSecondlvl')

    if (idFirstLocal && idSecondLocal) {
      onChangeLevel1(idFirstLocal)
      onChangeLevel2(idSecondLocal)
    }
  }

  const secondSearch = formatIOMessage({
    id: messages.thirdSearch.id,
    intl,
  }).toString()

  const titleBtnNew = formatIOMessage({
    id: messages.newButton.id,
    intl,
  }).toString()

  return (
    <div className="mt8">
      <div className="flex">
        <div className="mr5 w-50">
          <Card>
            <div className="mb5 pr4 pl4">
              <Dropdown
                label={formatIOMessage({
                  id: messages.dropdownSecondLevel.id,
                  intl,
                })}
                options={firstLevel}
                value={level1}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  onChangeLevel1(e.target.value)
                }}
              />
            </div>
          </Card>
        </div>
        <div className="ml5 w-50">
          <Card>
            <div className="mb5 pr4 pl4">
              <Dropdown
                label={formatIOMessage({
                  id: messages.dropDownThird.id,
                  intl,
                })}
                options={secondLevel}
                value={level2}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  onChangeLevel2(e.target.value)
                }}
              />
            </div>
          </Card>
        </div>
      </div>
      <div className="mt5">
        <Card>
          <div className="containerTableCat">
            <div className="flex">
              <div className="w-60 mr12">
                <SearchComponent
                  placeholder={secondSearch}
                  dataItems={thirdLevel}
                  responseFilter={responseFilter}
                />
              </div>
              <div className="w-40 ml10">
                <NewButtonComponent
                  obj={{
                    level: 'thirdLevel',
                    id: idFirstlvl,
                    secondLevel: idSecondlvl,
                    namebutton: titleBtnNew,
                  }}
                />
              </div>
            </div>
            <div>
              <TableComponent
                dataMenu={
                  dataMenuFilter.length === 0 ? thirdLevel : dataMenuFilter
                }
                level="thirdLevel"
                showAlert={showAlert}
                updateData={updateData}
                idLevels={{ idFirstlvl, idSecondlvl }}
                mainData={dataMainMenu}
                loading={loading}
                titleColumn={{
                  name: formatIOMessage({
                    id: messages.firstColumn.id,
                    intl,
                  }).toString(),
                  slug: formatIOMessage({
                    id: messages.secondColumn.id,
                    intl,
                  }).toString(),
                  icon: formatIOMessage({
                    id: messages.thirdColumn.id,
                    intl,
                  }).toString(),
                  action: formatIOMessage({
                    id: messages.fourColumn.id,
                    intl,
                  }).toString(),
                  visibility: formatIOMessage({
                    id: messages.fiveColumn.id,
                    intl,
                  }).toString(),
                  emptyTitle: formatIOMessage({
                    id: messages.emptyTitle.id,
                    intl,
                  }).toString(),
                  empty: formatIOMessage({
                    id: messages.empty.id,
                    intl,
                  }).toString(),
                  modalTitle: formatIOMessage({
                    id: messages.titleModal.id,
                    intl,
                  }).toString(),
                  modalBody: formatIOMessage({
                    id: messages.bodyModal.id,
                    intl,
                  }).toString(),
                  cancel: formatIOMessage({
                    id: messages.btnCancelModal.id,
                    intl,
                  }).toString(),
                  confirm: formatIOMessage({
                    id: messages.btnRemoveModal.id,
                    intl,
                  }).toString(),
                  loading: formatIOMessage({
                    id: messages.loading.id,
                    intl,
                  }).toString(),
                  deleteConfirm: formatIOMessage({
                    id: messages.deleteItem.id,
                    intl,
                  }).toString(),
                }}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default injectIntl(ThirdLevelContainer)
