import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Card, Heading, CardBody, Toggle, Text } from '~/ui';
import Page from '~/components/layout/Page';
import useSettings from '~/hooks/useSettings2';

const ViewControls = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: left;
  width: 100%;
  margin-bottom: 15px;
  padding: 10px;

  > div {
    padding: 8px 0px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
    width: auto;
  }
`;

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 300px;

  ${Text} {
    margin-left: 8px;
  }
`;

const AI = () => {
  const { t } = useTranslation();
  const settings = useSettings();

  return (
    <Page>
      <Card style={{ width: '100%' }}>
        <Heading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
          {t('Settings')}
        </Heading>
        <hr />
        <CardBody>
          <ViewControls>
            <ToggleWrapper>
              <Toggle
                checked={settings.isGamer}
                onChange={() => settings.update('isGamer', !settings.isGamer)}
                scale="sm"
              />
              <Text> {t(`I'm a gamer`)}</Text>
            </ToggleWrapper>
            {!settings.isGamer ? (
              <span style={{ color: '#000' }}>UM, I AMN WONDERING WHAT YOU ARE DOLING HERE THEN...</span>
            ) : null}
            <ToggleWrapper>
              <Toggle
                checked={settings.isAdvancedGamer}
                onChange={() => settings.update('isAdvancedGamer', !settings.isAdvancedGamer)}
                scale="sm"
              />
              <Text> {t(`I'm an advanced gamer`)}</Text>
            </ToggleWrapper>
            <ToggleWrapper>
              <Toggle
                checked={settings.isCrypto}
                onChange={() => settings.update('isCrypto', !settings.isCrypto)}
                scale="sm"
              />
              <Text> {t(`I'm a crypto user`)}</Text>
            </ToggleWrapper>
            <ToggleWrapper>
              <Toggle
                checked={settings.isAdvancedCrypto}
                onChange={() => settings.update('isAdvancedCrypto', !settings.isAdvancedCrypto)}
                scale="sm"
              />
              <Text> {t(`I'm an advanced crypto user`)}</Text>
            </ToggleWrapper>
            <ToggleWrapper>
              <Toggle
                checked={settings.isAdvancedUser}
                onChange={() => settings.update('isAdvancedUser', !settings.isAdvancedUser)}
                scale="sm"
              />
              <Text> {t(`I'm an advanced Rune user`)}</Text>
            </ToggleWrapper>
          </ViewControls>
        </CardBody>
      </Card>
    </Page>
  );
};

export default AI;
