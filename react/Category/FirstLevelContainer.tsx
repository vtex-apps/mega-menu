import type { FC } from 'react'
import React, { useState } from 'react'
import { Card } from 'vtex.styleguide'

import type { DataMenu } from '../shared'
import { useDataMenu } from '../shared'
import NewButtonComponent from './Components/NewButtonComponent'
import SearchComponent from './Components/SearchComponent'
import TableComponent from './Components/TableComponent'

const FirsLevelContainer: FC = () => {
  const { dataMenu, showAlert, updateData } = useDataMenu()
  const [dataMenuFilter, setDataMenuFilter] = useState<DataMenu[]>(dataMenu)

  const responseFilter = (filterArray: DataMenu[]) => {
    setDataMenuFilter(dataMenu)
    updateData(filterArray, 'search')
  }

  return (
    <div className="mt8">
      <div>
        <Card>
          <div className="containerTableCat">
            <div className="flex">
              <div className="w-60 mr12">
                <SearchComponent
                  placeholder="Search menu"
                  dataItems={dataMenuFilter}
                  responseFilter={responseFilter}
                />
              </div>
              <div className="w-40 ml10">
                <NewButtonComponent obj={{ level: 'firstLevel' }} />
              </div>
            </div>
            <div>
              <TableComponent
                dataMenu={dataMenu}
                level="firstLevel"
                showAlert={showAlert}
                updateData={updateData}
                mainData={[]}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default FirsLevelContainer
