/* eslint-disable vtex/prefer-early-return */
import type { FC } from 'react'
import React, { useState, useEffect } from 'react'
import type { InjectedIntlProps } from 'react-intl'
import { useQuery, useMutation } from 'react-apollo'
import { injectIntl } from 'react-intl'
import { ButtonWithIcon } from 'vtex.styleguide'
import { ExportToCsv } from 'export-to-csv'
import CSVReader from 'react-csv-reader'
import { formatIOMessage } from 'vtex.native-types'

import IconDownload from '../icons/IconDownload'
import IconUpload from '../icons/IconUpload'
import { MessagesBackupData } from '../shared'
import type {
  MenusResponse,
  MenuItemSave,
  MenuItem,
  ShowAlertFunction,
  DataMenu,
} from '../shared'
import GET_MENUS from '../graphql/queries/getMenus.graphql'
import UPLOAD from '../graphql/mutations/uploadData.graphql'
import styles from './category.css'

interface PropsCategory {
  setDataItems: (dataItems: { menus: DataMenu[] }) => void
  showAlert: ShowAlertFunction
  dataMenu: {
    menus: MenuItem[]
  }
}

const CategoryContainer: FC<InjectedIntlProps & PropsCategory> = (props) => {
  const options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: false,
    showTitle: false,
    useTextFile: false,
    useBom: false,
    useKeysAsHeaders: false,
  }

  const [showButtonDownload, setShowButtonDownload] = useState(true)

  const { data, refetch } = useQuery<MenusResponse>(GET_MENUS, {
    fetchPolicy: 'no-cache',
  })

  const [uploadData, { data: dataSaved }] = useMutation(UPLOAD, {
    fetchPolicy: 'no-cache',
  })

  if (props.dataMenu.menus) {
    if (!props.dataMenu.menus.length && showButtonDownload) {
      setShowButtonDownload(false)
    }
  }

  useEffect(() => {
    if (data?.menus.length) setShowButtonDownload(true)
    else setShowButtonDownload(false)
  }, [data])

  useEffect(() => {
    // eslint-disable-next-line vtex/prefer-early-return
    if (dataSaved) {
      props.setDataItems({ menus: dataSaved.uploadMenu })
      setShowButtonDownload(true)
      props.showAlert(
        true,
        formatIOMessage({
          id: MessagesBackupData.uploadAlert.id,
          intl: props.intl,
        }).toString(),
        { deleteMenu: [] }
      )
      window.location.reload()
    }
  }, [dataSaved]) // eslint-disable-line react-hooks/exhaustive-deps

  const downloadData = () => {
    refetch()
    if (data?.menus.length) {
      setShowButtonDownload(true)
      const dataToSave: MenuItemSave[] = [...data.menus]

      dataToSave.forEach((item) => {
        if (item.menu?.length) {
          item.menu = JSON.stringify(item.menu)
        }

        if (item.styles !== '') {
          item.styles = item.styles.replace(/[{}"]/g, '')
        }
      })

      const csvExporter = new ExportToCsv(options)

      csvExporter.generateCsv(dataToSave)
    } else {
      setShowButtonDownload(false)
    }
  }

  return (
    <div className="flex">
      <div className="mr3">
        {showButtonDownload && (
          <div className={styles.tooltipDownload}>
            <ButtonWithIcon
              icon={<IconDownload />}
              variation="secondary"
              onClick={() => downloadData()}
            >
              <span className={styles.tooltiptext}>
                {formatIOMessage({
                  id: MessagesBackupData.download.id,
                  intl: props.intl,
                }).toString()}
              </span>
            </ButtonWithIcon>
          </div>
        )}
      </div>
      <div>
        <CSVReader
          accept=".csv, text/csv"
          inputStyle={{ display: 'none' }}
          onFileLoaded={(dataCsv) => {
            let allowSave = true

            if (dataCsv.length) {
              const DataUpload: DataMenu[] = []

              dataCsv.forEach((x) => {
                if (x.length > 1) {
                  const findInData = props.dataMenu.menus.filter(
                    (item) => item.id === x[0]
                  )

                  if (findInData.length <= 0) {
                    DataUpload.push({
                      id: x[0],
                      name: x[1],
                      icon: x[2],
                      slug: x[3],
                      styles: x[4],
                      display: x[5] === 'TRUE',
                      enableSty: x[6] === 'TRUE',
                      order: parseInt(x[7], 10),
                      menu: x[10] === '' ? [] : JSON.parse(x[10]),
                    })
                  } else {
                    allowSave = false
                    props.showAlert(
                      true,
                      formatIOMessage({
                        id: MessagesBackupData.duplicateData.id,
                        intl: props.intl,
                      }).toString(),
                      { deleteMenu: [] },
                      'warning'
                    )
                  }
                }
              })
              if (allowSave) {
                uploadData({
                  variables: {
                    uploadData: DataUpload,
                  },
                })
                refetch()
              }
            }

            // eslint-disable-next-line prettier/prettier
            ;(
              document.getElementById(
                'react-csv-reader-input'
              ) as HTMLInputElement
            ).value = ''
          }}
        />
        {!showButtonDownload ? (
          <div className={styles.tooltipDownload} id={styles.upload}>
            <ButtonWithIcon
              icon={<IconUpload />}
              variation="secondary"
              onClick={() => {
                document.getElementById('react-csv-reader-input')?.click()
              }}
            >
              <span className={styles.tooltiptext}>
                {formatIOMessage({
                  id: MessagesBackupData.upload.id,
                  intl: props.intl,
                }).toString()}
              </span>
            </ButtonWithIcon>
          </div>
        ) : (
          <div />
        )}
      </div>
    </div>
  )
}

export default injectIntl(CategoryContainer)
