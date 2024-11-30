import React from 'react';
import styled, { css } from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import Page from '~/components/layout/Page';
import { Card, CardBody, Heading } from '~/ui';

const zzz = styled.div``;

const BountiesView = () => {
  return (
    <Page>
      <Card style={{ width: '100%' }}>
        <Heading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
          Arken Bounties
        </Heading>
        <hr />
        <CardBody>
          <p>
            If you're interested in a bounty please contact us on Telegram. Technically if somebody does a satisfactory
            job it will be accepted and reward will be paid, but it will usually be better to discuss the scope first
            and claim the job so others don't redo the same work.
          </p>
          <br />
          <div
            css={css`
              border: 1px solid #bb955e;
              padding: 10px;
              margin-bottom: 20px;
              font-size: 0.9rem;
            `}>
            <h3 style={{ fontSize: '1.2rem' }}>Update logo in Adobe Photoshop</h3>
            <br />
            <p>
              <strong>Reward:</strong> Make a suggestion
              <br />
              <strong>Status:</strong> Ready to be accepted, ask in Telegram.
              <br />
              <strong>Claimed By:</strong> Nobody yet.
              <br />
              <br />
              We have various images developed in Adobe Photoshop that need to be updated/tweaked.
            </p>
          </div>
          <div
            css={css`
              border: 1px solid #bb955e;
              padding: 10px;
              margin-bottom: 20px;
              font-size: 0.9rem;
            `}>
            <h3 style={{ fontSize: '1.2rem' }}>Update logo in our videos in Adobe Illustrator</h3>
            <br />
            <p>
              <strong>Reward:</strong> Make a suggestion
              <br />
              <strong>Status:</strong> Ready to be accepted, ask in Telegram.
              <br />
              <strong>Claimed By:</strong> Nobody yet.
              <br />
              <br />
              We have various videos developed in Adobe Illustrator that need to be updated.
            </p>
          </div>
          <div
            css={css`
              border: 1px solid #bb955e;
              padding: 10px;
              margin-bottom: 20px;
              font-size: 0.9rem;
            `}>
            <h3 style={{ fontSize: '1.2rem' }}>Find voices that match our characters</h3>
            <br />
            <p>
              <strong>Reward:</strong> Make a suggestion
              <br />
              <strong>Status:</strong> Ready to be accepted, ask in Telegram.
              <br />
              <strong>Claimed By:</strong> Nobody yet.
              <br />
              <br />
              You'll go to elevenlabs.io and find voices in the library that match our characters. Copy dialog from
              games and find the best match.
            </p>
          </div>
          <div
            css={css`
              border: 1px solid #bb955e;
              padding: 10px;
              margin-bottom: 20px;
              font-size: 0.9rem;
            `}>
            <h3 style={{ fontSize: '1.2rem' }}>Improve the lore / story / monsters / characters</h3>
            <br />
            <p>
              <strong>Reward:</strong> Make a suggestion
              <br />
              <strong>Status:</strong> Ready to be accepted, ask in Telegram.
              <br />
              <strong>Claimed By:</strong> Nobody yet.
              <br />
              <br />
              We have a lot of documents regarding our lore that could be improved with clever use of ChatGPT or other
              LLMs. You'd need to go through the Google documents + spreadsheets and improve the content, using
              generated content where it makes sense, and making notes when we need professionals.
            </p>
          </div>
          <div
            css={css`
              border: 1px solid #bb955e;
              padding: 10px;
              margin-bottom: 20px;
              font-size: 0.9rem;
            `}>
            <h3 style={{ fontSize: '1.2rem' }}>Create stickers for an upcoming game</h3>
            <br />
            <p>
              <strong>Reward:</strong> Make a suggestion
              <br />
              <strong>Status:</strong> Ready to be accepted, ask in Telegram.
              <br />
              <strong>Claimed By:</strong> Nobody yet.
              <br />
              <br />
              We're building a new game that will need stickers for Telegram and other platforms. You can generate them
              with ChatGPT. You don't need to make them perfect but if you're good with remove.bg and Photoshop that's a
              bonus.
            </p>
          </div>
          <div
            css={css`
              border: 1px solid #bb955e;
              padding: 10px;
              margin-bottom: 20px;
              font-size: 0.9rem;
            `}>
            <h3 style={{ fontSize: '1.2rem' }}>Curate game database</h3>
            <br />
            <p>
              <strong>Reward:</strong> Make a suggestion
              <br />
              <strong>Status:</strong> Ready to be accepted, ask in Telegram.
              <br />
              <strong>Claimed By:</strong> Nobody yet.
              <br />
              <br />
              We need help combing through our game items, monsters, characters, etc. to ensure it's all consistent and
              well done. You'd spend most of the time in a spreadsheet and ChatGPT.
            </p>
          </div>
          <div
            css={css`
              border: 1px solid #bb955e;
              padding: 10px;
              margin-bottom: 20px;
              font-size: 0.9rem;
            `}>
            <h3 style={{ fontSize: '1.2rem' }}>Develop UI with React.js</h3>
            <br />
            <p>
              <strong>Reward:</strong> Make a suggestion
              <br />
              <strong>Status:</strong> Ready to be accepted, ask in Telegram.
              <br />
              <strong>Claimed By:</strong> Nobody yet.
              <br />
              <br />
              We could use help creating UI with React.js for our upcoming games.
            </p>
          </div>
          <div
            css={css`
              border: 1px solid #bb955e;
              padding: 10px;
              margin-bottom: 20px;
              font-size: 0.9rem;
            `}>
            <h3 style={{ fontSize: '1.2rem' }}>Document Arken Realms on Wikipedia</h3>
            <br />
            <p>
              <strong>Reward:</strong> Make a suggestion
              <br />
              <strong>Status:</strong> Paused.
              <br />
              <strong>Claimed By:</strong> Nobody yet.
              <br />
              <br />
              We would like our status, accomplishments and games documented on wikipedia. It should be done in a
              professional manner. In particular, we'd like our world first's documented, like being the the first
              intoperable game model to utilize the same NFTs across games.
            </p>
          </div>
          <div
            css={css`
              border: 1px solid #bb955e;
              padding: 10px;
              margin-bottom: 20px;
              font-size: 0.9rem;
            `}>
            <h3 style={{ fontSize: '1.2rem' }}>List Evolution Isles on various game listing sites</h3>
            <br />
            <p>
              <strong>Reward:</strong> Make a suggestion
              <br />
              <strong>Status:</strong> Paused. Wait for Evo 2 and free account system.
              <br />
              <strong>Claimed By:</strong> Nobody yet.
              <br />
              <br />
              We would like Evolution Isles listed across as many gaming sites as possible. A minimum of 20 high quality
              sites would be best.
            </p>
          </div>
          <div
            css={css`
              border: 1px solid #bb955e;
              padding: 10px;
              margin-bottom: 20px;
              font-size: 0.9rem;
            `}>
            <h3 style={{ fontSize: '1.2rem' }}>Categorize AI generated items into mythic/epic/rare/magical</h3>
            <br />
            <p>
              <strong>Reward:</strong> Make a suggestion
              <br />
              <strong>Status:</strong> Paused. Wait for more items to be generated.
              <br />
              <strong>Claimed By:</strong> Nobody yet.
              <br />
              <br />
              We need help determining the quality of the AI at generated for our Runeform items. Mythics would be the
              most unique and high quality. Epics would be high quality and slightly unique or a bit less quality but
              very unique. Rare would be high quality and not unique at all, or low quality and very unique. Magical
              would be a mix of low quality or low uniqueness, but with some nice ones spread in there for RNG.
              <br />
              <br />
              The operation is easy on a technical level, simply download a ZIP folder of the items and move them to the
              folder based on your judgement.
            </p>
          </div>
        </CardBody>
      </Card>
    </Page>
  );
};

export default BountiesView;
