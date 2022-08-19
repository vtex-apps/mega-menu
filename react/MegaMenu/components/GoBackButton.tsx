import classNames from 'classnames'
import { observer } from 'mobx-react-lite'
import type { FC } from 'react'
import { useQuery } from 'react-apollo'
import React, { useState, useEffect } from 'react'
import type { InjectedIntlProps } from 'react-intl'
import { defineMessages, injectIntl } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { formatIOMessage } from 'vtex.native-types'
import { IconCaret } from 'vtex.store-icons'

import GET_SETTINGS from '../../graphql/queries/getSettings.graphql'
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

  const [orientationMenu, setOrientationMenu] = useState('')

  const { data } = useQuery(GET_SETTINGS, {
    fetchPolicy: 'no-cache',
  })

  useEffect(() => {
    if (data) {
      if (data.settings && data.settings.length > 0) {
        setOrientationMenu(data.settings[0].orientation)
      } else {
        setOrientationMenu('horizontal')
      }
    }
  }, [data])

  return (orientation === 'vertical' || orientationMenu === 'vertical') &&
    departmentActive ? (
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
