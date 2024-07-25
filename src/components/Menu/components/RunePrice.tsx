import React from 'react'
import styled from 'styled-components'
import { ArcaneRoundIcon } from '../../Svg'
import Text from '../../Text/Text'
import Skeleton from '../../Skeleton/Skeleton'

interface Props {
  runePriceUsd?: number
}

const PriceLink = styled.a`
  display: flex;
  align-items: center;
  svg {
    transition: transform 0.3s;
  }
  :hover {
    svg {
      transform: scale(1.2);
    }
  }
`

const RunePrice: React.FC<Props> = ({ runePriceUsd }) => {
  return runePriceUsd ? (
    <PriceLink href="https://info.arken.gg/token/0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82" target="_blank">
      <ArcaneRoundIcon width="24px" mr="8px" />
      <Text color="textSubtle" bold>{`$${runePriceUsd.toFixed(3)}`}</Text>
    </PriceLink>
  ) : (
    <Skeleton width={80} height={24} />
  )
}

export default React.memo(RunePrice)
