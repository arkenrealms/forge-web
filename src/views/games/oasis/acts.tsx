import React from 'react';
import { createGlobalStyle } from 'styled-components';
import Page from '~/components/layout/Page';
import PageWindow from '~/components/PageWindow';
import Acts from '~/components/Sanctuary/Acts';
import LoreContainer from '~/components/LoreContainer';

const ActsView = () => {
  return (
    <Page>
      <LoreContainer color="dark">
        <Acts />
      </LoreContainer>
    </Page>
  );
};

export default ActsView;
