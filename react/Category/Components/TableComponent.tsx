/* eslint-disable prettier/prettier */
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import {
  Table,
  ButtonWithIcon,
  Spinner,
  ModalDialog,
  EmptyState,
} from 'vtex.styleguide'
import { useMutation } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'
import {
  FaMobileAlt,
  FaDesktop,
  FaEye,
  FaEyeSlash,
  FaCode,
} from 'react-icons/fa'

import IconEdit from '../../icons/IconEdit'
import IconDelete from '../../icons/IconDelete'
import IconUp from '../../icons/IconUp'
import IconDown from '../../icons/IconDown'
import DELETE from '../../graphql/mutations/delete.graphql'
import EDIT from '../../graphql/mutations/edit.graphql'
import type {
  DataMenu,
  MenuItem,
  ShowAlertFunction,
  UpdateData,
} from '../../shared'

interface TableComponentProps {
  dataMenu: DataMenu[]
  level: string
  showAlert: ShowAlertFunction
  updateData: UpdateData
  idLevels?: {
    idFirstlvl?: string
    idSecondlvl?: string
  }
  mainData: DataMenu[]
  loading: boolean
  titleColumn: {
    name: string
    slug: string
    icon: string
    action: string
    visibility: string
    emptyTitle: string
    empty: string
    modalTitle: string
    modalBody: string
    cancel: string
    confirm: string
    loading: string
    deleteConfirm: string
  }
}

interface TableItem {
  cellData: unknown
  rowData: DataMenu
  updateCellMeasurements: () => void
}

interface BodyProps {
  id: string
  level: string
  type: string
  firstLevel?: string | null
  secondLevel?: string | null
}

const defaultcontent = {
  id: '',
  name: '',
  icon: '',
  slug: '',
  styles: '',
  menu: [],
  display: false,
  enableSty: false,
  order: 0,
}

