import classNames from 'classnames'
import { observer } from 'mobx-react-lite'
import type { FC } from 'react'
import React from 'react'



import type { IconProps } from '../../shared'
import { megaMenuState } from '../State'
import styles from '../styles.css'


export const BUTTON_ID = 'mega-menu-trigger-button'

const TriggerButton: FC<TriggerButtonProps> = observer(() => {

  const { openMenu } = megaMenuState


  

  return (
    <button
      data-id={BUTTON_ID}
      className={classNames(styles.triggerContainer, 'pointer')}
      onMouseEnter={() => openMenu((v) => !v)}
    >
      <div>
        PRODUCTS
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
