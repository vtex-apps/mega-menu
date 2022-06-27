/* eslint-disable prettier/prettier */
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
  const [slugRoot, setSlugRoot] = useState('')
  const [slugRelative, setSlugRelative] = useState('')
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
    ssr: true,
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

  /* eslint max-params: ["error", 11] */
  /* eslint-env es9 */
  const setDataForm = (
    idenMenu: string,
    nameMenu: string,
    iconMenu: string,
    slugMenu: string,
    slugRootMenu: string,
    slugRelativeMenu: string,
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
    setSlugRoot(slugRootMenu)
    setSlugRelative(slugRelativeMenu)
    setStyles(stylesMenu)
    setSubMenu(subMenuData)
    setDisplay(displayMenu)
    setEnableSty(enableStyMenu)
    setOrder(orderMenu)
  }

  useEffect(() => {
    if (!dataMenu) return

    let secondName = ''
    let secondLevelSlug = ''

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
          dataMenu.menu.slugRoot,
          dataMenu.menu.slugRelative,
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

        let rootRelative = ['', '']

        if (
          submenu[0].slug &&
          !submenu[0].slugRoot &&
          !submenu[0].slugRelative
        ) {
          rootRelative = submenu[0].slug.split('/')

          rootRelative.shift()
        }

        setDataForm(
          submenu[0].id,
          submenu[0].name,
          submenu[0].icon,
          submenu[0].slug,
          submenu[0].slugRoot ?? rootRelative[1],
          submenu[0].slugRelative ?? rootRelative[0],
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
        let rootRelative = ['', '']

        if (
          tempArrayTL[0].slug &&
          !tempArrayTL[0].slugRoot &&
          !tempArrayTL[0].slugRelative
        ) {
          rootRelative = tempArrayTL[0].slug.split('/')

          rootRelative.shift()

          const rootPath = `${rootRelative[0]}/${rootRelative[1]}`

          rootRelative = [rootRelative[2], rootPath]
        }

        setDataForm(
          tempArrayTL[0].id,
          tempArrayTL[0].name,
          tempArrayTL[0].icon,
          tempArrayTL[0].slug,
          tempArrayTL[0].slugRoot ?? rootRelative[0],
          tempArrayTL[0].slugRelative ?? rootRelative[1],
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
            secondLevelSlug = item.slug ?? ''
          }
        })
      }

      setLevelInfo({
        firstLevel: dataMenu.menu.name,
        secondLevel: secondName,
        firstLevelSlugRelative: dataMenu.menu.slug,
        secondLevelSlugRelative: secondLevelSlug,
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

      case 'slugRoot':
        setSlugRoot(e.value)
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

      case 'slugRelative':
        setSlugRelative(e.value)
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
          slugRoot: mainMenuLevel.slugRoot,
          slugRelative: mainMenuLevel.slugRelative,
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
        slug: `${menu.slug}/${slug}`,
        styles,
        display,
        enableSty,
        order: orderSubMenu + 1,
        slugRoot: slug,
        slugRelative: menu.slug,
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
      const valueSlug = getOrderthr ? getOrderthr[0].slug : []

      const newSubMenu = {
        id: name + randomId(),
        name,
        icon,
        slug: `${valueSlug}/${slug}`,
        styles,
        display,
        enableSty,
        order: valueOrder ? valueOrder.length + 1 : 1,
        slugRoot: slug,
        slugRelative: `${valueSlug}`,
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
          slugRoot: menu.slugRoot,
          slugRelative: menu.slugRelative,
        },
        menu.menu ? menu.menu : []
      )
      setMessage(messageTranslate('createItem'))
    }
  }

  const getNewPath = (
    slugPath: string,
    slugRootPath: string | undefined,
    slugRelativePath: string | undefined
  ) => {
    let rootRelative = ['']

    if (slugPath && !slugRootPath && !slugRelativePath) {
      rootRelative = slugPath.split('/')
      rootRelative.shift()
    }

    return rootRelative
  }

  const editItem = () => {
    const menu = { ...mainMenu }

    let tempSecond: DataMenu[] = []

    if (responseForm.level === 'firstLevel') {
      const menuLevelTwo = menu.menu
      const menuLevelTwoUpdate: MenuItem[] = []

      if (menuLevelTwo?.length) {
        menuLevelTwo.forEach((item: MenuItem) => {
          if (item.slugRelative === slug) return

          const dataPath = getNewPath(
            item.slug,
            item.slugRoot,
            item.slugRelative
          )

          let createSlug = !item.slugRoot
            ? `${slug}/${dataPath[1]}`
            : item.slugRoot === null
            ? `${slug}/`
            : `${slug}/${item.slugRoot}`

          createSlug = createSlug.replace('undefined', '')

          const updateLevel: MenuItem = {
            ...item,
            slug: createSlug,
            slugRelative: slug,
            slugRoot: !item.slugRoot ? dataPath[1] : item.slugRoot,
          }

          menuLevelTwoUpdate.push(updateLevel)
        })
      }

      let menuLevelThirdUpdate: MenuItem[] = []

      if (menuLevelTwoUpdate?.length) {
        menuLevelTwoUpdate.forEach((itemSecond: MenuItem) => {
          menuLevelThirdUpdate = []
          if (itemSecond.menu?.length) {
            itemSecond.menu.forEach((itemThird: MenuItem) => {
              if (itemSecond.slugRelative === itemThird.slug) return

              const dataPath = getNewPath(
                itemThird.slug,
                itemThird.slugRoot,
                itemThird.slugRelative
              )

              const updateLevel: MenuItem = {
                ...itemThird,
                slug:
                  dataPath.length >= 3
                    ? `${slug}/${dataPath[1]}/${dataPath[2]}`
                    : itemThird.slugRoot === null
                    ? `${itemSecond.slug}/`
                    : `${itemSecond.slug}/${itemThird.slugRoot}`,
                slugRelative:
                  dataPath.length >= 3
                    ? `${slug}/${dataPath[1]}`
                    : itemSecond.slug,
                slugRoot: !itemThird.slugRoot
                  ? dataPath[2]
                  : itemThird.slugRoot,
              }

              menuLevelThirdUpdate.push(updateLevel)
            })

            itemSecond.menu = menuLevelThirdUpdate
          }
        })
      }

      insertSubMenu(
        { id: idMenu, name, icon, slug, styles, display, enableSty, order },
        menuLevelTwoUpdate
      )

      setMessage(messageTranslate('editItem'))
    } else if (responseForm.level === 'secondLevel') {
      const menuSecondSlug = `${slugRelative}/${slugRoot}`

      if (menu.menu) {
        tempSecond = menu.menu.filter((i: DataMenu) => i.id === responseForm.id)

        tempSecond[0].name = name
        tempSecond[0].icon = icon
        tempSecond[0].slug = menuSecondSlug
        tempSecond[0].slugRoot = slugRoot
        tempSecond[0].slugRelative = slugRelative
        tempSecond[0].styles = styles
        tempSecond[0].display = display
        tempSecond[0].enableSty = enableSty
        tempSecond[0].order = order
      }

      let menuLevelThirdUpdate: MenuItem[] = []

      menu.menu?.forEach((itemSecond: MenuItem) => {
        menuLevelThirdUpdate = []
        if (itemSecond.menu?.length) {
          itemSecond.menu.forEach((itemThird: MenuItem) => {
            if (itemSecond.slugRelative === itemThird.slug) return

            const dataPath = getNewPath(
              itemThird.slug,
              itemThird.slugRoot,
              itemThird.slugRelative
            )

            let createSlug =
              dataPath.length >= 3
                ? `${menuSecondSlug}/${dataPath[2]}`
                : itemThird.slugRoot === null
                ? `${itemSecond.slug}/`
                : `${itemSecond.slug}/${itemThird.slugRoot}`

            createSlug = createSlug.replace('undefined', '')

            const updateLevel: MenuItem = {
              ...itemThird,
              slug: createSlug,
              slugRelative:
                dataPath.length >= 3 ? `${menuSecondSlug}` : itemSecond.slug,
              slugRoot: !itemThird.slugRoot ? dataPath[2] : itemThird.slugRoot,
            }

            menuLevelThirdUpdate.push(updateLevel)

            itemSecond.menu = menuLevelThirdUpdate
          })
        }
      })

      insertSubMenu(
        {
          id: menu.id,
          name: menu.name,
          icon: menu.icon,
          slug: menu.slug,
          slugRoot: menu.slugRoot,
          slugRelative: menu.slugRelative,
          styles: menu.styles,
          display: menu.display,
          enableSty: menu.enableSty,
          order: menu.order,
        },
        menu.menu ? menu.menu : []
      )
      setMessage(messageTranslate('editItem'))
    } else if (responseForm.level === 'thirdLevel') {
      let tempThird: MenuItem[] = []
      let tempSecondLvl: MenuItem[] = []

      if (menu.menu) {
        tempSecondLvl = menu.menu.filter(
          (i: DataMenu) => i.id === responseForm.secondLevel
        )

        if (tempSecondLvl[0].menu) {
          tempThird = tempSecondLvl[0].menu.filter(
            (j: DataMenu) => j.id === responseForm.id
          )

          let menuThirdSlug = `${slugRelative}/${slugRoot}`

          menuThirdSlug = menuThirdSlug.replace('undefined', '')

          tempThird[0].name = name
          tempThird[0].icon = icon
          tempThird[0].slug = menuThirdSlug
          tempThird[0].slugRoot = slugRoot
          tempThird[0].slugRelative = slugRelative
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
          slugRoot: menu.slugRoot,
          slugRelative: menu.slugRelative,
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
                    {responseForm.firstLevel ? (
                      <>
                        <div className="flex items-center">
                          <p className="mb2">
                            {messageTranslate('input2Form')}
                          </p>
                          <Tooltip label={messageTranslate('tooltip3')}>
                            <div className="c-on-base pointer pt6 pl2">
                              <IconInfo />
                            </div>
                          </Tooltip>
                        </div>
                        <div className="flex items-center">
                          <div className="w-50 mr3">
                            <Input
                              placeholder=""
                              value={slugRelative}
                              id="slugRelative"
                              errorMessage={messageSlug}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) =>
                                changeStyle({
                                  id: e.target.id,
                                  value: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="w-50">
                            <Input
                              placeholder=""
                              value={slugRoot}
                              id="slugRoot"
                              errorMessage={messageSlug}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) =>
                                changeStyle({
                                  id: e.target.id,
                                  value: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {(responseForm.type === 'new' &&
                          responseForm.level === 'secondLevel') ||
                        (responseForm.type === 'new' &&
                          responseForm.level === 'thirdLevel') ? (
                          <>
                            <p className="mb2">
                              {messageTranslate('input2Form')}
                            </p>
                            <div className="flex items-center">
                              <label className="w-100 pa3 br2 bg-muted-3 hover-bg-muted-3 active-bg-muted-3 c-on-muted-3 hover-c-on-muted-3 active-c-on-muted-3 dib mr3">
                                {responseForm.level === 'secondLevel'
                                  ? levelInfo.firstLevelSlugRelative
                                  : levelInfo.secondLevelSlugRelative}
                              </label>
                              <Input
                                placeholder=""
                                value={slug}
                                id="slug"
                                errorMessage={messageSlug}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                  changeStyle({
                                    id: e.target.id,
                                    value: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </>
                        ) : (
                          <Input
                            placeholder=""
                            value={slug}
                            label={messageTranslate('input2Form')}
                            id="slug"
                            errorMessage={messageSlug}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                              changeStyle({
                                id: e.target.id,
                                value: e.target.value,
                              })
                            }
                          />
                        )}
                      </>
                    )}
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
                        (e: any) => {
                          if (e) {
                            changeStyle({ id: 'icon', value: e.value })
                          } else {
                            changeStyle({ id: 'icon', value: '' })
                          }
                        }
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
