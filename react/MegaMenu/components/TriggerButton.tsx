/* eslint-disable jsx-a11y/click-events-have-key-events */
import classNames from 'classnames'
import { observer } from 'mobx-react-lite'
import { useQuery } from 'react-apollo'
import type { FC } from 'react'
import React, { useState, useEffect } from 'react'
import { applyModifiers, useCssHandles } from 'vtex.css-handles'
import { Icon } from 'vtex.store-icons'
import { useDevice } from 'vtex.device-detector'

import GET_SETTINGS from '../../graphql/queries/getSettings.graphql'
import type { IconProps } from '../../shared'
import { megaMenuState } from '../State'
import styles from '../styles.css'

const CSS_HANDLES = ['triggerContainer', 'triggerButtonIcon'] as const

export const BUTTON_ID = 'mega-menu-trigger-button'

const TriggerButton: FC<TriggerButtonProps> = observer((props) => {
  const { handles } = useCssHandles(CSS_HANDLES)
  const { openMenu, isOpenMenu } = megaMenuState
  const [orientationMenu, setOrientationMenu] = useState('')
  const { isMobile } = useDevice()

  const { data } = useQuery(GET_SETTINGS, {
    fetchPolicy: 'no-cache',
  })

  const { isActive, activeClassName, mutedClassName, Drawer, ...rest } = props
  const iconBaseClassName = applyModifiers(
    handles.triggerButtonIcon,
    isActive ? 'active' : 'muted'
  )

  useEffect(() => {
    if (data) {
      if (data.settings && data.settings.length > 0) {
        setOrientationMenu(data.settings[0].orientation)
      } else {
        setOrientationMenu('horizontal')
      }
    }
  }, [data])

  return orientationMenu === 'vertical' || isMobile ? (
    // eslint-disable-next-line jsx-a11y/interactive-supports-focus
    <div
      onClick={() => {
        if (!isOpenMenu && orientationMenu === 'vertical') {
          openMenu((v) => !v)
        }

        if (!isOpenMenu && isMobile) {
          openMenu((v) => !v)
        }
      }}
      role="button"
    >
      <Drawer />
    </div>
  ) : (
    <button
      data-id={BUTTON_ID}
      className={classNames(styles.triggerContainer, 'pointer')}
      onClick={() => openMenu((v) => !v)}
    >
      <Icon
        activeClassName={classNames(iconBaseClassName, activeClassName)}
        mutedClassName={classNames(iconBaseClassName, mutedClassName)}
        isActive={isActive}
        {...rest}
      />
    </button>
  )
})

export type TriggerButtonProps = IconProps

TriggerButton.defaultProps = {
  id: 'hpa-hamburguer-menu',
  isActive: true,
}

export default TriggerButton
