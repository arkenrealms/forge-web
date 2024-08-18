import React from 'react';
import LoreContainer from '~/components/LoreContainer';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { CardBody, Heading } from '~/ui';
import NftList from '~/components/characters/NftList';

const StyledHero = styled.div`
  border-bottom: 2px solid ${({ theme }) => theme.colors.textSubtle};
  margin-bottom: 24px;
  padding-bottom: 32px;
`;

const CharacterContainer = styled.div`
  zoom: 0.5;

  display: grid;
  grid-gap: 10px;
  grid-template-columns: 2fr;
  grid-template-columns: repeat(2, 1fr);
  padding-bottom: 24px;
  padding-top: 24px;

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: repeat(7, 1fr);
  }

  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: repeat(7, 1fr);
  }

  @media (min-width: 1600px) {
    grid-template-columns: repeat(7, 1fr);
  }

  @media (min-width: 1980px) {
    grid-template-columns: repeat(7, 1fr);
  }
`;

const Collectibles = () => {
  const { t } = useTranslation();

  return (
    <>
      <LoreContainer color="dark">
        <CardBody>
          <Heading as="h2" size="xl">
            {t('Characters')}
          </Heading>
          <p>
            Choose from seven classes of heroes. Each class has its own unique weapons and power.
            <br />
            <br />
            In Arken: Runic Raids, develop your raiding strategy by equipping your character with Runeforms that give
            unique raiding yield bonuses.
          </p>
          <div
            css={css`
              margin-top: 50px;
            `}>
            <CharacterContainer>
              <NftList autoShowDescription showCard={false} />
            </CharacterContainer>
          </div>
        </CardBody>
      </LoreContainer>
    </>
  );
};

export default Collectibles;
