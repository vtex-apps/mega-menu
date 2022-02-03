import classNames from 'classnames'
import { observer } from 'mobx-react-lite'
import type { FC } from 'react'
import React from 'react'
import { applyModifiers, useCssHandles } from 'vtex.css-handles'


import type { IconProps } from '../../shared'
import { megaMenuState } from '../State'
import styles from '../styles.css'

const CSS_HANDLES = ['triggerContainer', 'triggerButtonIcon'] as const

export const BUTTON_ID = 'mega-menu-trigger-button'

const TriggerButton: FC<TriggerButtonProps> = observer((props) => {
  const { handles } = useCssHandles(CSS_HANDLES)
  const { openMenu } = megaMenuState

  const { isActive } = props
  const iconBaseClassName = applyModifiers(
    handles.triggerButtonIcon,
    isActive ? 'active' : 'muted'
  )
console.log(iconBaseClassName)
  return (
    <button
      data-id={BUTTON_ID}
      className={classNames(styles.triggerContainer, 'pointer')}
      onMouseEnter={() => openMenu((v) => !v)}
    >
      <div>
        Products
      </div>
    </button>
  )
})

export type TriggerButtonProps = IconProps

TriggerButton.defaultProps = {
  id: 'hpa-hamburguer-menu',
  isActive: true,
}

export default TriggerButton
