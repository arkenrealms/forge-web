import React, { useMemo } from 'react';
import { Card, CardBody, CommunityIcon, Flex, Heading, Text } from '~/ui';
import shuffle from 'lodash/shuffle';
import orderBy from 'lodash/orderBy';
import { useTeams } from '~/state/hooks';
import useI18n from '~/hooks/useI18n';
import { useTranslation } from 'react-i18next';
import SelectionCard from '~/components/account/SelectionCard';
import NextStepButton from '~/components/account/NextStepButton';
import useProfileCreation from './contexts/hook';

interface Team {
  name: string;
  description: string;
  isJoinable: boolean;
}

const Team: React.FC<any> = () => {
  const { teamId: currentTeamId, actions } = useProfileCreation();
  const { t } = useTranslation();
  const { teams } = useTeams();
  const handleTeamSelection = (value: string) => actions.setTeamId(parseInt(value, 10));
  const teamList = orderBy(teams, ['id', 'name'], ['desc', 'asc', 'asc']);
  // const teamValues = useMemo(() => shuffle(Object.values(teams)), [teams])

  return (
    <>
      <Text fontSize="20px" color="textSubtle" bold>
        {t(`Step ${2}`)}
      </Text>
      <Heading as="h3" size="xl" mb="24px">
        {t('Join a Guild')}
      </Heading>
      {/* <Text as="p" mb="24px">
        {TranslateString(
          828,
          'There’s currently no difference between guilds. Pick whichever you like, but it won’t be possible to change for the foreseeable future!',
        )}
      </Text> */}
      {/* <Card mb="24px">
        <CardBody>
          <Heading as="h4" size="lg" mb="8px">
            {t('Join a Guild')}
          </Heading>
          <Text as="p" color="textSubtle" mb="24px">
            {TranslateString(
              830,
              'There’s currently no big difference or benefit between guilds. Pick whichever you like, but it won’t be possible to change for the foreseeable future!',
            )}
          </Text> */}
      {teamList &&
        teamList.map((team) => {
          return (
            <SelectionCard
              key={team.name}
              name="teams-selection"
              value={team.id}
              isChecked={currentTeamId === team.id}
              image={`/images/teams/${team.images.md}`}
              onChange={handleTeamSelection}
              disabled={!team.isJoinable}>
              <Text bold>
                {team.name}
                {!team.isJoinable ? ' (Closed)' : null}
              </Text>
              <Flex>
                <CommunityIcon mr="8px" />
                <Text>{team.users?.toLocaleString() || 0}</Text>
              </Flex>
            </SelectionCard>
          );
        })}
      {/* </CardBody>
      </Card> */}
      <NextStepButton onClick={actions.nextStep} disabled={currentTeamId === null}>
        {t('Next Step')}
      </NextStepButton>
    </>
  );
};

export default Team;
