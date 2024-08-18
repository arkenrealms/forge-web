import React from 'react';
import styled from 'styled-components';
import { Tag, Flex, Heading, Image } from '~/ui';
import { NoFeeTag } from '~/components/Tags';
import runes from '~/config/constants/runes';
import symbolMap from '~/utils/symbolMap';

export interface ExpandableSectionProps {
  lpLabel?: string;
  multiplier?: string;
  risk?: number;
  depositFee?: number;
  isTokenOnly?: boolean;
  farmImage?: string;
  tokenSymbol?: string;
}

const Wrapper = styled(Flex)`
  svg {
    margin-right: 4px;
  }
`;

const MultiplierTag = styled(Tag)`
  margin-left: 4px;
`;

const FullIcon = styled.img`
  width: 64px;
  height: 64px;
`;

const FirstIcon = styled.img`
  width: 36px;
  height: 36px;
`;

const SecondIcon = styled.img`
  width: 48px;
  height: 48px;
`;

const FullIconBackground = styled.div<{ isDisabled: boolean }>`
  position: absolute;
  top: 14px;
  left: 14px;
  width: 64px;
  height: 64px;
  background: url(/images/rune-bg.png) no-repeat 0 0;
  background-size: contain;
  z-index: 1;
  opacity: ${({ isDisabled }) => (isDisabled ? '0.5' : '1')};
`;

const FullIconForeground = styled.div<{ isDisabled: boolean }>`
  position: absolute;
  top: 14px;
  left: 14px;
  z-index: 2;
  opacity: ${({ isDisabled }) => (isDisabled ? '0.5' : '1')};
`;

const FirstIconBackground = styled.div<{ isDisabled: boolean }>`
  position: absolute;
  top: 14px;
  left: 14px;
  width: 36px;
  height: 36px;
  background: url(/images/rune-bg.png) no-repeat 0 0;
  background-size: contain;
  z-index: 1;
  opacity: ${({ isDisabled }) => (isDisabled ? '0.5' : '1')};
`;

const FirstIconForeground = styled.div<{ isDisabled: boolean }>`
  position: absolute;
  top: 14px;
  left: 14px;
  z-index: 2;
  opacity: ${({ isDisabled }) => (isDisabled ? '0.5' : '1')};
`;

const SecondIconBackground = styled.div<{ isDisabled: boolean }>`
  position: absolute;
  top: 34px;
  left: 34px;
  width: 48px;
  height: 48px;
  background: url(/images/rune-bg.png) no-repeat 0 0;
  background-size: contain;
  z-index: 3;
  opacity: ${({ isDisabled }) => (isDisabled ? '0.5' : '1')};
`;

const SecondIconForeground = styled.div<{ isDisabled: boolean }>`
  position: absolute;
  top: 34px;
  left: 34px;
  z-index: 4;
  opacity: ${({ isDisabled }) => (isDisabled ? '0.5' : '1')};
`;

const CardHeading: React.FC<ExpandableSectionProps> = ({
  lpLabel,
  multiplier,
  risk,
  farmImage,
  isTokenOnly,
  tokenSymbol,
  depositFee,
}) => {
  const firstSymbol = lpLabel.split('-')[0];
  const secondSymbol = lpLabel.split('-')[1]?.replace(' V2', '').replace(' LP', '');
  const fullIsRune = firstSymbol && firstSymbol !== 'RUNE' ? runes[firstSymbol.toLowerCase()] : false;
  const firstIsRune = firstSymbol && firstSymbol !== 'RUNE' ? runes[firstSymbol.toLowerCase()] : false;
  const secondIsRune = secondSymbol && secondSymbol !== 'RUNE' ? runes[secondSymbol.toLowerCase()] : false;
  const fullIcon = `/images/new-runes/${firstSymbol}.png`;
  const firstIcon = `/images/new-runes/${firstSymbol}.png`;
  const secondIcon = `/images/new-runes/${secondSymbol}.png`;

  return (
    <Wrapper justifyContent="space-between" alignItems="center" mb="12px">
      {isTokenOnly ? (
        <>
          {fullIsRune ? <FullIconBackground isDisabled={false} /> : null}
          {fullIsRune ? (
            <FullIconForeground isDisabled={false}>
              <FullIcon alt={''} src={fullIcon} style={{ imageRendering: 'initial' }} />
            </FullIconForeground>
          ) : (
            <FullIcon alt={''} src={fullIcon} style={{ imageRendering: 'initial' }} />
          )}
        </>
      ) : (
        <>
          {firstIsRune ? <FirstIconBackground isDisabled={false} /> : null}
          {secondIsRune ? <SecondIconBackground isDisabled={false} /> : null}
          <FirstIconForeground isDisabled={false}>
            <FirstIcon alt={''} src={firstIcon} style={{ imageRendering: 'initial' }} />
          </FirstIconForeground>
          <SecondIconForeground isDisabled={false}>
            <SecondIcon alt={''} src={secondIcon} style={{ imageRendering: 'initial' }} />
          </SecondIconForeground>
        </>
      )}

      <Flex flexDirection="column" alignItems="flex-end" style={{ width: '100%' }}>
        <Heading mb="4px" style={{ zIndex: 10 }}>
          {symbolMap(lpLabel)}
        </Heading>
        <Flex justifyContent="center">
          {/* {depositFee === 0 ? <NoFeeTag /> : null} */}
          {/* {isCommunityFarm ? <CommunityTag /> : <CoreTag />} */}
          {/* <RiskTag risk={risk} /> */}
          <MultiplierTag variant="secondary">{multiplier}</MultiplierTag>
        </Flex>
      </Flex>
    </Wrapper>
  );
};

export default CardHeading;
