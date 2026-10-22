import type { FC } from 'react'
import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { Tabs, Tab, Layout, PageHeader, Alert } from 'vtex.styleguide'
import { useQuery } from 'react-apollo'

import FirsLevelContainer from './Category/FirstLevelContainer'
import SecondLevelContainer from './Category/SecondLevelContainer'
import ThirdLevelContainer from './Category/ThirdLevelContainer'
import GET_MENUS from './graphql/queries/getMenus.graphql'
import { DataMenuProvider } from './shared'
import type { DataMenu, DeleteArrayType } from './shared'

interface TypeDataItems {
  menus: DataMenu[]
}

const ConfigMenuContainer: FC = () => {
  const [currentTab, setCurrentTab] = useState(1)
  const { loading, data } = useQuery(GET_MENUS, {
    fetchPolicy: 'no-cache',
  })

  const typeArraData: DataMenu[] = []
  const typeDataItems: TypeDataItems = { menus: [] }
  const [alert, setAlert] = useState(false)
  const [message, setMessage] = useState('')
  const [dataMenuArray, setDataMenuArr] = useState(typeArraData)
  const [dataItems, setDataItems] = useState(typeDataItems)
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (!loading) setLoadingData(false)
    if (data) {
      setDataItems(data)
    }
  }, [data]) // eslint-disable-line react-hooks/exhaustive-deps

  const showAlert = useCallback(
    (show: boolean, messageAlert: string, newData: DeleteArrayType) => {
      if (newData) newData.deleteMenu
      setAlert(show)
      setMessage(messageAlert)
    },
    []
  )

  const updateData = useCallback((dataMenuArr: DataMenu[], type: string) => {
    if (type === 'search') setDataMenuArr(dataMenuArr)
    else setDataItems({ menus: dataMenuArr })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const dataMenuCtx = useMemo(
    () => ({
      dataMenu:
        dataMenuArray.length > 0 ? dataMenuArray : dataItems?.menus || [],
      showAlert,
      updateData,
      loading: loadingData,
    }),
    [dataItems, dataMenuArray, showAlert, updateData, loadingData]
  )

  return (
    <div>
      {!!alert && (
        <Alert type="success" onClose={() => setAlert(false)}>
          {message}
        </Alert>
      )}
      <DataMenuProvider value={dataMenuCtx}>
        <Layout
          pageHeader={<PageHeader title="Menus Configuration" />}
          fullWidth
        >
          <Tabs>
            <Tab
              label="First Level"
              active={currentTab === 1}
              onClick={() => setCurrentTab(1)}
            >
              <FirsLevelContainer />
            </Tab>
            <Tab
              label="Second Level"
              active={currentTab === 2}
              onClick={() => setCurrentTab(2)}
            >
              <SecondLevelContainer />
            </Tab>
            <Tab
              label="Third Level"
              active={currentTab === 3}
              onClick={() => setCurrentTab(3)}
            >
              <ThirdLevelContainer />
            </Tab>
          </Tabs>
        </Layout>
      </DataMenuProvider>
    </div>
  )
}

export default ConfigMenuContainer
