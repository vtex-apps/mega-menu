import type { FC } from 'react'
import React from 'react'

interface ColorIcon {
  color: string
}
const IconDown: FC<ColorIcon> = (props) => {
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
          d="M374.108,373.328c-7.829-7.792-20.492-7.762-28.284,0.067L276,443.557V20c0-11.046-8.954-20-20-20    c-11.046,0-20,8.954-20,20v423.558l-69.824-70.164c-7.792-7.829-20.455-7.859-28.284-0.067c-7.83,7.793-7.859,20.456-0.068,28.285    l104,104.504c0.006,0.007,0.013,0.012,0.019,0.018c7.792,7.809,20.496,7.834,28.314,0.001c0.006-0.007,0.013-0.012,0.019-0.018    l104-104.504C381.966,393.785,381.939,381.121,374.108,373.328z"
          fill={props.color}
          data-original="#000000"
          className=""
        />
      </g>
    </svg>
  )
}

export default IconDown
