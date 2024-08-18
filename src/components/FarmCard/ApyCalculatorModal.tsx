import React from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { Text, LinkExternal, Flex } from '~/ui'
import { Modal, useModal, InjectedModalProps } from '~/components/Modal'
import useI18n from '~/hooks/useI18n'
import { useTranslation } from 'react-i18next'
import { calculateRuneEarnedPerThousandDollars, apyModalRoi } from '~/utils/compoundApyHelpers'
import { useFarmStatus } from '~/hooks/useFarmStatus'
import { useRunePrice } from '~/state/hooks'

interface ApyCalculatorModalProps {
  onDismiss?: () => void
  lpLabel?: string
  apy?: BigNumber
  addLiquidityUrl?: string
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(4, auto);
  margin-bottom: 24px;
`

const GridItem = styled.div`
  margin-bottom: '10px';
`

const Description = styled(Text)`
  max-width: 320px;
  margin-bottom: 28px;
`

const ApyCalculatorModal: React.FC<ApyCalculatorModalProps> = ({ onDismiss, lpLabel, apy, addLiquidityUrl }) => {
  const { t } = useTranslation()
  const { currentFarmSymbol, nextFarmSymbol, currentFarmPaused } = useFarmStatus()
  const farmApy = apy.times(new BigNumber(100)).toNumber()
  const tokenPrice = useRunePrice(currentFarmSymbol)
  const oneThousandDollarsWorthOfRune = 1000 / tokenPrice.toNumber()

  const runeEarnedPerThousand1D = calculateRuneEarnedPerThousandDollars({ numberOfDays: 1, farmApy, tokenPrice })
  const runeEarnedPerThousand7D = calculateRuneEarnedPerThousandDollars({ numberOfDays: 7, farmApy, tokenPrice })
  const runeEarnedPerThousand30D = calculateRuneEarnedPerThousandDollars({ numberOfDays: 30, farmApy, tokenPrice })
  const runeEarnedPerThousand365D = calculateRuneEarnedPerThousandDollars({ numberOfDays: 365, farmApy, tokenPrice })

  return (
    <Modal title="ROI" onDismiss={onDismiss}>
      <Grid>
        <GridItem>
          <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase" mb="20px">
            {t('Timeframe')}
          </Text>
        </GridItem>
        <GridItem>
          <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase" mb="20px">
            {t('ROI')}
          </Text>
        </GridItem>
        <GridItem>
          <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase" mb="20px">
            {t(currentFarmSymbol + ' per $1000')}
          </Text>
        </GridItem>
        {/* 1 day row */}
        <GridItem>
          <Text>1d</Text>
        </GridItem>
        <GridItem>
          <Text>
            {apyModalRoi({ amountEarned: runeEarnedPerThousand1D, amountInvested: oneThousandDollarsWorthOfRune })}%
          </Text>
        </GridItem>
        <GridItem>
          <Text>{runeEarnedPerThousand1D}</Text>
        </GridItem>
        {/* 7 day row */}
        <GridItem>
          <Text>7d</Text>
        </GridItem>
        <GridItem>
          <Text>
            {apyModalRoi({ amountEarned: runeEarnedPerThousand7D, amountInvested: oneThousandDollarsWorthOfRune })}%
          </Text>
        </GridItem>
        <GridItem>
          <Text>{runeEarnedPerThousand7D}</Text>
        </GridItem>
        {/* 30 day row */}
        <GridItem>
          <Text>30d</Text>
        </GridItem>
        <GridItem>
          <Text>
            {apyModalRoi({ amountEarned: runeEarnedPerThousand30D, amountInvested: oneThousandDollarsWorthOfRune })}%
          </Text>
        </GridItem>
        <GridItem>
          <Text>{runeEarnedPerThousand30D}</Text>
        </GridItem>
        {/* 365 day / APY row */}
        <GridItem>
          <Text>365d (APY)</Text>
        </GridItem>
        <GridItem>
          <Text>
            {apyModalRoi({ amountEarned: runeEarnedPerThousand365D, amountInvested: oneThousandDollarsWorthOfRune })}%
          </Text>
        </GridItem>
        <GridItem>
          <Text>{runeEarnedPerThousand365D}</Text>
        </GridItem>
      </Grid>
      <Description fontSize="12px" color="textSubtle">
        {t(
          'Calculated based on current rates. Compounding 1x daily. Rates are estimates provided for your convenience only, and by no means represent guaranteed returns.'
        )}
      </Description>
      <Flex justifyContent="center">
        <LinkExternal href={addLiquidityUrl}>
          {t('Get')} {lpLabel}
        </LinkExternal>
      </Flex>
    </Modal>
  )
}

export default ApyCalculatorModal
