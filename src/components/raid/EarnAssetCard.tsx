import React from 'react';
import styled from 'styled-components';
import { Heading, Card, CardBody, Flex, ArrowForwardIcon } from '~/ui';
import { NavLink } from 'react-router-dom';

const StyledFarmStakingCard = styled(Card)`
  background: linear-gradient(#e9a053, #d97d45);
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.lg} {
    margin: 0;
    max-width: none;
  }
`;

const CardMidContent = styled(Heading).attrs({ size: 'xl' })`
  line-height: 44px;
`;

const EarnAssetCard = () => {
  return (
    <StyledFarmStakingCard>
      <NavLink
        to="/"
        className={({ isActive }) => (isActive ? 'active' : '')}
        id="pool-cta"
        onClick={() => {
          window.location.href = '/swap';
        }}>
        <CardBody>
          <Heading color="contrast" size="lg">
            Buy
          </Heading>
          <CardMidContent color="invertedContrast">RUNES</CardMidContent>
          <Flex justifyContent="space-between">
            <Heading color="contrast" size="lg">
              on Arken Swap
            </Heading>
            <ArrowForwardIcon mt={30} color="black" />
          </Flex>
        </CardBody>
      </NavLink>
    </StyledFarmStakingCard>
  );
};

export default EarnAssetCard;
