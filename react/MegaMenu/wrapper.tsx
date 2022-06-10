/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { useQuery } from 'react-apollo'
import { useDevice } from 'vtex.device-detector'

import GET_MENUS from '../graphql/queries/getMenus.graphql'
import GET_SETTINGS from '../graphql/queries/getSettings.graphql'
import type { GlobalConfig, MenusResponse, Orientation } from '../shared'
import HorizontalMenu from './components/HorizontalMenu'
import VerticalMenu from './components/VerticalMenu'
import { megaMenuState } from './State'

const Wrapper: StorefrontFunctionComponent<MegaMenuProps> = (props) => {
  const { openOnly } = props
  const { isMobile } = useDevice()
  const { data } = useQuery<MenusResponse>(GET_MENUS, {
    ssr: true,
  })

  const { setDepartments, setConfig } = megaMenuState

  const { isMobile } = useDevice()

  const currentOrientation: Orientation =
    orientation ?? (isMobile ? 'vertical' : 'horizontal')

  const initMenu = () => {
    if (data?.menus.length) {
      setConfig({
        ...props,
        orientation: currentOrientation,
      })
      setDepartments(data.menus)
    }
  }

  initMenu()

  useEffect(() => {
    initMenu()
  }, [data])

  useEffect(() => {
    if (dataSettings) {
      if (dataSettings.settings && dataSettings.settings.length > 0) {
        setOrientationMenu(dataSettings.settings[0].orientation)
      } else {
        setOrientationMenu('horizontal')
      }
    }
  }, [dataSettings])

  if (isMobile) {
    return (
      <VerticalMenu
        openOnly={openOnly ?? 'vertical'}
        orientation={orientationMenu}
      />
    )
  }

  if (orientationMenu === 'vertical') {
    return (
      <VerticalMenu
        openOnly={openOnly ?? 'vertical'}
        orientation={orientationMenu}
      />
    )
  }

  return (
    <HorizontalMenu
      openOnly={openOnly ?? 'horizontal'}
      orientation={orientationMenu}
    />
  )
}

Wrapper.defaultProps = {
  title: 'Departments',
}

Wrapper.displayName = 'MegaMenu'

export type MegaMenuProps = GlobalConfig

export default Wrapper
