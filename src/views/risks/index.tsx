import React, { useEffect, useRef, useState, useContext } from 'react';
import styled from 'styled-components';
import { Button, Flex, Card, Heading, CardBody, BaseLayout } from '~/ui';
import Page from '~/components/layout/Page';

import { ItemInfo } from '~/components/ItemInfo';
import { ItemCategoriesType } from 'rune-backend-sdk/build/data/items.type';

const Container = styled.div``;

const Cards = styled(BaseLayout)``;

const Risks = () => {
  return (
    <Page>
      <Container>
        <Card>
          <CardBody>
            <Heading size="xl" mb="24px">
              Risks of Using Rune
            </Heading>
            <p>
              Providing liquidity on Rune doesn&apos;t come without risks. Before making a deposit, it&apos;s best to
              research and understand the risks involved.
            </p>
            <br />
            <br />
            <h2>Audits</h2>
            <br />
            <p>
              Rune smart contracts are based on Goose which were Audited by CertiK and Hacken. We were also audited
              independently by CertiK and RD Auditors. What does this mean? Nothing, it&apos;s bullshit.
            </p>
            <br />
            <br />
            <h2>Private Keys</h2>
            <br />
            <p>
              I have access to the vault, which has roughly 25% of the supply, on an offline laptop somewhere.{' '}
              <a href="/faq" rel="noreferrer noopener" target="_blank">
                More details in the FAQ.
              </a>
            </p>
            <br />
            <br />
            <h2>Impermanent Loss</h2>
            <br />
            <p>
              If one side of an LP sees more demand than the other, either through buys or sells, there will be
              impermanent loss.{' '}
              <a
                href="https://academy.binance.com/en/articles/impermanent-loss-explained"
                rel="noreferrer noopener"
                target="_blank">
                See here for more information.
              </a>
            </p>
            <br />
            <br />
            <h2>Other Risks</h2>
            <br />
            <p>Nobody else mentions the other risks, hiding behind a veil of fake security. Risks involve:</p>
            <ol>
              <li>
                Smart contract risks <em>(Spartan, ValueDefi, etc)</em>
              </li>
              <li>
                DNS provider hacked <em>(Pancake and many before them)</em>
              </li>
              <li>
                Giving permission to infinite amounts of your tokens to a contract. Use unrekt.net{' '}
                <em>
                  (but guess what, someday you could get rekt by unrekt, because you have to approve them to spend your
                  tokens to unspend them!)
                </em>
              </li>
              <li>
                Rogue Telegram admins send fake sites <em>(Too many to count)</em>
              </li>
              <li>Malware via Telegram links/downloads</li>
              <li>Zero-day Metamask exploit</li>
              <li>Websites monitoring your copy/paste clipboard</li>
              <li>Probably more</li>
            </ol>
            <br />
            <br />
            <h2>Take-away</h2>
            <br />
            <p>Never go all in. Do not put in your life savings, or what you can’t afford to lose.</p>
            <br />
            <br />
            <p>
              It&apos;s incredibly easy for a project owner to plant an exploit and pass an audit. Most audits
              don&apos;t check all contracts. Most projects deploy new contracts afterward. There is no trustlessness in
              crypto. You&apos;re always trusting something or someone. The protocol can be legit, but if the owner
              doesn&apos;t pay for their domain nobody is going to use it.
            </p>
            <br />
            <br />
            <p>
              Most of these guys hire [insert Fiverr or random Russian programmer] to do their contracts. Even deploy
              them, as ridiculous as that sounds. I did everything myself. Nobody has access to anything except me. Only
              Binzy can deploy, access domains, tweet, announce, etc. It&apos;s all 2-factor or offline. I can sleep at
              night knowing I won&apos;t wake up to something that was within my control. There&apos;s always contract
              risk, but I did the best I could to keep the funds saifu, better than anyone I know, and I&apos;ve been
              here a while.
            </p>
          </CardBody>
        </Card>
      </Container>
    </Page>
  );
};

export default Risks;
