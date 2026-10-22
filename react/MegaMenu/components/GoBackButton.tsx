import classNames from 'classnames'
import { observer } from 'mobx-react-lite'
import type { FC } from 'react'
import React from 'react'
import type { InjectedIntlProps } from 'react-intl'
import { defineMessages, injectIntl } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { formatIOMessage } from 'vtex.native-types'
import { IconCaret } from 'vtex.store-icons'

import { megaMenuState } from '../State'

const messages = defineMessages({
  goBackButtonTitle: {
    defaultMessage: '',
    id: 'store/mega-menu.goBackButton.title',
  },
})

const CSS_HANDLES = [
  'goBackContainer',
  'goBackButton',
  'goBackButtonIcon',
  'goBackButtonText',
] as const

const GoBackButton: FC<InjectedIntlProps> = observer(({ intl }) => {
  const { handles } = useCssHandles(CSS_HANDLES)
  const {
    departmentActive,
    config: { orientation },
    setDepartmentActive,
  } = megaMenuState

  const goBack = () => {
    setDepartmentActive(null)
  }

  return orientation === 'vertical' && departmentActive ? (
    <div className={handles.goBackContainer}>
      <button
        className={classNames(handles.goBackButton, 'flex items-center')}
        onClick={goBack}
      >
        <IconCaret
          className={handles.goBackButtonIcon}
          orientation="left"
          size="18"
        />
        <span className={classNames(handles.goBackButtonText, 'ml3')}>
          {formatIOMessage({ id: messages.goBackButtonTitle.id, intl })}
        </span>
      </button>
    </div>
  ) : null
})

export default injectIntl(GoBackButton)
