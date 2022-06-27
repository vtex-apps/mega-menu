/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { useQuery } from 'react-apollo'
import { useDevice } from 'vtex.device-detector'
import { canUseDOM } from 'vtex.render-runtime'

import GET_MENUS from '../graphql/queries/getMenus.graphql'
import type { GlobalConfig, MenusResponse, Orientation } from '../shared'
import HorizontalMenu from './components/HorizontalMenu'
import VerticalMenu from './components/VerticalMenu'
import { megaMenuState } from './State'

const Wrapper: StorefrontFunctionComponent<MegaMenuProps> = (props) => {
  const { orientation } = props
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

  if (!canUseDOM) {
    initMenu()
  }

  useEffect(() => {
    initMenu()
  }, [data])

  return (
    <>
      {currentOrientation === 'horizontal' ? (
        <HorizontalMenu />
      ) : (
        <VerticalMenu />
      )}
    </>
  )
}

Wrapper.defaultProps = {
  title: 'Departments',
}

export type MegaMenuProps = GlobalConfig

export default Wrapper
