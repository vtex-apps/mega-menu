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

  const filterItems = (value: { target: HTMLInputElement }) => {
    setValueSearch(value.target.value)
    let menuFilter: DataMenu[] = []

    if (value.target.value) {
      menuFilter = props.dataItems.filter((x: DataMenu) =>
        x.name.includes(value.target.value)
      )
    } else {
      menuFilter = []
    }

    props.responseFilter(menuFilter)
  }

  return (
    <div>
      <InputSearch
        placeholder={props.placeholder}
        value={valueSearch}
        size="regular"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => filterItems(e)}
      />
    </div>
  )
}

export default SearchComponent
