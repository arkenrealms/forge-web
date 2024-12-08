import React from 'react';
import { createGlobalStyle } from 'styled-components';
import Page from '~/components/layout/Page';
import PageWindow from '~/components/PageWindow';
import Runeforms from '~/components/Sanctuary/Runeforms';
import LoreContainer from '~/components/LoreContainer';

const RuneformsView = () => {
  return (
    <Page>
      <LoreContainer color="dark">
        <Runeforms />
      </LoreContainer>
    </Page>
  );
};

export default RuneformsView;
