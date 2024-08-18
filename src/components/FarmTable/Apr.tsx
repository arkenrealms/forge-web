import React from 'react'
import styled from 'styled-components'
import ApyButton from '~/components/FarmCard/ApyButton'
import { Address, QuoteToken } from '~/config/constants/types'
import BigNumber from 'bignumber.js'
import { BASE_ADD_LIQUIDITY_URL } from '~/config'
import getLiquidityUrlPathParts from '~/utils/getLiquidityUrlPathParts'
import useI18n from '~/hooks/useI18n'
import { useTranslation } from 'react-i18next'

export interface AprProps {
  value: number
  multiplier: string
  lpLabel: string
  quoteTokenAdresses: Address
  quoteTokenSymbol: QuoteToken
  tokenAddresses: Address
  tokenPrice: BigNumber
  originalValue: BigNumber
  hideButton?: boolean
}

const Container = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};

  button {
    width: 20px;
    height: 20px;

    svg {
      path {
        fill: ${({ theme }) => theme.colors.textSubtle};
      }
    }
  }
`

const AprWrapper = styled.div`
  min-width: 60px;
  text-align: left;
`

const Apr: React.FC<AprProps> = ({
  value,
  lpLabel,
  quoteTokenAdresses,
  quoteTokenSymbol,
  tokenAddresses,
  originalValue,
  hideButton = false,
}) => {
  const { t } = useTranslation()
  const displayApr = value
    ? `${value.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).slice(1)}%`
    : t('Loading...')
  const liquidityUrlPathParts = getLiquidityUrlPathParts({ quoteTokenAdresses, quoteTokenSymbol, tokenAddresses })
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`
  return (
    <Container>
      <AprWrapper>{displayApr}</AprWrapper>
      {!hideButton && <ApyButton lpLabel={lpLabel} apy={originalValue} addLiquidityUrl={addLiquidityUrl} />}
    </Container>
  )
}

export default Apr
