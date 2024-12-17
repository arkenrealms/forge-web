import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import useFetch from '~/hooks/useFetch';
import { useTranslation } from 'react-i18next';
import eras from '@arken/node/legacy/data/generated/eras.json';
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

const EraPreview = function ({ id }) {
  const era = eras.find((z) => z.name.toLowerCase().replace(' ', '-') === id);
  const { t } = useTranslation();

  const { shortDescription } = era;

  return (
    <div
      className="lore-container"
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
          border-radius: 7px;
          pointer-events: none;
        `}></div>
      <div className="page-bg-top">
        <img
          src={era.image}
          loading="eager"
          alt=""
          className="bg-art-top bg-art-top-2"
          css={css`
            border-radius: 7px 7px 0 0;
          `}
        />
      </div>
      <main
        className="content-wrapper body-5 lore wf-section"
        css={css`
          padding: 10px;
          color: #fff;
        `}>
        <div className="class-header">
          <div
            className=""
            css={css`
              text-align: center;
            `}>
            <Heading as="h2" size="lg" style={{ margin: 0 }}>
              {era.name}
            </Heading>
            <div
              className="div-block-46"
              css={css`
                text-align: center;
                padding: 10px 10px 20px 10px;
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

export default EraPreview;
