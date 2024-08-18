import React from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';
import { Card, CardBody, Heading } from '~/ui';
import { Link as RouterLink, NavLink } from 'react-router-dom';
import Page from '~/components/layout/Page';
import PageWindow from '~/components/PageWindow';

const Guide = ({ match }) => {
  const { id }: { id: string } = match.params;
  return (
    <Page>
      <PageWindow>
        <Card>
          <CardBody>
            <Heading size="xl" mb="24px">
              Guides
            </Heading>
            <ul>
              <li>
                <RouterLink to="/guide/convert-binance-cube">Convert Founder's Cube from Binance</RouterLink>
              </li>
              <li>
                <RouterLink to="/runewords">How Runeforms work</RouterLink>
              </li>
              <li>
                <RouterLink to="/guide/change-character-guild">
                  How to change your character's guild (or transfer to different wallet)
                </RouterLink>
              </li>
              <li>
                <a href="https://academy.binance.com/en/articles/connecting-metamask-to-binance-smart-chain">
                  How to add BSC to MetaMask
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/watch?v=NTZn_Jda2wo&ab_channel=RuneExperiments">
                  How to verify your account &amp; join guild channel on Discord
                </a>
              </li>
              <li>
                <a href="https://academy.binance.com/en/articles/what-is-yield-farming-in-decentralized-finance-defi">
                  What is yield farming?
                </a>
              </li>
              <li>
                <a href="https://academy.binance.com/en/articles/impermanent-loss-explained">
                  What is impermanent loss?
                </a>
              </li>
            </ul>
          </CardBody>
        </Card>
      </PageWindow>
    </Page>
  );
};

export default Guide;
