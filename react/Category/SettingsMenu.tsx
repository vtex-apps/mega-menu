import type { InjectedIntlProps } from 'react-intl'
import type { FC } from 'react'
import React, { useState, useEffect } from 'react'
import { injectIntl } from 'react-intl'
import { ModalDialog, Toggle, Spinner } from 'vtex.styleguide'
import { useQuery, useMutation } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'

import GET_SETTINGS from '../graphql/queries/getSettings.graphql'
import CREATE_EDIT_SETTINGS from '../graphql/mutations/createEditSettings.graphql'

interface SettingsMenuProps {
  showSettings: boolean
  setShowSettings: (v: boolean) => void
}

const SettingsMenu: FC<SettingsMenuProps & InjectedIntlProps> = (props) => {
  const [orientation, setOrientation] = useState(true)
  const { loading, data } = useQuery(GET_SETTINGS, {
    fetchPolicy: 'no-cache',
  })

  const { account } = useRuntime()

  const [settingsInput, { data: dataSettings }] = useMutation(
    CREATE_EDIT_SETTINGS,
    {
      fetchPolicy: 'no-cache',
    }
  )

  const addSettings = () => {
    settingsInput({
      variables: {
        settingsInput: {
          idMenu: account,
          orientation: orientation ? 'horizontal' : 'vertical',
        },
      },
    })
  }

  useEffect(() => {
    if (data) {
      data.settings.length > 0 &&
        setOrientation(data.settings[0].orientation === 'horizontal')
    }
  }, [data])

  useEffect(() => {
    if (dataSettings) {
      props.setShowSettings(!props.showSettings)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSettings])

  return (
    <ModalDialog
      centered
      loading={false}
      confirmation={{
        label: 'Confirm',
        isDangerous: true,
        onClick: () => addSettings(),
      }}
      cancelation={{
        label: 'Close',
        onClick: () => props.setShowSettings(!props.showSettings),
      }}
      isOpen
      onClose={() => props.setShowSettings(!props.showSettings)}
    >
      <div className="">
        <p>
          Change these options with caution because you can affect the
          appearance of the menu in the store
        </p>
        {!loading ? (
          <div>
            <p className="mt7">Orientation (Horizontal / Vertical)</p>
            <Toggle
              label={orientation ? 'Horizontal' : 'Vertical'}
              checked={orientation}
              id="orientation"
              onChange={() => setOrientation(!orientation)}
            />
          </div>
        ) : (
          <div className="flex justify-center">
            <Spinner />
          </div>
        )}
      </div>
    </ModalDialog>
  )
}

export default injectIntl(SettingsMenu)
