import type { FC } from 'react'
import React, { useState, useEffect } from 'react'
import { Card } from 'vtex.styleguide'
import type { InjectedIntlProps } from 'react-intl'
import { injectIntl } from 'react-intl'
import { formatIOMessage } from 'vtex.native-types'

import type { DataMenu } from '../shared'
import { useDataMenu, messagesFirstLevel } from '../shared'
import NewButtonComponent from './Components/NewButtonComponent'
import SearchComponent from './Components/SearchComponent'
import TableComponent from './Components/TableComponent'
import BindingSelectorComponent from './Components/BindingSelectorComponent'

const messages = messagesFirstLevel

const FirsLevelContainer: FC<InjectedIntlProps> = ({ intl }) => {
  const { dataMenu, showAlert, updateData, loading } = useDataMenu()

  const [dataMenuFilter, setDataMenuFilter] = useState<DataMenu[]>(dataMenu)

  const [selectedBinding, setSelectedBinding] = useState('all')

  const responseFilter = (filterArray: DataMenu[]) => {
    setDataMenuFilter(filterArray)
  }

  useEffect(() => {
    if (!dataMenu.length) return
    setDataMenuFilter(dataMenu)
  }, [dataMenu])

  useEffect(() => {
    const filteredMenuItems = dataMenu.filter(
      (item) => selectedBinding === 'all' || item.binding === selectedBinding
    )

    setDataMenuFilter(filteredMenuItems)
  }, [selectedBinding]) // eslint-disable-line react-hooks/exhaustive-deps

  const placeholderTitle = formatIOMessage({
    id: messages.firstLevelTab.id,
    intl,
  }).toString()

  const titleBtnNew = formatIOMessage({
    id: messages.newButton.id,
    intl,
  }).toString()

  return (
    <div className="mt8">
      <div>
        <Card>
          <div className="mb5">
            <BindingSelectorComponent
              selectedBinding={selectedBinding}
              onBindingChange={setSelectedBinding}
            />
          </div>
          <div className="containerTableCat">
            <div className="flex">
              <div className="w-60 mr12">
                <SearchComponent
                  placeholder={placeholderTitle}
                  dataItems={dataMenu}
                  responseFilter={responseFilter}
                />
              </div>
              <div className="w-40 ml10">
                <NewButtonComponent
                  obj={{ level: 'firstLevel', namebutton: titleBtnNew }}
                />
              </div>
            </div>
            <div>
              <TableComponent
                dataMenu={dataMenuFilter}
                level="firstLevel"
                showAlert={showAlert}
                updateData={updateData}
                mainData={[]}
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

export default injectIntl(FirsLevelContainer)
