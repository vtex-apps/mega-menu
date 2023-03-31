import type { FC } from 'react'
import React, { useMemo } from 'react'
import { Icon } from 'vtex.store-icons'
import { EXPERIMENTAL_Select as VtexSelect } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'

import useStoreIconPack from './useStoreIconPack'

type Option = {
  label: JSX.Element
  value: string
}

export interface IconSelectorProps {
  onChange?: (iconId: string) => void
}

export const IconSelector: FC<IconSelectorProps> = ({ onChange }) => {
  const { IconPack, iconPackList } = useStoreIconPack()
  const options: Option[] = useMemo(() => {
    return iconPackList.map((icon) => ({
      label: (
        <div className="flex items-center">
          <span className="mr4 flex items-center">
            <Icon id={icon} />
          </span>
          <span> {icon}</span>
        </div>
      ),
      value: icon,
    }))
  }, [iconPackList])

  return (
    <div>
      {IconPack}
      <VtexSelect
        creatable
        multi={false}
        options={options}
        onChange={onChange}
        placeholder={
          <FormattedMessage id="admin/mega-menu.items.input3Form.placeholder" />
        }
      />
    </div>
  )
}
