import classNames from 'classnames'
import { observer } from 'mobx-react-lite'
import type { FC } from 'react'
import React from 'react'
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
      'fw6 c-on-base': isTitle,
      pointer: !disabled && !isTitle,
    }
  )

  const iconTestId = `icon-${iconPosition}`
  const iconComponent = iconProps ? (
    <span className={`${handles.styledLinkIcon} mh2`} data-testid={iconTestId}>
      <Icon {...iconProps} />
    </span>
  ) : null

  const content = (
    <div
      className={classNames(
        handles.styledLinkContent,
        'flex justify-between',
        iconPosition === 'left' && iconComponent && 'nowrap'
      )}
    >
      {iconPosition === 'left' && iconComponent}
      {children}
      {iconPosition === 'right' && iconComponent}
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
        <Link to={to} {...rest} className={linkClassNames}>
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
  onClick?: () => void
}

export default Item
