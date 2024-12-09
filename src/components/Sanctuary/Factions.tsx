import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import useFetch from '~/hooks/useFetch';
import history from '~/routerHistory';
import LoreBlock1 from '~/components/LoreBlock1';
import { Flex, Skeleton, Card3 } from '~/ui';
import { trpc } from '~/utils/trpc';
import type * as Arken from '@arken/node';

const Abc = styled.div``;

const Factions = function () {
  const { data: factions } = trpc.seer.character.getCharacterFactions.useQuery<
    Arken.Character.Types.CharacterFaction[]
  >({});

  if (!factions?.length)
    return (
      <Card3 style={{ padding: 10 }}>
        <Skeleton height="80px" mb="16px" mt="16px" ml="16px" mr="16px" />
      </Card3>
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
            <h1 className="locationtitle">Factions</h1>
          </div>
          <div className="locationdescription w-richtext">
            <p>
              Throughout the land of Heart of the Oasis and beyond, various factions exist. Some you will meet, some you
              will not.
            </p>
            <p>‍</p>
            {factions.map((faction) => (
              <div
                key={faction.name}
                css={css`
                  margin-bottom: 30px;
                `}>
                <LoreBlock1
                  name={faction.name}
                  onClick={() => history.push('/games/oasis/faction/' + faction.name.toLowerCase().replace(/ /g, '-'))}>
                  <Flex flexDirection="row" alignItems="start" justifyContent="center">
                    {/* <img
                      id="w-node-df400f55-31e6-1136-797f-230aa8853a1f-a4dd0c1b"
                      loading="eager"
                      src={faction.image}
                      alt=""
                      className="image-18"
                      css={css`
                        margin-bottom: 20px;
                        max-width: 200px;
                      `}
                    /> */}
                    <div
                      css={css`
                        margin-top: 20px;
                      `}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{faction.meta.lore1}</ReactMarkdown>
                    </div>
                  </Flex>
                </LoreBlock1>
              </div>
            ))}
            <p>‍</p>
            <p>‍</p>
            <p>‍</p>
            <p>‍</p>
          </div>
        </div>
      </main>
    </Card3>
  );
};

export default Factions;
