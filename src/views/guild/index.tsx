import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ChevronLeftIcon, Flex, Text, Skeleton, Card3 } from '~/ui';
import PageLoader from '~/components/PageLoader';
import teams from '~/config/constants/teams';
import useI18n from '~/hooks/useI18n';
import { useTranslation } from 'react-i18next';
import { useTeam } from '~/state/hooks';
import Page from '~/components/layout/Page';
import PageWindow from '~/components/PageWindow';
import TeamCard from '~/components/guilds/TeamCard';
import TeamHeader from '~/components/guilds/TeamHeader';
import { trpc } from '~/utils/trpc';
import type * as Arken from '@arken/node';

const Team = ({ match }) => {
  const { id: idStr }: { id: string } = match.params;
  const id = Number(idStr);
  const { t } = useTranslation();
  const { data: team, error, isLoading } = trpc.seer.core.getTeam.useQuery<Arken.Core.Types.Team>({});

  if (error) return <Navigate to="/500" />;
  if (!team && !isLoading) return <Navigate to="/404" />;

  if (!team && isLoading)
    return (
      <div style={{ padding: 10 }}>
        <Skeleton height="80px" mb="16px" mt="16px" ml="16px" mr="16px" />
      </div>
    );

  if (!team) {
    return <PageLoader />;
  }

  return (
    <Page>
      <PageWindow>
        <TeamHeader />
        <Flex mb="24px">
          <Card3 style={{ padding: '10px 10px 5px 10px' }}>
            <Link to="/guilds">
              <Flex alignItems="center">
                <ChevronLeftIcon color="primary" />
                <Text color="primary">{t('Guilds')}</Text>
              </Flex>
            </Link>
          </Card3>
        </Flex>
        <TeamCard team={team} />
      </PageWindow>
    </Page>
  );
};

export default Team;
