import React from 'react'
import { ButtonWithIcon } from 'vtex.styleguide'

import IconDelete from '../../icons/IconDelete'

const UploadedBanner = ({ banner, onHandleImageReset, textlabel }) => {
  return (
    <>
      <div className="flex items-center">
        <p className="mb2">{textlabel}</p>
      </div>
      <div className="flex">
        <img src={banner} alt="" width="50%" />

        <div className="pl5 ">
          <ButtonWithIcon
            icon={<IconDelete />}
            variation="danger"
            onClick={onHandleImageReset}
          />
        </div>
      </div>
    </>
  )
}

export default UploadedBanner
