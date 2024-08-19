import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import useFetch from '~/hooks/useFetch';
import { useTranslation } from 'react-i18next';
import classes from '@arken/node/data/generated/characterClasses.json';
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

const Classes = function ({ id }) {
  const classs = classes.find((z) => z.name.toLowerCase().replace(' ', '-') === id);
  const [gameTabIndex, setGameTabIndex] = useState(0);
  const { t } = useTranslation();

  const shortDescription =
    classs.name === 'Warrior'
      ? classs.shortDescription.replace('HE_SHE', 'He').replace('HIS_HER', 'Him')
      : classs.name === 'Assassin'
      ? classs.shortDescription.replace('HE_SHE', 'she').replace('HIS_HER', 'Her')
      : classs.name === 'Druid'
      ? classs.shortDescription.replace('HE_SHE', 'he').replace('HIS_HER', 'Him')
      : classs.name === 'Necromancer'
      ? classs.shortDescription.replace('HE_SHE', 'He').replace('HIS_HER', 'His')
      : classs.name === 'Ranger'
      ? classs.shortDescription.replace('HE_SHE', 'she').replace('HIS_HER', 'Him')
      : classs.name === 'Mage'
      ? classs.shortDescription.replace('HE_SHE', 'She').replace('HIS_HER', 'Her')
      : classs.name === 'Paladin'
      ? classs.shortDescription.replace('HE_SHE', 'He').replace('HIS_HER', 'Him')
      : classs.shortDescription;

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
              {classs.name}
            </Heading>
            <div style={{ marginBottom: 20, marginTop: 20 }}>
              <Flex flexDirection="column" alignItems="center" justifyContent="center">
                <img
                  id="w-node-df400f55-31e6-1136-797f-230aa8853a1f-a4dd0c1b"
                  loading="eager"
                  src={
                    gameTabIndex === 0
                      ? classs.raidImage
                      : gameTabIndex === 1
                      ? classs.infiniteImage
                      : gameTabIndex === 2
                      ? classs.raidImage
                      : ''
                  }
                  alt=""
                  className="image-18"
                  css={css`
                    margin-bottom: 20px;
                    min-width: 200px;
                    zoom: ${gameTabIndex === 0 ? 1 : gameTabIndex === 1 ? 2 : gameTabIndex === 2 ? 1 : 1};
                    image-rendering: ${gameTabIndex === 0
                      ? 'auto'
                      : gameTabIndex === 1
                      ? 'pixelated'
                      : gameTabIndex === 2
                      ? 'auto'
                      : 'auto'};
                  `}
                />
                {/* <ButtonMenu activeIndex={gameTabIndex} scale="xs" onItemClick={(index) => setGameTabIndex(index)}>
                  <ButtonMenuItem>{t('Raid')}</ButtonMenuItem>
                  <ButtonMenuItem>{t('Infinite')}</ButtonMenuItem>
                  <ButtonMenuItem>{t('Sanctuary')}</ButtonMenuItem>
                </ButtonMenu> */}
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

export default Classes;
