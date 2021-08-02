import type { FC } from 'react'
import React, { useState, useEffect } from 'react'
import {
  Toggle,
  Input,
  PageBlock,
  Layout,
  PageHeader,
  ButtonWithIcon,
  FloatingActionBar,
  Card,
  Alert,
  Tooltip,
  Textarea,
  Spinner,
} from 'vtex.styleguide'
import { useRuntime } from 'vtex.render-runtime'
import { useQuery, useMutation } from 'react-apollo'
import type { InjectedIntlProps } from 'react-intl'
import { injectIntl } from 'react-intl'
import { formatIOMessage } from 'vtex.native-types'

import IconInfo from './icons/IconInfo'
import IconArrowLeft from './icons/IconArrowLeft'
import CREATE from './graphql/mutations/create.graphql'
import GETMENU from './graphql/queries/getMenu.graphql'
import EDIT from './graphql/mutations/edit.graphql'
import { IconSelector, messagesForm } from './shared'
import type { DataMenu, MenuItem } from './shared'

const arrowLeft = <IconArrowLeft />

interface FormComponentProps {
  id: string
  params: {
    menu: string
  }
}

const messages = messagesForm

const FormComponent: FC<FormComponentProps & InjectedIntlProps> = (props) => {
  const dataMenuTypeArray: DataMenu[] = []
  const dataMenuType: DataMenu = {
    icon: '',
    id: '',
    name: '',
    slug: '',
    styles: '',
    menu: [],
    display: false,
    enableSty: false,
  }

  const { navigate } = useRuntime()

  const [name, setName] = useState('')
  const [icon, setIcon] = useState('')
  const [slug, setSlug] = useState('')
  const [styles, setStyles] = useState('')
  const [display, setDisplay] = useState(true)
  const [enableSty, setEnableSty] = useState(true)
  const [idMenu, setIdMenu] = useState('')
  const [mainMenu, setMainMenu] = useState(dataMenuType)
  const [subMenu, setSubMenu] = useState(dataMenuTypeArray)
  const [alert, setAlert] = useState(false)
  const [order, setOrder] = useState(0)
  const [message, setMessage] = useState('')
  const [levelInfo, setLevelInfo] = useState(Object)
  const [messageName, setMessageName] = useState('')
  const [messageSlug, setMessageSlug] = useState('')

  const responseForm = JSON.parse(decodeURIComponent(props.params.menu))

  const [createNewMenu, { data: dataSave }] = useMutation(CREATE, {
    fetchPolicy: 'no-cache',
  })

  const [menuInput, { data: dataEdit }] = useMutation(EDIT, {
    fetchPolicy: 'no-cache',
  })

  const { loading, data: dataMenu } = useQuery(GETMENU, {
    variables: {
      id: responseForm.firstLevel ? responseForm.firstLevel : responseForm.id,
    },
    fetchPolicy: 'no-cache',
  })

  const btnSave = formatIOMessage({
    id: messages.btnSaveForm.id,
    intl: props.intl,
  }).toString()

  const messageTranslate = (key: string) => {
    const keyObj = `admin/mega-menu.items.${key}`

    return formatIOMessage({
      id: keyObj,
      intl: props.intl,
    }).toString()
  }

  /* eslint max-params: ["error", 9] */
  /* eslint-env es9 */
  const setDataForm = (
    idenMenu: string,
    nameMenu: string,
    iconMenu: string,
    slugMenu: string,
    stylesMenu: string,
    subMenuData: DataMenu[],
    displayMenu: boolean,
    enableStyMenu: boolean,
    orderMenu: number
  ) => {
    setIdMenu(idenMenu)
    setName(nameMenu)
    setIcon(iconMenu)
    setSlug(slugMenu)
    setStyles(stylesMenu)
    setSubMenu(subMenuData)
    setDisplay(displayMenu)
    setEnableSty(enableStyMenu)
    setOrder(orderMenu)
  }

  useEffect(() => {
    if (!dataMenu) return

    let secondName = ''

    setMainMenu(dataMenu.menu)

    if (responseForm.type === 'edit') {
      if (responseForm.level === 'firstLevel') {
        document.getElementsByClassName('c-muted-2')[0].innerHTML =
          dataMenu.menu.icon
        setDataForm(
          dataMenu.menu.id,
          dataMenu.menu.name,
          dataMenu.menu.icon,
          dataMenu.menu.slug,
          dataMenu.menu.styles,
          dataMenu.menu.menu,
          dataMenu.menu.display,
          dataMenu.menu.enableSty,
          dataMenu.menu.order
        )
      } else if (responseForm.level === 'secondLevel') {
        setLevelInfo({ firstLevel: dataMenu.menu.name })
        const submenu = dataMenu.menu.menu.filter(
          (item: DataMenu) => item.id === responseForm.id
        )

        setDataForm(
          submenu[0].id,
          submenu[0].name,
          submenu[0].icon,
          submenu[0].slug,
          submenu[0].styles,
          [],
          submenu[0].display,
          submenu[0].enableSty,
          submenu[0].order
        )
      } else {
        const tempArrayTL: DataMenu[] = []

        dataMenu.menu.menu.forEach((item: DataMenu) => {
          if (item.id === responseForm.secondLevel) {
            secondName = item.name
          }

          if (item.menu) {
            item.menu.forEach((i: DataMenu) => {
              if (i.id === responseForm.id) {
                tempArrayTL.push(i)
              }
            })
          }
        })

        setSubMenu(tempArrayTL)
        setDataForm(
          tempArrayTL[0].id,
          tempArrayTL[0].name,
          tempArrayTL[0].icon,
          tempArrayTL[0].slug,
          tempArrayTL[0].styles,
          [],
          tempArrayTL[0].display,
          tempArrayTL[0].enableSty,
          tempArrayTL[0].order ?? 0
        )

        setLevelInfo({
          firstLevel: dataMenu.menu.name,
          secondLevel: secondName,
        })
      }
    } else {
      if (responseForm.level === 'thirdLevel') {
        dataMenu.menu.menu.forEach((item: DataMenu) => {
          if (item.id === responseForm.secondLevel) {
            secondName = item.name
          }
        })
      }

      setLevelInfo({
        firstLevel: dataMenu.menu.name,
        secondLevel: secondName,
      })
    }
  }, [dataMenu]) // eslint-disable-line react-hooks/exhaustive-deps

  const returnHome = () => {
    const tab =
      responseForm.level === 'firstLevel'
        ? '1'
        : responseForm.level === 'secondLevel'
        ? '2'
        : '3'

    navigate({
      to: `/admin/app/mega-menu/${tab}`,
    })
  }

  const activateAlert = () => {
    setAlert(true)
    window.scrollTo(0, 0)
    setTimeout(() => {
      setAlert(false)
    }, 4000)
  }

  useEffect(() => {
    if (dataSave) {
      activateAlert()
    }
  }, [dataSave]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (dataEdit) {
      activateAlert()
    }
  }, [dataEdit])

  const changeStyle = (e: { id: string; value: string }) => {
    setAlert(false)
    setMessageName('')
    setMessageSlug('')
    switch (e.id) {
      case 'name':
        setName(e.value)
        break

      case 'slug':
        setSlug(e.value)
        break

      case 'icon':
        setIcon(e.value)
        break

      case 'styles':
        setStyles(e.value)
        break

      case 'display':
        setDisplay(!display)
        break

      case 'enableSty':
        setEnableSty(!enableSty)
        break

      default:
        break
    }
  }

  const randomId = () => {
    const n = 50
    const arr = new Array(n)

    for (let i = 0; i < n; i++) {
      arr[i] = i + 1
    }

    arr.sort(() => (Math.random() > 0.5 ? 1 : -1))
    const randomNumber = arr.slice(0, 3).join('')

    return randomNumber
  }

  const insertSubMenu = (mainMenuLevel: DataMenu, subMenuLevel: DataMenu[]) => {
    menuInput({
      variables: {
        editMenu: {
          id: mainMenuLevel.id,
          name: mainMenuLevel.name,
          icon: mainMenuLevel.icon,
          slug: mainMenuLevel.slug,
          styles: mainMenuLevel.styles,
          menu: subMenuLevel,
          display: mainMenuLevel.display,
          enableSty: mainMenuLevel.enableSty,
          order: mainMenuLevel.order,
        },
      },
    })
  }

  const saveChanges = () => {
    const menu = mainMenu
    let secondMenu = subMenu

    if (responseForm.level === 'firstLevel') {
      createNewMenu({
        variables: {
          menuInput: {
            id: name + randomId(),
            name,
            icon,
            slug,
            styles,
            menu: subMenu,
            display,
            enableSty,
          },
        },
      })
      setMessage(messageTranslate('createItem'))
    } else if (responseForm.level === 'secondLevel') {
      if (menu.menu) secondMenu = menu.menu
      const orderSubMenu = menu.menu ? menu.menu.length : 0

      secondMenu.push({
        id: name + randomId(),
        name,
        icon,
        slug,
        styles,
        display,
        enableSty,
        order: orderSubMenu + 1,
      })

      insertSubMenu(
        {
          id: menu.id,
          name: menu.name,
          icon: menu.icon,
          slug: menu.slug,
          styles: menu.styles,
          display: menu.display,
          enableSty: menu.enableSty,
          order: menu.order,
        },
        secondMenu
      )
      setMessage(messageTranslate('createItem'))
    } else {
      const getOrderthr = menu.menu?.filter(
        (item: MenuItem) => item.id === responseForm.secondLevel
      )

      const valueOrder = getOrderthr ? getOrderthr[0].menu : []

      const newSubMenu = {
        id: name + randomId(),
        name,
        icon,
        slug,
        styles,
        display,
        enableSty,
        order: valueOrder ? valueOrder.length + 1 : 1,
      }

      if (menu.menu) {
        menu.menu.forEach((i: DataMenu) => {
          if (i.id === responseForm.secondLevel) {
            if (i.menu) {
              i.menu.push(newSubMenu)
            } else {
              i.menu = [newSubMenu]
            }
          }
        })
      }

      insertSubMenu(
        {
          id: menu.id,
          name: menu.name,
          icon: menu.icon,
          slug: menu.slug,
          styles: menu.styles,
          display: menu.display,
          enableSty: menu.enableSty,
          order: menu.order,
        },
        menu.menu ? menu.menu : []
      )
      setMessage(messageTranslate('createItem'))
    }
  }

  const editItem = () => {
    const menu = mainMenu
    let tempSecond: DataMenu[] = []

    if (responseForm.level === 'firstLevel') {
      insertSubMenu(
        { id: idMenu, name, icon, slug, styles, display, enableSty, order },
        menu.menu ? menu.menu : []
      )
      setMessage(messageTranslate('editItem'))
    } else if (responseForm.level === 'secondLevel') {
      if (menu.menu) {
        tempSecond = menu.menu.filter((i: DataMenu) => i.id === responseForm.id)

        tempSecond[0].name = name
        tempSecond[0].icon = icon
        tempSecond[0].slug = slug
        tempSecond[0].styles = styles
        tempSecond[0].display = display
        tempSecond[0].enableSty = enableSty
        tempSecond[0].order = order
      }

      insertSubMenu(
        {
          id: menu.id,
          name: menu.name,
          icon: menu.icon,
          slug: menu.slug,
          styles: menu.styles,
          display: menu.display,
          enableSty: menu.enableSty,
          order: menu.order,
        },
        menu.menu ? menu.menu : []
      )
      setMessage(messageTranslate('editItem'))
    } else if (responseForm.level === 'thirdLevel') {
      if (menu.menu) {
        const tempSecondLvl = menu.menu.filter(
          (i: DataMenu) => i.id === responseForm.secondLevel
        )

        if (tempSecondLvl[0].menu) {
          const tempThird = tempSecondLvl[0].menu.filter(
            (j: DataMenu) => j.id === responseForm.id
          )

          tempThird[0].name = name
          tempThird[0].icon = icon
          tempThird[0].slug = slug
          tempThird[0].styles = styles
          tempThird[0].display = display
          tempThird[0].enableSty = enableSty
          tempThird[0].order = order
        }
      }

      insertSubMenu(
        {
          id: menu.id,
          name: menu.name,
          icon: menu.icon,
          slug: menu.slug,
          styles: menu.styles,
          display: menu.display,
          enableSty: menu.enableSty,
          order: menu.order,
        },
        menu.menu ? menu.menu : []
      )

      setMessage(messageTranslate('editItem'))
    }
  }

  return (
    <div>
      {alert ? (
        <Alert
          type="success"
          onClose={() => {
            setAlert(false)
            setMessage('')
          }}
        >
          {message}
        </Alert>
      ) : (
        <div />
      )}
      <Layout
        pageHeader={
          <PageHeader
            title={
              responseForm.type === 'edit'
                ? messageTranslate('titleForm')
                : responseForm.level === 'firstLevel'
                ? messageTranslate('newItemFirst')
                : responseForm.level === 'secondLevel'
                ? messageTranslate('newItemSecond')
                : messageTranslate('newItemThird')
            }
          />
        }
        fullWidth
      >
        <div className="mb3 flex">
          <div className="w-50">
            <ButtonWithIcon
              icon={arrowLeft}
              variation="tertiary"
              onClick={returnHome}
            >
              {messageTranslate('backBtnForm')}
            </ButtonWithIcon>
          </div>
        </div>
        {(responseForm.firstLevel && !responseForm.secondLevel) ||
        (responseForm.type === 'new' &&
          responseForm.level === 'secondLevel') ? (
          <div className="mb5">
            <Card>
              <div className=" ml4">
                <div className="t-heading-5  mb4">
                  {messageTranslate('infoFormTitle')}
                </div>
                <p>
                  <b>{messageTranslate('infoFormSubtitle')}</b>
                </p>
                <p>{levelInfo.firstLevel}</p>
              </div>
            </Card>
          </div>
        ) : (
          <div />
        )}
        {(responseForm.firstLevel && responseForm.secondLevel) ||
        (responseForm.type === 'new' && responseForm.level === 'thirdLevel') ? (
          <div className="mb5">
            <div className="flex">
              <div className="w-50 mr4">
                <Card>
                  <div className=" ml4">
                    <div className="t-heading-5  mb4">
                      {messageTranslate('infoFormTitle')}
                    </div>
                    <p>
                      <b>{messageTranslate('infoFormSubtitle')}</b>
                    </p>
                    <p>{levelInfo.firstLevel}</p>
                  </div>
                </Card>
              </div>
              <div className="w-50">
                <Card>
                  <div className="mr4">
                    <div className="t-heading-5 mb4">
                      {messageTranslate('infoForm2Title')}
                    </div>
                    <p>
                      <b>{messageTranslate('infoForm2Subtitle')}</b>
                    </p>
                    <p>{levelInfo.secondLevel}</p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          <div />
        )}
        <PageBlock variation="aside">
          {loading ? (
            <div style={{ textAlign: 'center' }} className="mt8">
              <Spinner />
              <p>{messageTranslate('loading')}</p>
            </div>
          ) : (
            <div>
              <div className="t-heading-5  mb4">
                {messageTranslate('subTitleForm')}
              </div>
              <p>{messageTranslate('infoForm')}</p>
              <div>
                <div className="w-100 ml4 mr4">
                  <div className="mb5">
                    <Input
                      placeholder=""
                      label={messageTranslate('input1Form')}
                      value={name}
                      id="name"
                      errorMessage={messageName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        changeStyle({ id: e.target.id, value: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb5">
                    <Input
                      placeholder=""
                      label={messageTranslate('input2Form')}
                      value={slug}
                      id="slug"
                      errorMessage={messageSlug}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        changeStyle({ id: e.target.id, value: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="w-100 ml4 mr4">
                  <div className="mb5">
                    <div className="flex items-center">
                      <p className="mb2">{messageTranslate('input3Form')}</p>
                      <Tooltip label={messageTranslate('tooltip')}>
                        <div className="c-on-base pointer pt6 pl2">
                          <IconInfo />
                        </div>
                      </Tooltip>
                    </div>

                    <IconSelector
                      onChange={
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (e: any) => changeStyle({ id: 'icon', value: e.value })
                      }
                    />
                  </div>
                  <div className="mb5">
                    <Textarea
                      label={
                        <div className="flex items-center">
                          <p>{messageTranslate('input4Form')}</p>
                          <Tooltip label={messageTranslate('tooltip2')}>
                            <div className="c-on-base pointer pt4 pl2">
                              <IconInfo />
                            </div>
                          </Tooltip>
                        </div>
                      }
                      value={styles}
                      id="styles"
                      placeholder="i.e. font-size:10px,color:red"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        changeStyle({
                          id: e.target.id,
                          value: e.target.value,
                        })
                      }
                      resize="none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div>
            <div className="t-heading-5  mb4">
              {messageTranslate('titleSubBlock')}
            </div>
            <div className="mt4">
              <p>{messageTranslate('check1Block')}</p>
              <Toggle
                label={messageTranslate('subCheck1Block')}
                checked={display}
                id="display"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  changeStyle({ id: e.target.id, value: e.target.value })
                }
              />
            </div>
            <div className="mt7 mb7">
              <p>{messageTranslate('input4Form')}</p>
              <Toggle
                label={messageTranslate('subCheck2Block')}
                checked={enableSty}
                id="enableSty"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  changeStyle({ id: e.target.id, value: e.target.value })
                }
              />
            </div>
          </div>
        </PageBlock>
      </Layout>
      <FloatingActionBar
        save={{
          label: btnSave,
          onClick: () => {
            if (!name) {
              setMessage(messageTranslate('validateName'))
            } else if (!slug) {
              setMessage(messageTranslate('validateSlug'))
            } else if (responseForm.type === 'edit') {
              editItem()
            } else {
              saveChanges()
            }
          },
        }}
      />
    </div>
  )
}

export default injectIntl(FormComponent)
