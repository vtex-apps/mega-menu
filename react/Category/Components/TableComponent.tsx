/* eslint-disable prettier/prettier */
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import { Table, ButtonWithIcon, Spinner, ModalDialog } from 'vtex.styleguide'
import { useMutation } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'

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

  const dataToEdit = (menuEdit: DataMenu) => {
    return {
      id: menuEdit.id,
      name: menuEdit.name,
      icon: menuEdit.icon,
      slug: menuEdit.slug,
      styles: menuEdit.styles,
      menu: menuEdit.menu,
      display: menuEdit.display,
      enableSty: menuEdit.enableSty,
      order: menuEdit.order,
    }
  }

  const move = (id: string, order: number, typeMove: string) => {
    const arrayMove = props.dataMenu
    let dataTempEdit: MenuItem = defaultcontent
    const mainMegaMenu: DataMenu[] = props.mainData
    let getValueOrder = 0
    let indexorder = 0

    for (let i = 0; i < arrayMove.length; i++) {
      if (arrayMove[i].id === id) {
        if (arrayMove[i].order) {
          getValueOrder = arrayMove[i].order ?? 0
        }

        switch (typeMove) {
          case 'up':
            if (props.level === 'secondLevel') {
              if (mainMegaMenu[0].menu) {
                mainMegaMenu[0].menu.forEach((mn: DataMenu) => {
                  if (mn.id === arrayMove[i].id) {
                    mn.order = order - 1
                  } else if (mn.id === arrayMove[i - 1].id) {
                    mn.order = order
                  }

                  delete mn.firstLevel
                })

                dataTempEdit = dataToEdit(mainMegaMenu[0])
              }
            } else if (props.level === 'thirdLevel') {
              const tempDataMainLvl1 = mainMegaMenu.filter(
                (l1: MenuItem) => l1.id === props.idLevels?.idFirstlvl
              )

              const tempDataMainLvl2 = tempDataMainLvl1[0].menu
                ? tempDataMainLvl1[0].menu.filter(
                    (l2: MenuItem) => l2.id === props.idLevels?.idSecondlvl
                  )
                : []

              if (tempDataMainLvl2[0].menu) {
                tempDataMainLvl2[0].menu.forEach((mn: DataMenu) => {
                  if (mn.id === arrayMove[i].id) {
                    mn.order = order - 1
                  } else if (mn.id === arrayMove[i - 1].id) {
                    mn.order = order
                  }

                  delete mn.firstLevel
                  delete mn.secondLevel
                })
              }

              dataTempEdit = dataToEdit(tempDataMainLvl1[0])
            } else {
              arrayMove[i].order = getValueOrder - 1
              delete arrayMove[i].firstLevel
              dataTempEdit = dataToEdit(arrayMove[i])
            }

            indexorder = i - 1

            break

          case 'down':
            if (props.level === 'secondLevel') {
              if (mainMegaMenu[0].menu) {
                mainMegaMenu[0].menu.forEach((mn: DataMenu) => {
                  if (mn.id === arrayMove[i].id) {
                    mn.order = order + 1
                  } else if (mn.id === arrayMove[i + 1].id) {
                    mn.order = order
                  }

                  delete mn.firstLevel
                })

                dataTempEdit = dataToEdit(mainMegaMenu[0])
              }
            } else if (props.level === 'thirdLevel') {
              const tempDataMainLvl1 = mainMegaMenu.filter(
                (l1: MenuItem) => l1.id === props.idLevels?.idFirstlvl
              )

              const tempDataMainLvl2 = tempDataMainLvl1[0].menu
                ? tempDataMainLvl1[0].menu.filter(
                    (l2: MenuItem) => l2.id === props.idLevels?.idSecondlvl
                  )
                : []

              if (tempDataMainLvl2[0].menu) {
                tempDataMainLvl2[0].menu.forEach((mn: DataMenu) => {
                  if (mn.id === arrayMove[i].id) {
                    mn.order = order + 1
                  } else if (mn.id === arrayMove[i + 1].id) {
                    mn.order = order
                  }

                  delete mn.firstLevel
                  delete mn.secondLevel
                })
              }

              dataTempEdit = dataToEdit(tempDataMainLvl1[0])
            } else {
              arrayMove[i].order = getValueOrder + 1
              delete arrayMove[i].firstLevel
              dataTempEdit = dataToEdit(arrayMove[i])
            }

            indexorder = i + 1
            break

          default:
            break
        }

        if (props.level === 'firstLevel') {
          setDataChangeItem({
            id: arrayMove[indexorder].id,
            name: arrayMove[indexorder].name,
            icon: arrayMove[indexorder].icon,
            slug: arrayMove[indexorder].slug,
            styles: arrayMove[indexorder].styles,
            menu: arrayMove[indexorder].menu,
            display: arrayMove[indexorder].display,
            enableSty: arrayMove[indexorder].enableSty,
            order,
          })
        }
      }
    }

    menuInput({
      variables: {
        editMenu: {
          id: dataTempEdit.id,
          name: dataTempEdit.name,
          icon: dataTempEdit.icon,
          slug: dataTempEdit.slug,
          styles: dataTempEdit.styles,
          menu: dataTempEdit.menu,
          display: dataTempEdit.display,
          enableSty: dataTempEdit.enableSty,
          order: dataTempEdit.order,
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
        width: 420,
      },
      slug: {
        title: props.titleColumn.slug,
        width: 420,
      },
      icon: {
        title: props.titleColumn.icon,
        width: 400,
      },
      actions: {
        title: props.titleColumn.action,
        width: 230,
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
      ) : (
        <Table schema={customSchema} items={props.dataMenu} />
      )}
    </div>
  )
}

export default TableComponent
