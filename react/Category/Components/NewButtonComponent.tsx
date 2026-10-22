import type { FC } from 'react'
import React from 'react'
import { ButtonWithIcon } from 'vtex.styleguide'
import { useRuntime } from 'vtex.render-runtime'

import IconAdd from '../../icons/IconAdd'

const plus = <IconAdd />

interface NewButtonComponentProps {
  obj: {
    id?: string
    level?: string
    secondLevel?: string
  }
}

const NewButtonComponent: FC<NewButtonComponentProps> = (props) => {
  const { navigate } = useRuntime()
  const { obj } = props
  let statusButton = true

  if (obj.level === 'firstLevel') {
    statusButton = false
  } else if (obj.level === 'secondLevel' && obj.id !== '') {
    statusButton = false
  } else if (
    obj.level === 'thirdLevel' &&
    obj.id !== '' &&
    obj.secondLevel !== ''
  ) {
    statusButton = false
  }

  const newItem = () => {
    navigate({
      to: `/admin/app/mega-menu/form-menu/${encodeURIComponent(
        JSON.stringify({
          level: obj.level,
          type: 'new',
          id: obj.id,
          secondLevel: obj.secondLevel,
        })
      )}`,
    })
  }

  return (
    <div>
      <ButtonWithIcon
        icon={plus}
        variation="primary"
        onClick={newItem}
        block
        disabled={statusButton}
      >
        Add new
      </ButtonWithIcon>
    </div>
  )
}

export default NewButtonComponent
