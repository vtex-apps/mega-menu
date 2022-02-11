import classNames from 'classnames'
import { observer } from 'mobx-react-lite'
import type { FC } from 'react'
import React, { useMemo } from 'react'
import type { InjectedIntlProps } from 'react-intl'
import { injectIntl } from 'react-intl'
import Skeleton from 'react-loading-skeleton'
import { useCssHandles } from 'vtex.css-handles'



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
  'departmentsTitle'
] as const

const VerticalMenu: FC<VerticalMenuProps> = observer(() => {
  const { handles } = useCssHandles(CSS_HANDLES)
  const { departments, departmentActive, setDepartmentActive } =
    megaMenuState

  const departmentActiveHasCategories = !!departmentActive?.menu?.length

  

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
          style: d.styles,
          enableStyle: d.enableSty,
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
        <h3
          className={classNames(
            handles.departmentsTitle,
            'f4 fw7 c-on-base mv5 lh-copy ph5'
          )}
        >
          Products
        </h3>
        <ul className={classNames(handles.menuContainerVertical, 'list pa0')}>
          {departments.length ? (
            departmentItems
          ) : (
            <div className="flex flex-column justify-center ph5 lh-copy">
              <Skeleton count={4} height={40} />
            </div>
          )}
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
