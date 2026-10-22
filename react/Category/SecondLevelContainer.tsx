import type { FC } from 'react'
import React, { useState, useEffect } from 'react'
import { Card, Dropdown } from 'vtex.styleguide'

import TableComponent from './Components/TableComponent'
import NewButtonComponent from './Components/NewButtonComponent'
import SearchComponent from './Components/SearchComponent'
import type { DataMenu } from '../shared'
import { useDataMenu } from '../shared'

interface OptionsBody {
  value: string
  label: string
  id: string
}

const SecondLevelContainer: FC = () => {
  const { dataMenu, showAlert, updateData } = useDataMenu()

  const [dataMenuSel, setDataMenuSel] = useState<DataMenu[]>([])
  const [dataMenuFilter, setdataMenuFilter] = useState<DataMenu[]>([])
  const [dataMainMenu, setDataMainMenu] = useState<DataMenu[]>([])
  const [idFirstLevel, setidFirstLevel] = useState('')
  const [dataOptions, setdataOptions] = useState('')

  const dataMenus = dataMenu
  const options: OptionsBody[] = []
  const tempDelete: DataMenu[] = []

  const compareItems = dataMenus.filter((x: DataMenu) => x.id === idFirstLevel)

  if (dataMenuSel.length > 0) {
    if (JSON.stringify(compareItems[0].menu) !== JSON.stringify(dataMenuSel)) {
      setDataMenuSel([])
    }
  }

  useEffect(() => {
    if (!dataMenuSel.length) return

    dataMenuSel.forEach((i: DataMenu) => {
      if (dataMenus[0].menu) {
        dataMenus[0].menu.forEach((j: DataMenu) => {
          if (i.id === j.id) {
            tempDelete.push(i)
          }
        })
      }
    })

    setDataMenuSel(tempDelete)
  }, [dataMenus]) // eslint-disable-line react-hooks/exhaustive-deps

  if (dataMenus) {
    dataMenus.forEach((cat: DataMenu) => {
      const body = { value: cat.name, label: cat.name, id: cat.id }

      options.push(body)
    })
  }

  const onChangeDropdown = (menu: { target: HTMLInputElement }) => {
    setdataOptions(menu.target.value)

    const getSubMenu = dataMenus.filter(
      (x: DataMenu) => x.name === menu.target.value
    )

    setDataMainMenu(getSubMenu)

    setidFirstLevel(getSubMenu[0].id)
    if (getSubMenu[0].menu) {
      getSubMenu[0].menu.map((m: DataMenu) => (m.firstLevel = getSubMenu[0].id))
      setDataMenuSel(getSubMenu[0].menu)
    } else {
      setDataMenuSel([])
    }
  }

  if (idFirstLevel && dataMenuSel.length === 0) {
    const secondData = dataMenus.filter((x: DataMenu) => x.id === idFirstLevel)
    const responseData = secondData[0].menu ? secondData[0].menu : []

    if (responseData.length > 0) {
      setDataMenuSel(responseData)
    }
  }

  const responseFilter = (filterArray: DataMenu[]) => {
    setdataMenuFilter(filterArray)
  }

  return (
    <div className="mt8">
      <Card>
        <div className="mb5">
          <Dropdown
            label="Choose a menu of first level"
            options={options}
            value={dataOptions}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              onChangeDropdown(e)
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
                  placeholder="Search submenu second level"
                  dataItems={dataMenuSel}
                  responseFilter={responseFilter}
                />
              </div>
              <div className="w-40 ml10">
                <NewButtonComponent
                  obj={{ level: 'secondLevel', id: idFirstLevel }}
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
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default SecondLevelContainer
