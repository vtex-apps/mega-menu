import type { FC } from 'react'
import React, { useState } from 'react'
import { InputSearch } from 'vtex.styleguide'

import type { DataMenu, ResponseFilterFunction } from '../../shared'

interface SearchComponentProps {
  placeholder: string
  dataItems: DataMenu[]
  responseFilter: ResponseFilterFunction
}

const SearchComponent: FC<SearchComponentProps> = ({
  dataItems,
  responseFilter,
  placeholder,
}) => {
  const [valueSearch, setValueSearch] = useState('')

  const handleInputChange = (e: { target: HTMLInputElement }) => {
    const { value } = e.target

    const menuFilter: DataMenu[] = value
      ? dataItems.filter((dataMenu: DataMenu) =>
          dataMenu.name.toUpperCase().includes(value.toUpperCase())
        )
      : dataItems

    responseFilter(menuFilter)
    setValueSearch(value)
  }

  return (
    <div>
      <InputSearch
        placeholder={placeholder}
        value={valueSearch}
        size="regular"
        onChange={handleInputChange}
      />
    </div>
  )
}

export default SearchComponent
