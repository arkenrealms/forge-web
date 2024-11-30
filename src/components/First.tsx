import React from 'react';
import styled, { css } from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import Page from '~/components/layout/Page';
import { Card, CardBody, Heading } from '~/ui';

const zzz = styled.div``;

const FirstView = () => {
  return (
    <Page>
      <Card style={{ width: '100%' }}>
        <Heading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
          📜 Rune Records
        </Heading>
        <hr />
        <CardBody>
          <p>
            Rune has been at the forefront of GameFi technology since inception. We're always looking for world firsts
            that will push the envelope and set us apart.
          </p>
          <br />
          <div
            css={css`
              border: 1px solid #bb955e;
              padding: 10px;
              margin-bottom: 20px;
              font-size: 0.9rem;
            `}>
            <h3 style={{ fontSize: '1.2rem' }}>First NFTs with mechanics coded directly into the Token IDs</h3>
            <br />
            <p>
              <strong>Date:</strong> April, 2021
              <br />
              <strong>Status:</strong> Complete
              <br />
              <br />
              Runic Raids was the first to support generating NFT items with the game mechanics encoded directly into
              the Token ID, ensuring attributes cannot be changed and simplifying cross-chain and third-party support.
            </p>
          </div>
          <div
            css={css`
              border: 1px solid #bb955e;
              padding: 10px;
              margin-bottom: 20px;
              font-size: 0.9rem;
            `}>
            <h3 style={{ fontSize: '1.2rem' }}>First liquidity farm with on-chain mechanics</h3>
            <br />
            <p>
              <strong>Date:</strong> April, 2021
              <br />
              <strong>Status:</strong> Complete
              <br />
              <br />
              Runic Raids was the first farm to support on-chain NFT mechanics.
            </p>
          </div>
          <div
            css={css`
              border: 1px solid #bb955e;
              padding: 10px;
              margin-bottom: 20px;
              font-size: 0.9rem;
            `}>
            <h3 style={{ fontSize: '1.2rem' }}>First liquidity farm with multiple reward tokens per farm</h3>
            <br />
            <p>
              <strong>Date:</strong> June, 2021
              <br />
              <strong>Status:</strong> Complete
              <br />
              <br />
              Runic Raids used to switch MasterChef contracts every week, but in June 2021 switched to "fluid farming"
              which changes the reward each week (retaining previous rewards).
            </p>
          </div>
          <div
            css={css`
              border: 1px solid #bb955e;
              padding: 10px;
              margin-bottom: 20px;
              font-size: 0.9rem;
            `}>
            <h3 style={{ fontSize: '1.2rem' }}>First action arcade game dropping randomly generated NFT items</h3>
            <br />
            <p>
              <strong>Date:</strong> July, 2021
              <br />
              <strong>Status:</strong> Complete
              <br />
              <br />
              Evolution Isles starts dropping random NFT items that were transfered to players immediately.
            </p>
          </div>
          <div
            css={css`
              border: 1px solid #bb955e;
              padding: 10px;
              margin-bottom: 20px;
              font-size: 0.9rem;
            `}>
            <h3 style={{ fontSize: '1.2rem' }}>First metaverse with more than one game utilizing NFT item mechanics</h3>
            <br />
            <p>
              <strong>Date:</strong> September, 2022
              <br />
              <strong>Status:</strong> Complete
              <br />
              <br />
              Runic Raids and Evolution Isles share the same NFT items and both use those mechanics as part of their
              game design.
            </p>
          </div>
          <div
            css={css`
              border: 1px solid #bb955e;
              padding: 10px;
              margin-bottom: 20px;
              font-size: 0.9rem;
            `}>
            <h3 style={{ fontSize: '1.2rem' }}>First game to drop random items with unique generative art</h3>
            <br />
            <p>
              <strong>Date:</strong> December, 2022
              <br />
              <strong>Status:</strong> Pending
              <br />
              <br />
              Infinite Arena will be the first RPG to drop randomly generated items with random generative art.
            </p>
          </div>
        </CardBody>
      </Card>
    </Page>
  );
};

export default FirstView;
