import React from 'react'
import styled from 'styled-components'
import useI18n from '~/hooks/useI18n'
import { useTranslation } from 'react-i18next'
import { LinkExternal, Text, Link } from '~/ui'
import { FarmWithStakedValue } from '~/components/FarmCard/FarmCard'
import getLiquidityUrlPathParts from '~/utils/getLiquidityUrlPathParts'

import HarvestAction from './HarvestAction'
import StakedAction from './StakedAction'
import Apr, { AprProps } from '../Apr'
import Multiplier, { MultiplierProps } from '../Multiplier'
import Liquidity, { LiquidityProps } from '../Liquidity'

export interface ActionPanelProps {
  apr: AprProps
  multiplier: MultiplierProps
  liquidity: LiquidityProps
  details: FarmWithStakedValue
}

const Container = styled.div`
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  width: 100%;
  flex-direction: column-reverse;
  padding: 24px;

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
    padding: 16px 32px;
  }
`

const StyledLinkExternal = styled(LinkExternal)`
  font-weight: 400;
  margin-left: 8px;
`

const StyledLink = styled(Link)`
  font-weight: 400;
  margin-top: 8px;
`

const StakeContainer = styled.div`
  color: ${({ theme }) => theme.colors.text};
  align-items: center;
  display: flex;
  justify-content: space-between;

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
  }
`

const TagsContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 25px;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-top: 16px;
  }

  > div {
    height: 24px;
    padding: 0 6px;
    font-size: 14px;
    margin-right: 4px;

    svg {
      width: 14px;
    }
  }
`

const ActionContainer = styled.div`
  display: flex;
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    align-items: center;
    flex-grow: 1;
    flex-basis: 0;
  }
`

const InfoContainer = styled.div`
  min-width: 200px;
`

const ValueContainer = styled.div`
  display: block;

  ${({ theme }) => theme.mediaQueries.lg} {
    display: none;
  }
`

const ValueWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 4px 0px;
`

const ActionPanel: React.FunctionComponent<ActionPanelProps> = ({ details, apr, multiplier, liquidity }) => {
  const farm = details

  const { t } = useTranslation()
  const { quoteTokenAdresses, quoteTokenSymbol, tokenAddresses, tokenSymbol, dual } = farm
  const lpLabel = farm.lpSymbol && farm.lpSymbol.toUpperCase().replace('PANRUNE', '')
  const liquidityUrlPathParts = getLiquidityUrlPathParts({ quoteTokenAdresses, quoteTokenSymbol, tokenAddresses })
  const lpAddress = farm.lpAddresses[process.env.REACT_APP_CHAIN_ID]
  const bsc = `https://bscscan.com/address/${lpAddress}`
  const info = `https://info.pancakeswap.finance/pair/${lpAddress}`

  return (
    <Container>
      <InfoContainer>
        <StakeContainer>
          Stake:
          {lpAddress?.toLowerCase() === '0x996dbbbb92fb273fb5e1c79f201d0cb9ac637bb8' ? (
            <StyledLinkExternal href={`https://dex.slime.finance/#/add/${liquidityUrlPathParts}`}>
              {lpLabel}
            </StyledLinkExternal>
          ) : (
            <StyledLinkExternal href={`https://arken.gg/swap/#/add/${liquidityUrlPathParts}`}>
              {lpLabel}
            </StyledLinkExternal>
          )}
        </StakeContainer>
        <StyledLink href={bsc} external>
          {t('BscScan')}
        </StyledLink>
        <StyledLink href={info} external>
          {t('Info site')}
        </StyledLink>
        <TagsContainer>
          {/* {isCommunityFarm ? <CommunityTag /> : <CoreTag />} */}
          {/* {dual ? <DualTag /> : null} */}
        </TagsContainer>
      </InfoContainer>
      <ValueContainer>
        <ValueWrapper>
          <Text>{t('APR')}</Text>
          <Apr {...apr} />
        </ValueWrapper>
        <ValueWrapper>
          <Text>{t('Multiplier')}</Text>
          <Multiplier {...multiplier} />
        </ValueWrapper>
        <ValueWrapper>
          <Text>{t('Liquidity')}</Text>
          <Liquidity {...liquidity} />
        </ValueWrapper>
      </ValueContainer>
      <ActionContainer>
        <HarvestAction {...farm} />
        <StakedAction {...farm} />
      </ActionContainer>
    </Container>
  )
}

export default ActionPanel
