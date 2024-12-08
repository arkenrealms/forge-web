import React from 'react';
import { createGlobalStyle } from 'styled-components';
import Page from '~/components/layout/Page';
import PageWindow from '~/components/PageWindow';
import Factions from '~/components/Sanctuary/Factions';
import LoreContainer from '~/components/LoreContainer';

const FactionsView = () => {
  return (
    <Page>
      <LoreContainer color="dark">
        <Factions />
      </LoreContainer>
    </Page>
  );
};

export default FactionsView;
