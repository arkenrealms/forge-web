import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Card2, Heading, CardBody } from '~/ui';
import Page from '~/components/layout/Page';

const Developers = () => {
  const { t } = useTranslation();

  return (
    <Page>
      <Card2 style={{ width: '100%' }}>
        <Heading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15, padding: 20 }}>
          {t('Developer Portal')}
        </Heading>
        <hr />
        <CardBody>
          Developer Portal &amp; API will be released in 2025. In the meantime please visit the Discord to talk with the
          team about developing for the Arken Realms.
          <br />
          <br />
          <a href="https://trello.com/b/bAyYYc2u" rel="noreferrer" target="_blank">
            View Data &amp; Endpoints
          </a>
          <br />
          <a href="https://github.arken.gg" rel="noreferrer" target="_blank">
            View Github Projects
          </a>
        </CardBody>
      </Card2>
    </Page>
  );
};

export default Developers;
