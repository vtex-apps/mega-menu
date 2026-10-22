import classNames from 'classnames'
import { observer } from 'mobx-react-lite'
import type { FC } from 'react'
import React, { useMemo } from 'react'
import type { InjectedIntlProps } from 'react-intl'
import { injectIntl } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { formatIOMessage } from 'vtex.native-types'

import { megaMenuState } from '../State'
import type { ItemProps } from './Item'
import Item from './Item'
import Submenu from './Submenu'

const CSS_HANDLES = [
  'menuContainerVertical',
  'departmentsContainer',
  'menuContainerNavVertical',
  'menuItemVertical',
  'submenuContainerVertical',
] as const

const VerticalMenu: FC<VerticalMenuProps> = observer(({ intl }) => {
  const { handles } = useCssHandles(CSS_HANDLES)
  const { departments, departmentActive, config, setDepartmentActive } =
    megaMenuState

  const departmentActiveHasCategories = !!departmentActive?.menu?.length

  const { title } = config

  const departmentItems = useMemo(
    () =>
      departments.map((d, i) => {
        const hasCategories = !!d.menu?.length

        const openDepartment = () => {
          setDepartmentActive(d)
        }

        const itemProps: ItemProps = {
          id: d.id,
          iconId: d.icon,
          accordion: hasCategories,
          tabIndex: i,
          onClick: openDepartment,
          ...(!hasCategories && { to: d.slug }),
        }

        return (
          <li
            className={classNames(
              handles.menuItemVertical,
              'bb b--light-gray',
              {
                bt: i === 0,
              }
            )}
            key={d.id}
          >
            <Item className={classNames('pv5 mh5')} {...itemProps}>
              {d.name}
            </Item>
          </li>
        )
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [departments]
  )

  return (
    <nav className={classNames(handles.menuContainerNavVertical, 'w-100')}>
      <div
        className={classNames(handles.departmentsContainer, {
          dn: !!departmentActive,
        })}
      >
        <h3 className="f4 fw7 c-on-base mv5 lh-copy ph5">
          {formatIOMessage({ id: title, intl })}
        </h3>
        <ul className={classNames(handles.menuContainerVertical, 'list pa0')}>
          {departmentItems}
        </ul>
      </div>
      {departmentActive && departmentActiveHasCategories && (
        <div
          className={classNames(
            handles.submenuContainerVertical,
            'bg-base w-100'
          )}
        >
          <Submenu />
        </div>
      )}
    </nav>
  )
})

type VerticalMenuProps = InjectedIntlProps

export default injectIntl(VerticalMenu)
