import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Card, Heading, CardBody, Toggle, Text } from '~/ui';
import Page from '~/components/layout/Page';
import useSettings from '~/hooks/useSettings2';

const AI = () => {
  const { t } = useTranslation();
  const settings = useSettings();

  return (
    <Page>
      <Card style={{ width: '100%' }}>
        <CardBody>Potato</CardBody>
      </Card>
    </Page>
  );
};

export default AI;
