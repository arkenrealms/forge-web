import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import useFetch from '~/hooks/useFetch';
import history from '~/routerHistory';
import LoreBlock1 from '~/components/LoreBlock1';
import { Flex, Skeleton, Card3 } from '~/ui';
import classes from '@arken/node/data/generated/characterClasses.json';

const Abc = styled.div``;

const Classes = function () {
  // const url = `https://s1.envoy.arken.asi.sh/characterClasses.json`
  // const { data } = useFetch(url)

  // const classes = data?.[url] || []

  if (!classes?.length)
    return (
      <div style={{ padding: 10 }}>
        <Skeleton height="80px" mb="16px" mt="16px" ml="16px" mr="16px" />
      </div>
    );

  return (
    <Card3 style={{ marginTop: 10 }}>
      <main className="content-wrapper wf-section">
        <div className="page-bg-top">
          <img
            src="/images/mage-isles-tsunami3.jpeg"
            loading="lazy"
            sizes="100vw"
            srcSet="/images/mage-isles-tsunami3-p-500.jpeg 500w, /images/mage-isles-tsunami3-p-800.jpeg 800w, /images/mage-isles-tsunami3.jpeg 1067w"
            alt=""
            className="bg-art-top"
          />
        </div>
        <div className="container hide-overflow w-container">
          <div className="locationheader">
            <div className="locationheaderbg" />
            <h1 className="locationtitle">Classes</h1>
          </div>
          <div className="locationdescription w-richtext">
            <p>
              Throughout the land of Heart of the Oasis, your class will adapt to your playstyle but here are some of
              the main archetypes.
            </p>
            <p>‍</p>
            {classes
              .filter((classs) => !!classs.description && !!classs.raidImage)
              .map((classs) => (
                <div
                  key={classs.name}
                  css={css`
                    margin-bottom: 30px;
                  `}>
                  <LoreBlock1
                    name={classs.name}
                    onClick={() =>
                      history.push('/games/oasis/classes/' + classs.name.toLowerCase().replace(/ /g, '-'))
                    }>
                    <Flex flexDirection="row" alignItems="start" justifyContent="center">
                      <img
                        id="w-node-df400f55-31e6-1136-797f-230aa8853a1f-a4dd0c1b"
                        loading="eager"
                        src={classs.raidImage}
                        alt=""
                        className="image-18"
                        css={css`
                          margin-bottom: 20px;
                          max-width: 200px;
                        `}
                      />
                      <div
                        css={css`
                          margin-top: 20px;
                        `}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{classs.description}</ReactMarkdown>
                      </div>
                    </Flex>
                  </LoreBlock1>
                </div>
              ))}
            <p>‍</p>
            <p>‍</p>
            <p>‍</p>
            <p>‍</p>
            {/* <LoreBlock1 name="The Mage" onClick={() => history.push('/games/oasis/classes/mage')}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {classes.find((c) => c.name === 'Mage').description}
              </ReactMarkdown>
            </LoreBlock1>
            <LoreBlock1 name="The Paladin" onClick={() => history.push('/games/oasis/classes/paladin')}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {classes.find((c) => c.name === 'Paladin').description}
              </ReactMarkdown>
            </LoreBlock1>
            <LoreBlock1 name="The Necromancer" onClick={() => history.push('/games/oasis/classes/necromancer')}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {classes.find((c) => c.name === 'Necromancer').description}
              </ReactMarkdown>
            </LoreBlock1>
            <LoreBlock1 name="The Druid" onClick={() => history.push('/games/oasis/classes/druid')}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {classes.find((c) => c.name === 'Druid').description}
              </ReactMarkdown>
            </LoreBlock1>
            <LoreBlock1 name="The Warrior" onClick={() => history.push('/games/oasis/classes/barbarian')}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {classes.find((c) => c.name === 'Warrior').description}
              </ReactMarkdown>
            </LoreBlock1>
            <LoreBlock1 name="The Assassin" onClick={() => history.push('/games/oasis/classes/assassin')}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {classes.find((c) => c.name === 'Assassin').description}
              </ReactMarkdown>
            </LoreBlock1>
            <LoreBlock1 name="The Ranger" onClick={() => history.push('/games/oasis/classes/ranger')}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {classes.find((c) => c.name === 'Ranger').description}
              </ReactMarkdown>
            </LoreBlock1> */}
          </div>
        </div>
      </main>
    </Card3>
  );
};

export default Classes;
