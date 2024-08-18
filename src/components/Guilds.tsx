import React from 'react'
import orderBy from 'lodash/orderBy'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import TeamHeader from '~/components/guilds/TeamHeader'
import TeamListCard from '~/components/guilds/TeamListCard'
import { useTeams } from '~/state/hooks'
import { Card, CardBody, Heading, Skeleton } from '~/ui'

const aaa = styled.div``
const Guilds = () => {
  const { t } = useTranslation()
  const { teams, isLoading } = useTeams()
  const teamList = Object.values(teams)
  const topTeams = orderBy(teamList, ['id', 'name'], ['desc', 'asc', 'asc'])

  return (
    <>
      <Card style={{ width: '100%' }}>
        <Heading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
          {t('Guilds')}
        </Heading>
        <hr />
        <CardBody>
          <div
            css={css`
              ${({ theme }) => theme.mediaQueries.lg} {
                float: left;
              }
              margin-bottom: 20px;
              background: url('/images/team/ramir-anime.png') 0px 100% no-repeat;
              width: 200px;
              height: 200px;
              background-size: contain;
              margin-right: 20px;
            `}
          ></div>
          Haerra needs a hero... Who will you be?
          <br />
          <br />
          <TeamHeader />
          {/* <Flex flexDirection="column" alignItems="center" justifyContent="center" p="24px" mb="32px">
            {isLoading && <AutoRenewIcon spin style={{ width: 50 }} />}
          </Flex> */}
        </CardBody>
      </Card>
      <br />
      {topTeams.length ? (
        topTeams.map((team, index) => <TeamListCard key={team.id} rank={index + 1} team={team} />)
      ) : (
        <Skeleton height="80px" mb="16px" />
      )}
    </>
  )
}

export default Guilds
