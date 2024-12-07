import React from 'react';
import { createGlobalStyle } from 'styled-components';
import Page from '~/components/layout/Page';
import PageWindow from '~/components/PageWindow';
import Races from '~/components/Sanctuary/Races';
import LoreContainer from '~/components/LoreContainer';

const RacesView = () => {
  return (
    <Page>
      <LoreContainer color="dark">
        <Races />
      </LoreContainer>
    </Page>
  );
};

export default RacesView;
