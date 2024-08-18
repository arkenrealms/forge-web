import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ChevronLeftIcon, Flex, Text } from '~/ui';
import PageLoader from '~/components/PageLoader';
import teams from '~/config/constants/teams';
import useI18n from '~/hooks/useI18n';
import { useTranslation } from 'react-i18next';
import { useTeam } from '~/state/hooks';
import Page from '~/components/layout/Page';
import PageWindow from '~/components/PageWindow';
import TeamCard from '~/components/guilds/TeamCard';
import TeamHeader from '~/components/guilds/TeamHeader';

const Team = ({ match }) => {
  const { id: idStr }: { id: string } = match.params;
  const id = Number(idStr);
  const { t } = useTranslation();
  const isValidTeamId = teams.findIndex((team) => team.id === id) !== -1;
  const team = useTeam(id);

  if (!isValidTeamId) {
    return <Navigate to="/404" />;
  }

  if (!team) {
    return <PageLoader />;
  }

  return (
    <Page>
      <PageWindow>
        <TeamHeader />
        <Flex mb="24px">
          <Link to="/guilds">
            <Flex alignItems="center">
              <ChevronLeftIcon color="primary" />
              <Text color="primary">{t('Guilds')}</Text>
            </Flex>
          </Link>
        </Flex>
        <TeamCard team={team} />
      </PageWindow>
    </Page>
  );
};

export default Team;
