import React, { useContext } from 'react';
import styled from 'styled-components';
import { Card, Breadcrumbs, Heading, Text } from '~/ui';
import useI18n from '~/hooks/useI18n';
import { useTranslation } from 'react-i18next';
import { ProfileCreationContext } from './contexts/ProfileCreationProvider';

const Wrapper = styled.div`
  border-bottom: 2px solid ${({ theme }) => theme.colors.textSubtle};
  margin-bottom: 24px;
  padding-bottom: 24px;
`;

const steps = [
  { translationId: 776, label: 'Create Character' },
  { translationId: 780, label: 'Join Guild' },
  { translationId: 782, label: 'Choose Username' },
];

const Header: React.FC<any> = () => {
  const { t } = useTranslation();
  const { currentStep } = useContext(ProfileCreationContext);

  return (
    <Wrapper>
      <Card style={{ maxWidth: 1200, margin: '0 auto 30px auto' }}>
        <Heading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
          {t('Account')}
        </Heading>
        <hr />
        {/* <Heading as="h2" size="lg" mb="8px">
          {t('Show off your stats and inventory with your character')}
        </Heading> */}
        {/* <Text color="textSubtle" mb="24px">
          {t('Total cost: 1 RXS')}
        </Text> */}
        <Breadcrumbs>
          {steps.map(({ translationId, label }, index) => {
            return (
              <Text key={label} color={index <= currentStep ? 'text' : 'textDisabled'}>
                {t(label)}
              </Text>
            );
          })}
        </Breadcrumbs>
      </Card>
    </Wrapper>
  );
};

export default Header;