const TableComponent: FC<TableComponentProps> = (props) => {
  const [dataChangeItem, setDataChangeItem] = useState<MenuItem>(defaultcontent)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [menuDelete, setMenuDelete] = useState<MenuItem>(defaultcontent)

  const [deleteMenu, { data: dataDelete }] = useMutation(DELETE, {
    fetchPolicy: 'no-cache',
  })

  const { navigate } = useRuntime()
  const [menuInput, { data: dataEdit }] = useMutation(EDIT, {
    fetchPolicy: 'no-cache',
  })

  useEffect(() => {
    if (dataEdit) {
      if (dataChangeItem.id) {
        menuInput({
          variables: {
            editMenu: {
              id: dataChangeItem.id,
              name: dataChangeItem.name,
              icon: dataChangeItem.icon,
              slug: dataChangeItem.slug,
              styles: dataChangeItem.styles,
              menu: dataChangeItem.menu,
              display: dataChangeItem.display,
              enableSty: dataChangeItem.enableSty,
              order: dataChangeItem.order,
              mobile: dataChangeItem.mobile ?? true,
              desktop: dataChangeItem.desktop ?? true,
            },
          },
        })
        setDataChangeItem(defaultcontent)
      } else {
        props.updateData(dataEdit.editMenu, 'move')
      }
    }
  }, [dataEdit]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!dataDelete) return

    setIsModalOpen(false)
    props.showAlert(true, props.titleColumn.deleteConfirm, dataDelete)
    window.scrollTo(0, 0)
    setTimeout(() => {
      props.showAlert(false, '', dataDelete)
    }, 4000)
    props.updateData(dataDelete.deleteMenu, 'delete')
  }, [dataDelete]) // eslint-disable-line react-hooks/exhaustive-deps

  const editItem = (item: TableItem) => {
    const localId = localStorage.getItem('idlvl2')

    const localIdFirst = localStorage.getItem('idlvl1')

    let bodyContext: BodyProps

    if (props.level === 'firstLevel') {
      bodyContext = {
        id: item.rowData.id,
        level: props.level,
        type: 'edit',
      }
    } else if (props.level === 'secondLevel') {
      bodyContext = {
        id: item.rowData.id,
        level: props.level,
        type: 'edit',
        firstLevel: item.rowData.firstLevel,
      }
    } else {
      bodyContext = {
        id: item.rowData.id,
        level: props.level,
        type: 'edit',
        firstLevel: item.rowData.firstLevel
          ? item.rowData.firstLevel
          : localIdFirst,
        secondLevel: props.idLevels?.idSecondlvl
          ? props.idLevels?.idSecondlvl
          : localId,
      }
    }

    navigate({
      to: `/admin/app/mega-menu/form-menu/${encodeURIComponent(
        JSON.stringify(bodyContext)
      )}`,
    })
  }

  const deleteItem = (idMenu: MenuItem) => {
    let id = ''
    let idSecond = ''
    let idThird = ''

    if (props.level === 'firstLevel') {
      id = idMenu.id
    } else if (props.level === 'secondLevel') {
      idSecond = idMenu.id
    } else {
      idThird = idMenu.id
    }

    deleteMenu({
      variables: {
        id: id || props.idLevels?.idFirstlvl,
        idSecond: idSecond || props.idLevels?.idSecondlvl,
        idThird,
      },
    })
  }

  const filtermove = (id: string, order: number, type: string) => {
    const arrayMove = [...props.dataMenu]
    let dataTempEdit: MenuItem = {} as MenuItem
    let dataChange: MenuItem = {} as MenuItem

    for (const i in arrayMove) {
      if (arrayMove[i].id === id) {
        const index: number =
          type === 'up' ? parseInt(i, 10) - 1 : parseInt(i, 10) + 1

        arrayMove[i] = {
          ...arrayMove[i],
          order: type === 'up' ? order - 1 : order + 1,
        }
        arrayMove[index] = { ...arrayMove[index], order }
        dataTempEdit = arrayMove[i]
        dataChange = arrayMove[index]
      }
    }

    return { dataTempEdit, dataChange }
  }

  const move = (id: string, order: number, typeMove: string) => {
    const { dataTempEdit, dataChange } = filtermove(id, order, typeMove)
    let dataNew = {} as DataMenu

    if (props.level === 'thirdLevel') {
      let subArray = [...props.dataMenu]

      subArray = subArray.map((item) => {
        if (item.id === dataTempEdit.id) item = dataTempEdit
        if (item.id === dataChange.id) item = dataChange

        return item
      })

      const idFirstlvl = props.idLevels ? props.idLevels.idFirstlvl : ''
      const idSecondlvl = props.idLevels ? props.idLevels.idSecondlvl : ''
      const mainMegaMenu: DataMenu[] = [...props.mainData]

      let dataFirstLevel = mainMegaMenu.find((item) => item.id === idFirstlvl)

      if (dataFirstLevel?.menu) {
        const dataSecondLevel = dataFirstLevel.menu.map((item) => {
          if (item.id === idSecondlvl) item.menu = subArray

          return item
        })

        dataFirstLevel = { ...dataFirstLevel, menu: dataSecondLevel }
        dataNew = dataFirstLevel
      }
    } else if (props.level === 'secondLevel') {
      let mainMegaMenu = { ...props.mainData[0] }
      let subArray = [...props.dataMenu]

      subArray = subArray.map((item) => {
        if (item.id === dataTempEdit.id) item = dataTempEdit
        if (item.id === dataChange.id) item = dataChange

        return item
      })

      mainMegaMenu = { ...mainMegaMenu, menu: subArray }

      dataNew = mainMegaMenu
    } else {
      setDataChangeItem(dataChange)
      dataNew = dataTempEdit
    }

    menuInput({
      variables: {
        editMenu: {
          id: dataNew.id,
          name: dataNew.name,
          icon: dataNew.icon,
          slug: dataNew.slug,
          styles: dataNew.styles,
          menu: dataNew.menu,
          display: dataNew.display,
          enableSty: dataNew.enableSty,
          order: dataNew.order,
          mobile: dataNew.mobile ?? true,
          desktop: dataNew.desktop ?? true,
        },
      },
    })
  }

  const cellComponent = (e: TableItem) => {
    const up = <IconUp color={e.rowData.order === 1 ? '#9A9899' : '#134cd8'} />
    const down = (
      <IconDown
        color={
          e.rowData.order === props.dataMenu.length ? '#9A9899' : '#134cd8'
        }
      />
    )

    const orderMenu = e.rowData.order ?? 0

    return (
      <div className="flex">
        <div className="pt5 pr3 pb5">
          <ButtonWithIcon
            icon={up}
            variation="secondary"
            disabled={e.rowData.order === 1}
            onClick={() => move(e.rowData.id, orderMenu, 'up')}
          />
        </div>
        <div className="pt5 pr3 pb5">
          <ButtonWithIcon
            icon={down}
            variation="secondary"
            disabled={e.rowData.order === props.dataMenu.length}
            onClick={() => move(e.rowData.id, orderMenu, 'down')}
          />
        </div>
        <div className="pt5 pr3 pb5">
          <ButtonWithIcon
            icon={<IconEdit />}
            variation="secondary"
            onClick={() => editItem(e)}
          />
        </div>
        <div className="pt5 pb5">
          <ButtonWithIcon
            icon={<IconDelete />}
            variation="danger"
            onClick={() => {
              setMenuDelete(e.rowData)
              setIsModalOpen(true)
            }}
          />
        </div>
      </div>
    )
  }

  const customSchema = {
    properties: {
      name: {
        title: props.titleColumn.name,
        width: 400,
      },
      slug: {
        title: props.titleColumn.slug,
        width: 300,
      },
      icon: {
        title: props.titleColumn.icon,
        width: 300,
      },
      visibility: {
        title: props.titleColumn.visibility,
        width: 200,
        cellRenderer: (e: TableItem) => {
          return (
            <div className="flex" style={{ gap: '10px' }}>
              {(e.rowData.mobile || e.rowData.mobile === null) && (
                <FaMobileAlt color="0C389F" size={20} />
              )}
              {(e.rowData.desktop || e.rowData.desktop === null) && (
                <FaDesktop color="0C389F" size={20} />
              )}
              {e.rowData.display ? (
                <FaEye color="0C389F" size={20} />
              ) : (
                <FaEyeSlash color="0C389F" size={20} />
              )}
              {e.rowData.enableSty && <FaCode color="0C389F" size={20} />}
            </div>
          )
        },
      },
      actions: {
        title: props.titleColumn.action,
        width: 250,
        cellRenderer: (e: TableItem) => cellComponent(e),
      },
    },
  }

  return (
    <div>
      <ModalDialog
        centered
        loading={false}
        confirmation={{
          label: props.titleColumn.confirm,
          isDangerous: true,
          onClick: () => {
            deleteItem(menuDelete)
          },
        }}
        cancelation={{
          label: props.titleColumn.cancel,
          onClick: () => {
            setIsModalOpen(false)
          },
        }}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="">
          <p className="f3 f3-ns fw3 gray">{props.titleColumn.modalTitle}</p>
          <p>{props.titleColumn.modalBody}</p>
        </div>
      </ModalDialog>
      {props.loading ? (
        <div style={{ textAlign: 'center' }} className="mt8">
          <Spinner />
          <p>{props.titleColumn.loading}</p>
        </div>
      ) : props.dataMenu.length > 0 ? (
        <Table schema={customSchema} items={props.dataMenu} />
      ) : (
        <div className="mt9">
          <EmptyState title={props.titleColumn.emptyTitle}>
            <p>
            {props.titleColumn.empty}
            </p>
          </EmptyState>
        </div>
      )}
    </div>
  )
}

export default TableComponent
