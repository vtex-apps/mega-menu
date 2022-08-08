import type { FC } from 'react'
import React, { useState, useEffect } from 'react'
import { Dropdown } from 'vtex.styleguide'
import { useQuery } from 'react-apollo'
import { formatIOMessage } from 'vtex.native-types'
import type { InjectedIntlProps } from 'react-intl'
import { injectIntl, defineMessages } from 'react-intl'

import GETBINDINGS from '../../graphql/queries/getBindings.graphql'
import type { BindingChangeFunction } from '../../shared'

interface BindingComponentProps {
  selectedBinding: string
  onBindingChange: BindingChangeFunction
}

interface BindingOptionsBody {
  label: string
  value: string
}

interface Binding {
  canonicalBaseAddress: string
  id: string
}

const messages = defineMessages({
  placeholder: {
    defaultMessage: '',
    id: 'admin/mega-menu.items.bindingsPlaceholder',
  },
  allBindings: {
    defaultMessage: 'All Bindings',
    id: 'admin/mega-menu.items.allBindings',
  },
})

const BindingSelector: FC<InjectedIntlProps & BindingComponentProps> = ({
  intl,
  selectedBinding = 'all',
  onBindingChange,
}) => {
  const [bindingOptions, setBindingOptions] = useState<BindingOptionsBody[]>([])

  const defaultBindings: BindingOptionsBody[] = [
    {
      label: formatIOMessage({
        id: messages.allBindings.id,
        intl,
      }).toString(),
      value: 'all',
    },
  ]

  const { data } = useQuery(GETBINDINGS)

  useEffect(() => {
    if (!data?.tenantInfo?.bindings.length) return
    const options: BindingOptionsBody[] = defaultBindings

    data.tenantInfo.bindings.forEach((bindingOption: Binding) => {
      options.push({
        label: bindingOption.canonicalBaseAddress,
        value: bindingOption.id,
      })
    })
    setBindingOptions(options)
  }, [data]) // eslint-disable-line react-hooks/exhaustive-deps

  const placeholder = formatIOMessage({
    id: messages.placeholder.id,
    intl,
  }).toString()

  return (
    <div>
      <Dropdown
        label={formatIOMessage({
          id: 'admin/mega-menu.items.input5Form',
          intl,
        })}
        options={bindingOptions}
        value={selectedBinding}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          onBindingChange(e.target.value)
        }}
        placeholder={placeholder}
      />
    </div>
  )
}

export default injectIntl(BindingSelector)
