import * as React from 'react'

type Props = {
  className: string
}

const SvgComponent: React.FC<Props> = ({ className }) => {
  return (
    <svg width={27} height={34} viewBox="0 0 32 34" fill="none" className={className}>
      <circle id="White_circle" cx="16" cy="16" r="16" />
    </svg>
  )
}

export default SvgComponent
