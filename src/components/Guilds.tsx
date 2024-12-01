import React from 'react';
import orderBy from 'lodash/orderBy';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import TeamHeader from '~/components/guilds/TeamHeader';
import TeamListCard from '~/components/guilds/TeamListCard';
import { useTeams } from '~/state/hooks';
import { Card2, CardBody, Heading, Skeleton } from '~/ui';
import { trpc } from '~/utils/trpc';
import type * as Arken from '@arken/node';

const aaa = styled.div``;

const Guilds = () => {
  const { t } = useTranslation();

  const { data: teams, error } = trpc.seer.core.getTeams.useQuery<Arken.Core.Types.Team[]>({});
  console.log(23432423, teams);
  if (error) return <div style={{ padding: 10 }}>Error: {error.message}</div>;
  if (!teams)
    return (
      <div style={{ padding: 10 }}>
        <Skeleton height="80px" mb="16px" mt="16px" ml="16px" mr="16px" />
      </div>
    );

  const teamList = Object.values(teams);
  const topTeams = orderBy(teamList, ['id', 'name'], ['desc', 'asc', 'asc']);

  return (
    <>
      <Card2 style={{ width: '100%' }}>
        <Heading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15, padding: 20 }}>
          {t('Guilds')}
        </Heading>
        <hr />
        <CardBody style={{ overflow: 'hidden' }}>
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
            `}></div>
          Haerra needs a hero... Who will you be?
          <br />
          <br />
          <TeamHeader />
          {/* <Flex flexDirection="column" alignItems="center" justifyContent="center" p="24px" mb="32px">
            {isLoading && <AutoRenewIcon spin style={{ width: 50 }} />}
          </Flex> */}
        </CardBody>
      </Card2>
      <br />
      {topTeams.map((team: any, index: number) => (
        <TeamListCard key={team.id + ''} rank={index + 1} team={team} />
      ))}
    </>
  );
};

export default Guilds;
