import React from 'react'
import styled, { keyframes } from 'styled-components'
import PanIcon from './PanIcon'
import ArcaneIcon from './ArcaneIcon'
import { SpinnerProps } from './types'

const Container = styled.div`
  position: relative;
`

const RotatingArcaneIcon = styled(ArcaneIcon)`
  position: absolute;
  top: 0;
  left: 0;
`

const Spinner: React.FC<SpinnerProps> = ({ size = 128 }) => {
  return (
    <Container>
      <RotatingArcaneIcon width={`${size * 0.5}px`} />
    </Container>
  )
}

export default Spinner
