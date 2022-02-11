import classNames from 'classnames'
import { observer } from 'mobx-react-lite'
import type { FC } from 'react'
import React from 'react'
import type { InjectedIntlProps } from 'react-intl'
import { injectIntl } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

// import { Icon } from 'vtex.store-icons'
import backarrow from '../../../assets/backarrow.svg'

import { megaMenuState } from '../State'

// const messages = defineMessages({
//   goBackButtonTitle: {
//     defaultMessage: '',
//     id: 'store/mega-menu.goBackButton.title',
//   },
// })

const CSS_HANDLES = [
  'goBackContainer',
  'goBackButton',
  'goBackButtonIcon',
  'goBackButtonText',
] as const

const GoBackButton: FC<InjectedIntlProps> = observer(({ }) => {
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
        <div className="vtex-drawer-icon">
          <img src={backarrow} alt="backarrow" />   
        </div>
        <span className={classNames(handles.goBackButtonText, 'ml3')}>
          {departmentActive.name}
        </span>
      </button>
    </div>
  ) : null
})

export default injectIntl(GoBackButton)
