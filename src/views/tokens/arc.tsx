import React, { useEffect, useRef, useState, useContext } from 'react';
import useSound from 'use-sound';
import { Button, Flex } from '~/ui';
import styled from 'styled-components';
import SoundContext from '~/contexts/SoundContext';
import Page from '~/components/layout/Page';
import PageWindow from '~/components/PageWindow';

const NoItems = styled.div`
  margin: 0 auto;
`;
const Container = styled.div`
  margin-bottom: 30px;
`;

const InventoryInner = ({ showFull }) => {
  return (
    <Page>
      <PageWindow>
        <Flex justifyContent="space-between" alignItems="center">
          Coming soon
        </Flex>
      </PageWindow>
    </Page>
  );
};

const Inventory = ({ showFull = false }) => {
  return <InventoryInner showFull={showFull} />;
};

export default Inventory;
