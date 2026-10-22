import classNames from 'classnames'
import { observer } from 'mobx-react-lite'
import type { FC } from 'react'
import React from 'react'
import { applyModifiers, useCssHandles } from 'vtex.css-handles'
import { Icon } from 'vtex.store-icons'

import type { IconProps } from '../../shared'
import { megaMenuState } from '../State'
import styles from '../styles.css'

const CSS_HANDLES = ['triggerContainer', 'triggerButtonIcon'] as const

export const BUTTON_ID = 'mega-menu-trigger-button'

const TriggerButton: FC<TriggerButtonProps> = observer((props) => {
  const { handles } = useCssHandles(CSS_HANDLES)
  const { openMenu } = megaMenuState

  const { isActive, activeClassName, mutedClassName, ...rest } = props
  const iconBaseClassName = applyModifiers(
    handles.triggerButtonIcon,
    isActive ? 'active' : 'muted'
  )

  return (
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
