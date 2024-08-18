import React from 'react'
import Svg from '../Svg/Svg'
import { SvgProps } from '../Svg/types'

const Icon: React.FC<SvgProps> = (props) => {
  return <img src="/images/spinner.gif" style={{ width: props.width, height: props.width }} />
}

export default Icon
