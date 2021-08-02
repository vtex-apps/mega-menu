import type { FC } from 'react'
import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { Tabs, Tab, Layout, PageHeader, Alert } from 'vtex.styleguide'
import { useQuery } from 'react-apollo'
import type { InjectedIntlProps } from 'react-intl'
import { defineMessages, injectIntl } from 'react-intl'
import { formatIOMessage } from 'vtex.native-types'

import FirsLevelContainer from './Category/FirstLevelContainer'
import SecondLevelContainer from './Category/SecondLevelContainer'
import ThirdLevelContainer from './Category/ThirdLevelContainer'
import GET_MENUS from './graphql/queries/getMenus.graphql'
import { DataMenuProvider } from './shared'
import type { DataMenu, DeleteArrayType } from './shared'

interface TypeDataItems {
  menus: DataMenu[]
}

const messages = defineMessages({
  firstLevelTab: {
    defaultMessage: '',
    id: 'admin/mega-menu.tabs.first',
  },
  secondLevelTab: {
    defaultMessage: '',
    id: 'admin/mega-menu.tabs.second',
  },
  thirdLevelTab: {
    defaultMessage: '',
    id: 'admin/mega-menu.tabs.third',
  },
  titleApp: {
    defaultMessage: '',
    id: 'admin/mega-menu.items.titleApp',
  },
})

const ConfigMenuContainer: FC<InjectedIntlProps> = ({ intl }) => {
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

  const url = window.location.href.slice(-1)

  useEffect(() => {
    if (!loading) {
      setCurrentTab(parseInt(url, 10))
      setLoadingData(false)
    }

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

  const clearLocalStorage = () => {
    localStorage.removeItem('idFirstlvl')
    localStorage.removeItem('idSecondlvl')
    localStorage.removeItem('idFirstLevel')
  }

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
          pageHeader={
            <PageHeader
              title={formatIOMessage({
                id: messages.titleApp.id,
                intl,
              }).toString()}
            />
          }
          fullWidth
        >
          <Tabs>
            <Tab
              label={formatIOMessage({ id: messages.firstLevelTab.id, intl })}
              active={currentTab === 1}
              onClick={() => {
                setCurrentTab(1)
                clearLocalStorage()
              }}
            >
              <FirsLevelContainer />
            </Tab>
            <Tab
              label={formatIOMessage({ id: messages.secondLevelTab.id, intl })}
              active={currentTab === 2}
              onClick={() => {
                setCurrentTab(2)
                clearLocalStorage()
              }}
            >
              <SecondLevelContainer />
            </Tab>
            <Tab
              label={formatIOMessage({ id: messages.thirdLevelTab.id, intl })}
              active={currentTab === 3}
              onClick={() => {
                setCurrentTab(3)
                clearLocalStorage()
              }}
            >
              <ThirdLevelContainer />
            </Tab>
          </Tabs>
        </Layout>
      </DataMenuProvider>
    </div>
  )
}

export default injectIntl(ConfigMenuContainer)
