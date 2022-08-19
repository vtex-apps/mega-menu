import React, { useEffect, useState } from 'react'
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
    fetchPolicy: 'no-cache',
    variables: {
      isMobile,
    },
  })

  const { data: dataSettings } = useQuery(GET_SETTINGS, {
    fetchPolicy: 'no-cache',
  })

  const [orientationMenu, setOrientationMenu] = useState('')

  const { setDepartments, setConfig } = megaMenuState

  const currentOrientation: Orientation = isMobile ? 'vertical' : 'horizontal'

  useEffect(() => {
    // eslint-disable-next-line vtex/prefer-early-return
    if (data?.menus.length) {
      setConfig({
        ...props,
        orientation: currentOrientation,
      })
      setDepartments(data.menus)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
