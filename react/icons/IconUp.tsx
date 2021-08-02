import type { FC } from 'react'
import React from 'react'

interface ColorIcon {
  color: string
}

const IconUp: FC<ColorIcon> = (props) => {
  return (
    <svg
      version="1.1"
      width="20"
      height="20"
      x="0"
      y="0"
      viewBox="0 0 528.899 528.899"
    >
      <g>
        <path
          d="M374.176,110.386l-104-104.504c-0.006-0.006-0.013-0.011-0.019-0.018c-7.818-7.832-20.522-7.807-28.314,0.002    c-0.006,0.006-0.013,0.011-0.019,0.018l-104,104.504c-7.791,7.829-7.762,20.493,0.068,28.285    c7.829,7.792,20.492,7.762,28.284-0.067L236,68.442V492c0,11.046,8.954,20,20,20c11.046,0,20-8.954,20-20V68.442l69.824,70.162    c7.792,7.829,20.455,7.859,28.284,0.067C381.939,130.878,381.966,118.214,374.176,110.386z"
          fill={props.color}
          data-original="#000000"
          className=""
        />
      </g>
    </svg>
  )
}

export default IconUp
