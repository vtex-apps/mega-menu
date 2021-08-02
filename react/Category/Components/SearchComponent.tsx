import type { FC } from 'react'
import React, { useState } from 'react'
import { InputSearch } from 'vtex.styleguide'

import type { DataMenu, ResponseFilterFunction } from '../../shared'

interface SearchComponentProps {
  placeholder: string
  dataItems: DataMenu[]
  responseFilter: ResponseFilterFunction
}

const SearchComponent: FC<SearchComponentProps> = (props) => {
  const [valueSearch, setValueSearch] = useState('')

  const filterItems = (e: { target: HTMLInputElement }) => {
    const { value } = e.target

    setValueSearch(value)
    const menuFilter: DataMenu[] = value
      ? props.dataItems.filter((dataMenu: DataMenu) =>
          dataMenu.name.toUpperCase().includes(value.toUpperCase())
        )
      : []

    props.responseFilter(menuFilter)
  }

  return (
    <div>
      <InputSearch
        placeholder={props.placeholder}
        value={valueSearch}
        size="regular"
        onChange={filterItems}
      />
    </div>
  )
}

export default SearchComponent
