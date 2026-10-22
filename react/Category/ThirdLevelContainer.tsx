import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import { Card, Dropdown } from 'vtex.styleguide'

import type { DataMenu } from '../shared'
import { useDataMenu } from '../shared'
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

const ThirdLevelContainer: FC = () => {
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

          setThirdLevel(tempDelete[0].menu ? tempDelete[0].menu : [])
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
    const getSubMenu = data.filter((x: DataMenu) => x.name === idName)

    setDataMainMenu(data)

    const tempArray: TempArrayType[] = []

    if (getSubMenu[0].menu) {
      getSubMenu[0].menu.forEach((x: DataMenu) => {
        const bodyLevel = {
          value: x.name,
          label: x.name,
          id: x.id,
          menu: x.menu,
        }

        tempArray.push(bodyLevel)
      })
    }

    return tempArray
  }

  const onChangeLevel1 = (menu: { target: HTMLInputElement }) => {
    setLevel1(menu.target.value)

    const idFirstLevel = firstLevel.find(
      (x: TypeLevel) => x.value === menu.target.value
    )

    setIdFirstlvl(idFirstLevel ? idFirstLevel.id : '')
    setSecondLevel(getValueMenu(dataMenus, menu.target.value))
  }

  const onChangeLevel2 = (submenu: { target: HTMLInputElement }) => {
    let arraySL: DataMenu[] = []

    setLevel2(submenu.target.value)
    const idSecondLevel = secondLevel.find(
      (x: TypeLevel) => x.value === submenu.target.value
    )

    const arrayFL = dataMenus.filter((x: DataMenu) => x.name === level1)

    setIdSecondlvl(idSecondLevel ? idSecondLevel.id : '')
    if (arrayFL[0].menu) {
      arraySL = arrayFL[0].menu.filter(
        (i: DataMenu) => i.name === submenu.target.value
      )
    }

    if (arraySL[0].menu) {
      arraySL[0].menu.forEach((i: DataMenu) => {
        i.firstLevel = idFirstlvl
        i.secondLevel = idSecondlvl
      })
      setThirdLevel(arraySL[0].menu)
    } else {
      setThirdLevel([])
    }
  }

  const responseFilter = (filterArray: DataMenu[]) => {
    setdataMenuFilter(filterArray)
  }

  return (
    <div className="mt8">
      <div className="flex">
        <div className="mr5 w-50">
          <Card>
            <div className="mb5 pr4 pl4">
              <Dropdown
                label="Choose a menu of first level"
                options={firstLevel}
                value={level1}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  onChangeLevel1(e)
                }}
              />
            </div>
          </Card>
        </div>
        <div className="ml5 w-50">
          <Card>
            <div className="mb5 pr4 pl4">
              <Dropdown
                label="Choose a menu of second level"
                options={secondLevel}
                value={level2}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  onChangeLevel2(e)
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
                  placeholder="Search submenu third level"
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
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ThirdLevelContainer
