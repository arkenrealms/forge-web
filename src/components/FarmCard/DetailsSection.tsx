import React from 'react'
import useI18n from '~/hooks/useI18n'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Text, Flex, Link, LinkExternal } from '~/ui'

export interface ExpandableSectionProps {
  bscScanAddress?: string
  removed?: boolean
  totalValueFormated?: string
  lpLabel?: string
  myShare?: string
  myValue?: string
  addLiquidityUrl?: string
}

const Wrapper = styled.div`
  margin-top: 24px;
`

const StyledLinkExternal = styled(LinkExternal)`
  text-decoration: none;
  font-weight: normal;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;

  svg {
    padding-left: 4px;
    height: 18px;
    width: auto;
    fill: ${({ theme }) => theme.colors.primary};
  }
`

const DetailsSection: React.FC<ExpandableSectionProps> = ({
  bscScanAddress,
  removed,
  totalValueFormated,
  lpLabel,
  myShare,
  myValue,
  addLiquidityUrl,
}) => {
  const { t } = useTranslation()

  return (
    <Wrapper>
      <Flex justifyContent="space-between">
        <Text>{t('Deposit')}:</Text>
        <StyledLinkExternal href={addLiquidityUrl}>{lpLabel}</StyledLinkExternal>
      </Flex>
      {myShare !== '0.000' ? (
        <Flex justifyContent="space-between">
          <Text>{t('My Share')}:</Text>
          <Text>{myShare} %</Text>
        </Flex>
      ) : null}
      {myValue !== '$0.00' ? (
        <Flex justifyContent="space-between">
          <Text>{t('My Value')}:</Text>
          <Text>{myValue}</Text>
        </Flex>
      ) : null}
      {!removed && (
        <Flex justifyContent="space-between">
          <Text>{t('Total Liquidity')}:</Text>
          <Text>{totalValueFormated}</Text>
        </Flex>
      )}
      <Flex justifyContent="flex-start">
        <Link external href={bscScanAddress} bold={false}>
          {t('View on BscScan')}
        </Link>
      </Flex>
    </Wrapper>
  )
}

export default DetailsSection
