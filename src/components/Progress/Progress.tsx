import React from 'react'
import StyledProgress, { Bar } from './StyledProgress'
import ProgressCharacterWrapper from './ProgressCharacterWrapper'
import { ProgressCharacter } from '../Svg'
import { ProgressProps } from './types'

const stepGuard = (step: number) => {
  if (step < 0) {
    return 0
  }

  if (step > 100) {
    return 100
  }

  return step
}

const Progress: React.FC<ProgressProps> = ({
  primaryStep = 0,
  secondaryStep = null,
  showProgressCharacter = false,
}) => {
  return (
    <StyledProgress>
      {showProgressCharacter && (
        <ProgressCharacterWrapper style={{ left: `${stepGuard(primaryStep)}%` }}>
          <ProgressCharacter />
        </ProgressCharacterWrapper>
      )}
      <Bar primary style={{ width: `${stepGuard(primaryStep)}%` }} />
      {secondaryStep ? <Bar style={{ width: `${stepGuard(secondaryStep)}%` }} /> : null}
    </StyledProgress>
  )
}

export default Progress
