import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import useFetch from '~/hooks/useFetch';
import { useTranslation } from 'react-i18next';
import races from 'rune-backend-sdk/build/data/generated/characterRaces.json';
import {
  Image,
  Heading,
  RowType,
  Toggle,
  Card,
  Button,
  Flex,
  Text,
  LinkExternal,
  ButtonMenu,
  ButtonMenuItem,
} from '~/ui';
import { Skeleton } from '~/ui';

const Abc = styled.div``;

const Races = function ({ id }) {
  const race = races.find((z) => z.name.toLowerCase().replace(' ', '-') === id);
  const { t } = useTranslation();

  const { shortDescription } = race;

  return (
    <div
      css={css`
        position: relative;
        max-width: 300px;
        border-radius: 7px;
        filter: drop-shadow(0px 0px 2px rgba(0, 0, 0, 1));
      `}>
      <div
        css={css`
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          z-index: -1;
          pointer-events: none;
          border-style: solid;
          border-width: 1px;
          border-color: rgba(255, 217, 0, 0.1);
          border-radius: 6px;
          background-color: hsla(0, 0%, 100%, 0.04);

          background-image: linear-gradient(180deg, rgba(114, 255, 182, 0.06), rgba(253, 255, 144, 0.06));
          box-shadow: 1px 1px 17px 0 rgba(0, 0, 0, 0.38);
          opacity: 0.5;
        `}
      />
      <div
        css={css`
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          z-index: -2;
          background-color: #000;
          background-image: linear-gradient(221deg, rgba(0, 0, 0, 0.35), transparent 31%, rgba(71, 71, 71, 0.46)),
            url('/images/bg-brighter.jpg');
          pointer-events: none;
        `}></div>
      <main
        className="content-wrapper body-5 lore wf-section"
        css={css`
          padding: 10px;
          color: #fff;
        `}>
        <div className="class-header">
          <div
            className="w-layout-grid grid-class-header"
            css={css`
              text-align: center;
            `}>
            <Heading as="h2" size="lg" style={{ marginTop: 15 }}>
              {race.name}
            </Heading>
            <div style={{ marginBottom: 20, marginTop: 20 }}>
              <Flex flexDirection="column" alignItems="center" justifyContent="center">
                <img
                  id="w-node-df400f55-31e6-1136-797f-230aa8853a1f-a4dd0c1b"
                  loading="eager"
                  src={race.image}
                  alt=""
                  className="image-18"
                  css={css`
                    margin-bottom: 20px;
                    min-width: 200px;
                  `}
                />
              </Flex>
            </div>
            <div
              className="div-block-46"
              css={css`
                text-align: center;
                padding: 10px;
              `}>
              <div className="w-richtext">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{shortDescription}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Races;
