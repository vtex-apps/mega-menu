import classNames from 'classnames'
import { observer } from 'mobx-react-lite'
import React, { useMemo } from 'react'
import type { FC } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { Link } from 'vtex.render-runtime'
import { Icon, IconCaret } from 'vtex.store-icons'

import type { IconProps } from '../../shared'
import { megaMenuState } from '../State'

const CSS_HANDLES = [
  'styledLink',
  'styledLinkIcon',
  'styledLinkContainer',
  'styledLinkContent',
  'styledLinkText',
  'accordionIconContainer',
  'accordionIcon',
] as const

const defaultTypography: Record<number, string> = {
  1: 't-body',
  2: 't-body',
  3: 't-body',
}

const Item: FC<ItemProps> = observer((props) => {
  const { handles, withModifiers } = useCssHandles(CSS_HANDLES)
  const { departmentActive } = megaMenuState
  const {
    id,
    to,
    level = 1,
    isTitle,
    disabled,
    accordion,
    iconId,
    iconProps,
    iconPosition,
    typography = defaultTypography[level],
    tabIndex,
    className,
    onClick,
    children,
    style,
    enableStyle,
    closeMenu,
    ...rest
  } = props

  // Only for level 1
  const isOpen = departmentActive?.id === id
  const hasLink = to && to !== '#'

  const linkClassNames = classNames(
    handles.styledLink,
    'no-underline c-on-base w-100 pa0',
    {
      [typography]: true,
      'fw6 white': isTitle,
      pointer: !disabled && !isTitle,
    }
  )

  const stylesItem = useMemo(() => {
    if (style) {
      let tempStyle: Record<string, string> = {}

      try {
        tempStyle = JSON.parse(style)
      } catch (e) {
        return {}
      }

      return Object.entries(tempStyle).reduce((obj, [key, value]) => {
        const formatKey = key.replace(/-([a-z])/g, (g) => {
          return g[1].toUpperCase()
        })

        return {
          ...obj,
          [formatKey]: value,
        }
      }, {})
    }

    return {}
  }, [style])

  const iconTestId = `icon-${iconPosition}`
  const iconComponent =
    iconProps || iconId ? (
      <span
        className={classNames(
          handles.styledLinkIcon,
          'flex items-center',
          iconPosition === 'left' ? 'mr3' : 'ml3'
        )}
        data-testid={iconTestId}
      >
        <Icon {...{ ...iconProps, id: iconProps?.id ?? iconId }} />
      </span>
    ) : null

  const content = (
    <div
      className={classNames(handles.styledLinkContent, 'flex justify-between')}
    >
      
      <div
        className={classNames(
          handles.styledLinkText,
          `flex justify-between items-center ${departmentActive ? 'vtex-active-link' : null}`,
          iconPosition === 'left' && iconComponent && 'nowrap'
        )}
        {...(enableStyle && { style: stylesItem })}
      >
        {iconPosition === 'left' && iconComponent}
        {children}
        {iconPosition === 'right' && iconComponent}
      </div>
      {accordion && (
        <div
          className={`${withModifiers(
            'accordionIconContainer',
            isOpen ? 'isOpen' : 'isClosed'
          )} ml1 c-muted-3`}
        >
          <IconCaret classNames={handles.accordionIcon} orientation="right" />
        </div>
      )}
    </div>
  )

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      className={classNames(handles.styledLinkContainer, className)}
      onClick={onClick}
    >
      {disabled || !hasLink ? (
        onClick ? (
          <button className={linkClassNames}>{content}</button>
        ) : (
          <span className={linkClassNames}>{content}</span>
        )
      ) : (
        <Link
          to={to}
          {...rest}
          className={linkClassNames}
          onClick={() => {
            if (closeMenu) closeMenu(false)
          }}
        >
          {content}
        </Link>
      )}
    </div>
  )
})

Item.defaultProps = {
  iconPosition: 'left',
}

export interface ItemProps {
  id?: string
  level?: number
  to?: string
  isTitle?: boolean
  disabled?: boolean
  accordion?: boolean
  typography?: string
  iconId?: string
  iconProps?: IconProps
  iconPosition?: 'left' | 'right'
  tabIndex?: number
  className?: string
  style?: string
  enableStyle?: boolean
  onClick?: () => void
  closeMenu?: (open: boolean) => void
}

export default Item
