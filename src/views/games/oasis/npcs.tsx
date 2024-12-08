import React from 'react';
import { createGlobalStyle } from 'styled-components';
import Page from '~/components/layout/Page';
import PageWindow from '~/components/PageWindow';
import NPCs from '~/components/Sanctuary/NPCs';
import LoreContainer from '~/components/LoreContainer';

const NPCsView = () => {
  return (
    <Page>
      <LoreContainer color="dark">
        <NPCs />
      </LoreContainer>
    </Page>
  );
};

export default NPCsView;
