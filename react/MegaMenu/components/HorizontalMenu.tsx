import classNames from 'classnames'
import { observer } from 'mobx-react-lite'
import type { FC } from 'react'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import type { InjectedIntlProps } from 'react-intl'
import { injectIntl } from 'react-intl'
import Skeleton from 'react-loading-skeleton'
import { useCssHandles } from 'vtex.css-handles'
import { formatIOMessage } from 'vtex.native-types'

import { megaMenuState } from '../State'
import styles from '../styles.css'
import Item from './Item'
import Submenu from './Submenu'
import { BUTTON_ID } from './TriggerButton'

const CSS_HANDLES = [
  'menuContainer',
  'menuContainerNav',
  'menuItem',
  'submenuContainer',
] as const

const HorizontalMenu: FC<InjectedIntlProps> = observer(({ intl }) => {
  const { handles } = useCssHandles(CSS_HANDLES)
  const {
    isOpenMenu,
    departments,
    departmentActive,
    config: { title, defaultDepartmentActive },
    setDepartmentActive,
    openMenu,
  } = megaMenuState

  const departmentActiveHasCategories = !!departmentActive?.menu?.length
  const navRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (event: any) => {
      const isTriggerButton = event?.path?.find(
        (data: HTMLElement) => data.dataset?.id === BUTTON_ID
      )

      if (
        navRef.current &&
        !navRef.current.contains(event.target as Node) &&
        !isTriggerButton
      ) {
        openMenu(false)
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [openMenu]
  )

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true)

    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const defaultDepartment = departments.find(
      (x) =>
        x.name.toLowerCase().trim() ===
        defaultDepartmentActive?.toLowerCase().trim()
    )

    if (defaultDepartment) {
      setDepartmentActive(defaultDepartment)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultDepartmentActive])

  const departmentItems = useMemo(
    () =>
      departments
        .filter((j) => j.display)
        .map((d) => {
          const hasCategories = !!d.menu?.length

          return (
            <li
              className={classNames(
                handles.menuItem,
                d.id === departmentActive?.id && 'bg-black-05 vtex-active-menu'
              )}
              key={d.id}
              onMouseEnter={() => {
                setDepartmentActive(d)
              }}
            >
              <Item
                id={d.id}
                to={d.slug}
                iconId={d.icon}
                accordion={hasCategories}
                className={classNames('pv3 mh5', d.id === departmentActive?.id && 'vtex-active-menu-link')}
                style={d.styles}
                enableStyle={d.enableSty}
                closeMenu={openMenu}
              >
                {d.name}
              </Item>
            </li>
          )
        }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [departments, departmentActive]
  )

  const loaderBlocks = useMemo(() => {
    const blocks: JSX.Element[] = []

    for (let index = 1; index <= 4; index++) {
      blocks.push(
        <div className="lh-copy">
          <Skeleton height={20} />
          <Skeleton height={80} />
        </div>
      )
    }

    return blocks
  }, [])

  return isOpenMenu ? (
    <nav
      className={classNames(
        handles.menuContainerNav,
        'absolute left-0 bg-white bw1 bb b--muted-3 flex'
      )}
      ref={navRef}
    >
      <ul
        className={classNames(
          styles.menuContainer,
          'list ma0 pa0 pb3 br b--muted-4'
        )}
      >
        <h3 className="f4 fw7 c-on-base lh-copy ma0 pv5 ph5 vtex-mege-menu-header">
          {formatIOMessage({ id: title, intl })}
        </h3>
        {departments.length ? (
          departmentItems
        ) : (
          <div className="flex flex-column justify-center ph5 lh-copy">
            <Skeleton count={3} height={30} />
          </div>
        )}
      </ul>
      {departments.length ? (
        departmentActive &&
        departmentActiveHasCategories && (
          <div className={classNames(styles.submenuContainer, 'pa5 w-100')}>
            <Submenu closeMenu={openMenu} />
          </div>
        )
      ) : (
        <div className="w-100" style={{ overflow: 'auto' }}>
          <div className="w-30 mb4 ml4 mt5">
            <Skeleton height={30} />
          </div>
          <div className={classNames(styles.submenuList, 'mh4 mb5')}>
            {loaderBlocks}
          </div>
        </div>
      )}
    </nav>
  ) : null
})

export default injectIntl(HorizontalMenu)
