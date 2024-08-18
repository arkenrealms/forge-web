import React from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { RaidInfo } from '~/components/RaidInfo'
import { useMasterchef } from '~/hooks/useContract'
import { useFarmStatus } from '~/hooks/useFarmStatus'
import { Card, CardBody, Heading } from '~/ui'

const Container = styled.div``

export const FarmHeader: React.FC<{ title: string }> = ({ title }) => {
  const { contract: masterChefContract, setChefKey, chefKey } = useMasterchef()
  const { t } = useTranslation()
  const { currentFarmSymbol, nextFarmSymbol, currentFarmPending, currentFarmPaused } = useFarmStatus()

  return (
    <Container>
      <Card style={{ width: '100%' }}>
        <Heading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
          {t('Raid ' + title)}
        </Heading>
        <hr />
        <CardBody>
          <div
            css={css`
              ${({ theme }) => theme.mediaQueries.lg} {
                float: left;
              }
              background: url('/images/team/kevin-anime.png') 0px 100% no-repeat;
              width: 200px;
              height: 200px;
              margin-bottom: 20px;
              background-size: contain;
              margin-right: 20px;
            `}></div>
          <p>
            {currentFarmPending
              ? `Farm getting ready `
              : currentFarmPaused
              ? `Farm has paused or ended`
              : `Currently farming ${currentFarmSymbol} runes. To battle!`}
          </p>
          <RaidInfo />
        </CardBody>
      </Card>
      <br />
      {/* <Button
        onClick={() => {
          setShowOldFarms(!showOldFarms)
        }}
      >
        {showOldFarms ? 'Hide' : 'Show'} Old {title}
      </Button>
      <br />
      <br />
      {showOldFarms ? (
        <>
          <Flex flexDirection="column" alignItems="center" justifyContent="center">
            <ToggleWrapper>
              <ButtonMenu
                activeIndex={currentMasterchefIndex}
                scale="md"
                onItemClick={(index) => {
                  setCurrentMasterchefIndex(index)
                  setChefKey(CHEF_MAP[index])
                }}
              >
                {CHEF_MAP.map((farmSymbol) => (
                  <ButtonMenuItem key={farmSymbol}>
                    {farmSymbol}{' '}
                    {farmSymbol !== CURRENT_FARM_SYMBOL ? <FarmClosedIcon url="/images/closed-icon.png" /> : null}
                  </ButtonMenuItem>
                ))}
              </ButtonMenu>
            </ToggleWrapper>
          </Flex>
          <br />
          <br />
        </>
      ) : null} */}
    </Container>
  )
}

export default FarmHeader
