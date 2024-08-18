import React from 'react'
import styled from 'styled-components'
import { Card, CardBody, Heading, Skeleton, Text } from '~/ui'
import useI18n from '~/hooks/useI18n'
import { useTranslation } from 'react-i18next'
import { useGetStats } from '~/hooks/api'
import { useRunePrice, useTotalValue } from '~/state/hooks'
import useCache from '~/hooks/useCache'
import { safeRuneList } from '~/config'

const StyledTotalValueLockedCard = styled.div`
  // align-items: center;
  // display: flex;
  // flex: 1;
`

const TotalValueLockedCard = () => {
  const { t } = useTranslation()
  const cache = useCache()
  const runes = [...safeRuneList]
  return (
    <StyledTotalValueLockedCard>
      {/* <CardBody> */}
      {/* <br />
        <br />
        <Heading size="lg" mb="24px">
          {t('Prices')}
        </Heading> */}
      {runes.map((rune) => {
        if (!cache.runes[rune]) return null
        const { price } = cache.runes[rune]

        return (
          <div key={rune}>
            <Text color="textSubtle" mb="5px">
              <strong>{t(rune.toUpperCase())}</strong> {`$${price.toFixed(2)}`}
            </Text>
          </div>
        )
      })}
      {/* </CardBody> */}
    </StyledTotalValueLockedCard>
  )
}

export default TotalValueLockedCard
