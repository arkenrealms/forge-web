import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import CardHeader from '~/components/account/CardHeader'
import Collectibles from '~/components/account/Collectibles'
import EditProfileAvatar from '~/components/account/EditProfileAvatar'
import AchievementsList from '~/components/AchievementsList'
import useMatchBreakpoints from '~/hooks/useMatchBreakpoints'
import { useProfile } from '~/state/hooks'
import { Button, Card, CardBody, Flex, Heading, Text } from '~/ui'
// import WinCard from '~/views/Dashboard/components/WinCard'
import { NavLink } from 'react-router-dom'
import Inventory from '~/components/Inventory'
import useGetWalletNfts from '~/hooks/useGetWalletNfts'
import useWeb3 from '~/hooks/useWeb3'

const Container = styled.div`
  position: relative;
  height: 100%;
`

const Content = styled.div`
  flex: 1;
  padding: 16px 0;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 0 16px;
  }
`

const Username = styled(Heading)`
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 8px;

  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 40px;
    line-height: 44px;
  }
`

const ResponsiveText = styled(Text)`
  font-size: 12px;

  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 16px;
  }
`

const Section = styled.div`
  margin-bottom: 40px;
`

export const ProfileInfo: React.FC<any> = ({ item, showAchievements = true, showCharacters = true }) => {
  const { t } = useTranslation()
  const { isMd, isLg, isXl, isXxl, isXxxl } = useMatchBreakpoints()
  const isDesktop = true //isXl || isXxl || isXxxl

  const { profile } = useProfile()
  const { address: account } = useWeb3()
  const { isLoading, nfts: nftsInWallet } = useGetWalletNfts()
  const [gameTabIndex, setGameTabIndex] = useState(0)
  return (
    <Container>
      <Card style={{ overflow: 'visible', height: '100%' }}>
        {profile?.nft ? (
          <CardHeader style={{ paddingBottom: 70 }}>
            <Flex alignItems={['start', null, 'center']} flexDirection={['column', null, 'row']}>
              <EditProfileAvatar profile={profile} />
              <Content>
                <Username>{profile.username}</Username>
                <ResponsiveText bold>{profile.team?.name}</ResponsiveText>
              </Content>
            </Flex>
          </CardHeader>
        ) : (
          <CardHeader style={{ paddingBottom: 70 }}>
            <Flex justifyContent="center">
              <Button
                as={Link}
                to="/account"
                onClick={() => {
                  window.scrollTo(0, 0)
                }}>
                Choose Character
              </Button>
            </Flex>
          </CardHeader>
        )}
        <CardBody style={{ marginTop: -70 }}>
          <Inventory columns={isDesktop ? 6 : 4} rows={isDesktop ? 7 : 19} showFull />
          {/* <StatBox icon={PrizeIcon} title={profile.points} subtitle={t('Points')} mb="24px" /> */}
          {showAchievements ? (
            <Section>
              <Heading as="h4" size="md" mt="30px">
                {t('Achievements')}
              </Heading>
              <AchievementsList address={account} />
            </Section>
          ) : null}
          {showCharacters ? (
            <Section style={{ marginBottom: 0 }}>
              <Heading as="h4" size="md" mt="15px" mb="0px">
                {t('Characters')}
              </Heading>
              <Collectibles />
              <Flex justifyContent="center">
                <Button as={Link} to="/characters" style={{ textAlign: 'center' }}>
                  Create Character
                </Button>
              </Flex>
            </Section>
          ) : null}
        </CardBody>
      </Card>
    </Container>
  )
}

export default ProfileInfo
