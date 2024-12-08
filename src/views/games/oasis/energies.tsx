import React from 'react';
import { createGlobalStyle } from 'styled-components';
import Page from '~/components/layout/Page';
import PageWindow from '~/components/PageWindow';
import { Card } from '~/ui';
import Energies from '~/components/Sanctuary/Energies';
import LoreContainer from '~/components/LoreContainer';

const EnergiesView = () => {
  return (
    <Page>
      <LoreContainer color="navy">
        <Energies />
      </LoreContainer>
    </Page>
  );
};

export default EnergiesView;
