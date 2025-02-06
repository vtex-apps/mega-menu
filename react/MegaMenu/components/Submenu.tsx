/* eslint-disable prettier/prettier */
import classNames from 'classnames'
import { observer } from 'mobx-react-lite'
import type { FC } from 'react'
import React, { useMemo, useState } from 'react'
import type { InjectedIntlProps } from 'react-intl'
import { defineMessages, injectIntl } from 'react-intl'
import { applyModifiers, useCssHandles } from 'vtex.css-handles'
import { formatIOMessage } from 'vtex.native-types'
import { ExtensionPoint, Link } from 'vtex.render-runtime'
import { Collapsible } from 'vtex.styleguide'

import type { MenuItem } from '../../shared'
import { megaMenuState } from '../State'
import styles from '../styles.css'
import Item from './Item'

const CSS_HANDLES = [
  'submenuContainer',
  'submenuList',
  'submenuListVertical',
  'submenuItem',
  'submenuItemVertical',
  'collapsibleContent',
  'collapsibleHeaderText',
  'seeAllLinkContainer',
  'seeAllLink',
  'submenuContainerTitle',
  'hideArrow',
] as const

const messages = defineMessages({
  seeAllTitle: {
    defaultMessage: '',
    id: 'store/mega-menu.submenu.seeAllButton.title',
  },
})

export type ItemProps = InjectedIntlProps & {
  closeMenu?: (open: boolean) => void
  openOnly?: string
}

const Submenu: FC<ItemProps> = observer((props) => {
  const { intl, closeMenu, openOnly } = props
  const { handles } = useCssHandles(CSS_HANDLES)
  const { departmentActive, config, getCategories } = megaMenuState
  const { orientation } = config

  const [collapsibleStates, setCollapsibleStates] = useState<
    Record<string, boolean>
  >({})

  const [showBtnCat, setShowBtnCat] = useState(false)

  const seeAllLink = (to?: string, level = 1, className?: string) => (
    <div
      className={classNames(
        handles.seeAllLinkContainer,
        !className && level === 1 && 'bb b--light-gray pv5 ph5 w-100',
        !className && level > 1 && 'mt4 mb6 t-body',
        className
      )}
    >
      <Link
        to={to ?? '#'}
        className={classNames(
          handles.seeAllLink,
          'link underline fw7 c-on-base'
        )}
        onClick={() => {
          if (closeMenu) closeMenu(false)
        }}
      >
        {formatIOMessage({ id: messages.seeAllTitle.id, intl })}
      </Link>
    </div>
  )

  const subCategories = (items: MenuItem[]) => {
    return items
      .filter((v) => v.display)
      .map((x) => (
        <div key={x.id} className={classNames(handles.submenuItem, 'mt3')}>
          <Item
            to={x.slug}
            iconId={x.icon}
            level={3}
            style={x.styles}
            enableStyle={x.enableSty}
            closeMenu={closeMenu}
          >
            {x.name}
          </Item>
        </div>
      ))
  }

  const items = useMemo(
    () => {
      if (departmentActive?.menu) {
        if (departmentActive?.menu.length > 1) {
          setShowBtnCat(true)
        } else {
          setShowBtnCat(false)
        }
      } else {
        setShowBtnCat(false)
      }

      const categories = getCategories()

      return categories
        .filter((j) => j.display)
        .map((category, i) => {
          const subcategories = category.menu?.length
            ? subCategories(category.menu)
            : []

          return (
            <div
              key={category.id}
              style={{
                display:
                  departmentActive && (departmentActive?.menu ?? []).length > 0
                    ? 'block'
                    : 'none',
              }}
              className={classNames(
                applyModifiers(
                  orientation === 'horizontal' && openOnly === 'horizontal'
                    ? styles.submenuItem
                    : handles.submenuItemVertical,
                  collapsibleStates[category.id] ? 'isOpen' : 'isClosed'
                ),
                orientation === 'vertical' &&
                  'c-on-base bb b--light-gray mv0 ph5',
                orientation === 'vertical' && i === 0 && 'bt',
                collapsibleStates[category.id] && 'bg-near-white'
              )}
            >
              {orientation === 'horizontal' && openOnly === 'horizontal' ? (
                <>
                  <Item
                    to={category.slug}
                    iconId={category.icon}
                    level={2}
                    style={category.styles}
                    isTitle
                    enableStyle={category.enableSty}
                    closeMenu={closeMenu}
                  >
                    {category.name}
                  </Item>

                  {!!subcategories.length && subcategories}
                  {subcategories.length > 1 ? (
                    seeAllLink(category.slug, 2)
                  ) : (
                    <div />
                  )}
                </>
              ) : (
                <div
                  className={
                    category.menu?.length ? '' : classNames(handles.hideArrow)
                  }
                >
                  <Collapsible
                    header={
                      <p
                        className={classNames(
                          handles.collapsibleHeaderText,
                          collapsibleStates[category.id] && 'fw7'
                        )}
                      >
                        {category.name}
                      </p>
                    }
                    align="right"
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onClick={(e: any) => {
                      if (subcategories.length >= 1) {
                        setCollapsibleStates({
                          ...collapsibleStates,
                          [category.id]: e.target.isOpen,
                        })
                      } else {
                        window.location.assign(`${category.slug}`)
                        if (closeMenu) closeMenu(false)
                      }
                    }}
                    isOpen={collapsibleStates[category.id]}
                    caretColor={`${
                      collapsibleStates[category.id] ? 'base' : 'muted'
                    }`}
                  >
                    {!!subcategories.length && (
                      <div className={handles.collapsibleContent}>
                        {subcategories}
                      </div>
                    )}

                    {subcategories.length >= 0 ? (
                      seeAllLink(category.slug, 2)
                    ) : (
                      // eslint-disable-next-line jsx-a11y/anchor-has-content
                      <a href={category.slug} />
                    )}
                  </Collapsible>
                </div>
              )}
            </div>
          )
        })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [departmentActive, collapsibleStates]
  )

  return (
    <div style={{ display: departmentActive ? 'block' : 'none' }}>
      <h3
        className={classNames(
          handles.submenuContainerTitle,
          'f4 fw7 c-on-base lh-copy ma0 flex items-center',
          orientation === 'horizontal' && 'mb6',
          orientation === 'vertical' && 'pv5 ph5'
        )}
      >
        {departmentActive?.name}
        {orientation === 'horizontal' && (
          <div style={{ display: showBtnCat ? 'block' : 'none' }}>
            {seeAllLink(departmentActive?.slug, 1, 't-small ml7')}
          </div>
        )}
      </h3>

      <div
        className={classNames(
          orientation === 'horizontal' && styles.submenuList,
          orientation === 'vertical' && handles.submenuListVertical
        )}
      >
        {orientation === 'horizontal' ? (
          <>
            <ExtensionPoint id="before-menu" /> {items}{' '}
            <ExtensionPoint id="after-menu" />
          </>
        ) : (
          <>
            {items}
            {showBtnCat ? seeAllLink(departmentActive?.slug) : <div />}
          </>
        )}
      </div>
    </div>
  )
})

export default injectIntl(Submenu)
