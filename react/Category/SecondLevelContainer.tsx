import type { FC } from 'react'
import React, { useState, useEffect } from 'react'
import { Card, Dropdown } from 'vtex.styleguide'
import type { InjectedIntlProps } from 'react-intl'
import { injectIntl } from 'react-intl'
import { formatIOMessage } from 'vtex.native-types'

import TableComponent from './Components/TableComponent'
import NewButtonComponent from './Components/NewButtonComponent'
import SearchComponent from './Components/SearchComponent'
import type { DataMenu } from '../shared'
import { useDataMenu, messageSecondLevel } from '../shared'

interface OptionsBody {
  value: string
  label: string
  id: string
}

const messages = messageSecondLevel

const SecondLevelContainer: FC<InjectedIntlProps> = ({ intl }) => {
  const { dataMenu, showAlert, updateData, loading } = useDataMenu()

  const [dataMenuSel, setDataMenuSel] = useState<DataMenu[]>([])
  const [dataMenuFilter, setdataMenuFilter] = useState<DataMenu[]>([])
  const [dataMainMenu, setDataMainMenu] = useState<DataMenu[]>([])
  const [idFirstLevel, setidFirstLevel] = useState('')
  const [dataOptions, setdataOptions] = useState('')

  const dataMenus = dataMenu
  const options: OptionsBody[] = []
  const tempDelete: DataMenu[] = []

  const onChangeDropdown = (menu: string) => {
    setdataOptions(menu)

    const getSubMenu = dataMenus.filter(
      (secondMenu: DataMenu) => secondMenu.name === menu
    )

    localStorage.setItem('idFirstLevel', getSubMenu[0].id)

    setDataMainMenu(getSubMenu)

    setidFirstLevel(getSubMenu[0].id)
    if (getSubMenu[0].menu) {
      getSubMenu[0].menu.map((m: DataMenu) => (m.firstLevel = getSubMenu[0].id))
      setDataMenuSel(getSubMenu[0].menu)
    } else {
      setDataMenuSel([])
    }
  }

  if (!idFirstLevel && localStorage.getItem('idFirstLevel')) {
    const valueIdTemp = localStorage.getItem('idFirstLevel')

    if (valueIdTemp) {
      const secondLevelLocal = dataMenus.filter(
        (dm: DataMenu) => dm.id === valueIdTemp
      )

      if (secondLevelLocal[0]) onChangeDropdown(secondLevelLocal[0].name)
    }
  }

  const compareItems = dataMenus.filter(
    (item: DataMenu) => item.id === idFirstLevel
  )

  if (dataMenuSel.length > 0) {
    if (JSON.stringify(compareItems[0].menu) !== JSON.stringify(dataMenuSel)) {
      setDataMenuSel([])
    }
  }

  useEffect(() => {
    if (!dataMenuSel.length) return

    dataMenuSel.forEach((i: DataMenu) => {
      const firstDataMenu = dataMenus[0].menu

      if (!firstDataMenu) {
        return
      }

      firstDataMenu.forEach((j: DataMenu) => {
        if (i.id === j.id) {
          tempDelete.push(i)
        }
      })
    })

    setDataMenuSel(tempDelete)
  }, [dataMenus]) // eslint-disable-line react-hooks/exhaustive-deps

  if (dataMenus) {
    dataMenus.forEach((cat: DataMenu) => {
      const body = { value: cat.name, label: cat.name, id: cat.id }

      options.push(body)
    })
  }

  if (idFirstLevel && dataMenuSel.length === 0) {
    const secondData = dataMenus.filter(
      (secondItem: DataMenu) => secondItem.id === idFirstLevel
    )

    const responseData = secondData[0].menu ? secondData[0].menu : []

    if (responseData.length > 0) {
      setDataMenuSel(responseData)
    }
  }

  const responseFilter = (filterArray: DataMenu[]) => {
    setdataMenuFilter(filterArray)
  }

  const secondSearch = formatIOMessage({
    id: messages.secondSearch.id,
    intl,
  }).toString()

  const titleBtnNew = formatIOMessage({
    id: messages.newButton.id,
    intl,
  }).toString()

  return (
    <div className="mt8">
      <Card>
        <div className="mb5">
          <Dropdown
            label={formatIOMessage({
              id: messages.dropdownSecondLevel.id,
              intl,
            })}
            options={options}
            value={dataOptions}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              onChangeDropdown(e.target.value)
            }}
          />
        </div>
      </Card>
      <div className="mt5">
        <Card>
          <div className="containerTableCat">
            <div className="flex">
              <div className="w-60 mr12">
                <SearchComponent
                  placeholder={secondSearch}
                  dataItems={dataMenuSel}
                  responseFilter={responseFilter}
                />
              </div>
              <div className="w-40 ml10">
                <NewButtonComponent
                  obj={{
                    level: 'secondLevel',
                    id: idFirstLevel,
                    namebutton: titleBtnNew,
                  }}
                />
              </div>
            </div>
            <div>
              <TableComponent
                dataMenu={
                  dataMenuFilter.length === 0 ? dataMenuSel : dataMenuFilter
                }
                level="secondLevel"
                showAlert={showAlert}
                updateData={updateData}
                idLevels={{ idFirstlvl: idFirstLevel }}
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

export default injectIntl(SecondLevelContainer)
