import { BigNumber } from 'bignumber.js';
import cx from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ItemType } from '@arken/node/legacy/data/items.type';
import styled from 'styled-components';
import CraftModal from '~/components/CraftModal';
import EquipModal from '~/components/EquipModal';
import { ItemInfo } from '~/components/ItemInfo';
import { useModal } from '~/components/Modal';
import NoteModal from '~/components/NoteModal';
import CardBusdValue from '~/components/raid/CardBusdValue';
import CardValue from '~/components/raid/CardValue';
import RuneDetailsModal from '~/components/RuneDetailsModal';
import SkinModal from '~/components/SkinModal';
import TradeModal from '~/components/TradeModal';
import TransferModal from '~/components/TransferModal';
import TransmuteModal from '~/components/TransmuteModal';
import TrianglesBox from '~/components/TrianglesBox';
import UnequipModal from '~/components/UnequipModal';
import UpgradeModal from '~/components/UpgradeModal';
import runes from '~/config/constants/runes';
import useMatchBreakpoints from '~/hooks/useMatchBreakpoints';
import useWeb3 from '~/hooks/useWeb3';
import history from '~/routerHistory';
import symbolMap from '~/utils/symbolMap';
import { useRunePrice } from '~/state/hooks';
import { Text } from '~/ui';
import { getRuneAddress } from '~/utils/addressHelpers';

type Props = {
  item: ItemType;
  price?: number;
  background?: boolean;
  hideDetails?: boolean;
  hideImage?: boolean;
  hideMetadata?: boolean;
  showActions?: boolean;
  showPerfection?: boolean;
  showBranches?: boolean;
  hideRoll?: boolean;
  showOwner?: boolean;
  defaultBranch?: string;
  quantity?: number;
  children?: any;
};

enum ModalOptions {
  NONE = 0,
  CRAFT = 1,
  DETAILS = 2,
  EQUIP = 4,
  TRADE = 5,
  TRANSFER = 6,
  UNEQUIP = 7,
  UPGRADE = 8,
  TRANSMUTE = 9,
  CANCEL = 10,
  SKIN = 11,
  NOTE = 12,
}

const ItemOption = styled.div`
  background: #000;
  cursor: url('/images/cursor3.png'), pointer;

  border: 2px solid transparent;

  &:hover {
    border: 2px solid #fff;
  }
`;

const Label = styled.div`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 14px;
`;

const WalletBalance = ({ symbol, balance }) => {
  const { t } = useTranslation();
  const busdBalance = new BigNumber(balance).multipliedBy(useRunePrice(runes[symbol].usdFarmPid)).toNumber();

  const { address: account } = useWeb3();

  if (!account) {
    return (
      <>
        <Label>{t(symbolMap(symbol).toUpperCase() + ' in Wallet')}:</Label>
        <Text color="textDisabled" style={{ lineHeight: '54px' }}>
          {t('Locked')}
        </Text>
      </>
    );
  }

  return (
    <>
      <Label>{t(symbolMap(symbol).toUpperCase() + ' in Wallet')}:</Label>
      <CardValue value={balance} decimals={4} fontSize="24px" lineHeight="36px" />
      <CardBusdValue value={busdBalance} />
    </>
  );
};

const Container = styled.div`
  margin: 0 auto 0;
  width: 100%;
  padding-top: 40px;
  background: rgba(0, 0, 0, 1);
  // overflow: hidden;
  max-width: 400px;
  filter: drop-shadow(0px 0px 2px rgba(0, 0, 0, 1));
`;

const StyledCardAccent = styled.div`
  position: absolute;
  top: -4px;
  right: -4px;
  bottom: -4px;
  left: -4px;
  z-index: 0;
  pointer-events: none;
  filter: hue-rotate(295deg) blur(1px);
  opacity: 0.9;
`;
const StyledCardAccentTop = styled.div`
  background: #d0f0dd;
  box-shadow:
    0px 0px 0 #40ff22,
    0px 0px 4px #30ff1f,
    0px 0px 8px #20ff1b,
    0px 0px 16px #10ff18;
  border-radius: 4px;
  position: absolute;
  height: 4px;
  top: 0;
  left: 0;
  width: 100%;
`;
const StyledCardAccentLeft = styled.div`
  background: #d0f0dd;
  box-shadow:
    0px 0px 0 #40ff22,
    0px 0px 4px #30ff1f,
    0px 0px 8px #20ff1b,
    0px 0px 16px #10ff18;
  border-radius: 4px;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 4px;
`;
const StyledCardAccentRight = styled.div`
  background: #d0f0dd;
  box-shadow:
    0px 0px 0 #40ff22,
    0px 0px 4px #30ff1f,
    0px 0px 8px #20ff1b,
    0px 0px 16px #10ff18;
  border-radius: 4px;
  position: absolute;
  width: 4px;
  top: 0;
  right: 0;
  height: 100%;
`;
const StyledCardAccentBottom = styled.div`
  background: #d0f0dd;
  box-shadow:
    0px 0px 0 #40ff22,
    0px 0px 4px #30ff1f,
    0px 0px 8px #20ff1b,
    0px 0px 16px #10ff18;
  border-radius: 4px;
  position: absolute;
  height: 4px;
  bottom: 0;
  left: 0;
  width: 100%;
`;

const StyledCardAccentTopNormal = styled(StyledCardAccentTop)`
  box-shadow:
    0px 0px 0 #fff,
    0px 0px 4px #fff,
    0px 0px 8px #fff,
    0px 0px 16px #fff;
  filter: hue-rotate(305deg);
`;
const StyledCardAccentLeftNormal = styled(StyledCardAccentLeft)`
  box-shadow:
    0px 0px 0 #fff,
    0px 0px 4px #fff,
    0px 0px 8px #fff,
    0px 0px 16px #fff;
  filter: hue-rotate(305deg);
`;
const StyledCardAccentRightNormal = styled(StyledCardAccentRight)`
  box-shadow:
    0px 0px 0 #fff,
    0px 0px 4px #fff,
    0px 0px 8px #fff,
    0px 0px 16px #fff;
  filter: hue-rotate(305deg);
`;
const StyledCardAccentBottomNormal = styled(StyledCardAccentBottom)`
  box-shadow:
    0px 0px 0 #fff,
    0px 0px 4px #fff,
    0px 0px 8px #fff,
    0px 0px 16px #fff;
  filter: hue-rotate(305deg);
`;
const StyledCardAccentTopMythic = styled(StyledCardAccentTop)`
  box-shadow:
    0px 0px 0 #40ff22,
    0px 0px 4px #30ff1f,
    0px 0px 8px #20ff1b,
    0px 0px 16px #10ff18;
  filter: hue-rotate(305deg);
`;
const StyledCardAccentLeftMythic = styled(StyledCardAccentLeft)`
  box-shadow:
    0px 0px 0 #40ff22,
    0px 0px 4px #30ff1f,
    0px 0px 8px #20ff1b,
    0px 0px 16px #10ff18;
  filter: hue-rotate(305deg);
`;
const StyledCardAccentRightMythic = styled(StyledCardAccentRight)`
  box-shadow:
    0px 0px 0 #40ff22,
    0px 0px 4px #30ff1f,
    0px 0px 8px #20ff1b,
    0px 0px 16px #10ff18;
  filter: hue-rotate(305deg);
`;
const StyledCardAccentBottomMythic = styled(StyledCardAccentBottom)`
  box-shadow:
    0px 0px 0 #40ff22,
    0px 0px 4px #30ff1f,
    0px 0px 8px #20ff1b,
    0px 0px 16px #10ff18;
  filter: hue-rotate(305deg);
`;
const StyledCardAccentTopLegendary = styled(StyledCardAccentTop)`
  box-shadow:
    0px 0px 0 #40ff22,
    0px 0px 4px #30ff1f,
    0px 0px 8px #20ff1b,
    0px 0px 16px #10ff18;
`;
const StyledCardAccentLeftLegendary = styled(StyledCardAccentLeft)`
  box-shadow:
    0px 0px 0 #40ff22,
    0px 0px 4px #30ff1f,
    0px 0px 8px #20ff1b,
    0px 0px 16px #10ff18;
`;
const StyledCardAccentRightLegendary = styled(StyledCardAccentRight)`
  box-shadow:
    0px 0px 0 #40ff22,
    0px 0px 4px #30ff1f,
    0px 0px 8px #20ff1b,
    0px 0px 16px #10ff18;
`;
const StyledCardAccentBottomLegendary = styled(StyledCardAccentBottom)`
  box-shadow:
    0px 0px 0 #40ff22,
    0px 0px 4px #30ff1f,
    0px 0px 8px #20ff1b,
    0px 0px 16px #10ff18;
`;
const StyledCardAccentTopUnique = styled(StyledCardAccentTop)`
  box-shadow:
    0px 0px 0 #40ff22,
    0px 0px 4px #30ff1f,
    0px 0px 8px #20ff1b,
    0px 0px 16px #10ff18;
  filter: hue-rotate(340deg);
`;
const StyledCardAccentLeftUnique = styled(StyledCardAccentLeft)`
  box-shadow:
    0px 0px 0 #40ff22,
    0px 0px 4px #30ff1f,
    0px 0px 8px #20ff1b,
    0px 0px 16px #10ff18;
  filter: hue-rotate(340deg);
`;
const StyledCardAccentRightUnique = styled(StyledCardAccentRight)`
  box-shadow:
    0px 0px 0 #40ff22,
    0px 0px 4px #30ff1f,
    0px 0px 8px #20ff1b,
    0px 0px 16px #10ff18;
  filter: hue-rotate(340deg);
`;
const StyledCardAccentBottomUnique = styled(StyledCardAccentBottom)`
  box-shadow:
    0px 0px 0 #40ff22,
    0px 0px 4px #30ff1f,
    0px 0px 8px #20ff1b,
    0px 0px 16px #10ff18;
  filter: hue-rotate(340deg);
`;

const StyledCardAccentTopEpic = styled(StyledCardAccentTop)`
  box-shadow:
    0px 0px 0 #40ff22,
    0px 0px 4px #30ff1f,
    0px 0px 8px #20ff1b,
    0px 0px 16px #10ff18;
  filter: hue-rotate(235deg);
`;
const StyledCardAccentLeftEpic = styled(StyledCardAccentLeft)`
  box-shadow:
    0px 0px 0 #40ff22,
    0px 0px 4px #30ff1f,
    0px 0px 8px #20ff1b,
    0px 0px 16px #10ff18;
  filter: hue-rotate(235deg);
`;
const StyledCardAccentRightEpic = styled(StyledCardAccentRight)`
  box-shadow:
    0px 0px 0 #40ff22,
    0px 0px 4px #30ff1f,
    0px 0px 8px #20ff1b,
    0px 0px 16px #10ff18;
  filter: hue-rotate(235deg);
`;
const StyledCardAccentBottomEpic = styled(StyledCardAccentBottom)`
  box-shadow:
    0px 0px 0 #40ff22,
    0px 0px 4px #30ff1f,
    0px 0px 8px #20ff1b,
    0px 0px 16px #10ff18;
  filter: hue-rotate(235deg);
`;

const StyledCardAccentTopRare = styled(StyledCardAccentTop)`
  box-shadow:
    0px 0px 0 #40ff22,
    0px 0px 4px #30ff1f,
    0px 0px 8px #20ff1b,
    0px 0px 16px #10ff18;
  filter: hue-rotate(15deg);
`;
const StyledCardAccentLeftRare = styled(StyledCardAccentLeft)`
  box-shadow:
    0px 0px 0 #40ff22,
    0px 0px 4px #30ff1f,
    0px 0px 8px #20ff1b,
    0px 0px 16px #10ff18;
  filter: hue-rotate(15deg);
`;
const StyledCardAccentRightRare = styled(StyledCardAccentRight)`
  box-shadow:
    0px 0px 0 #40ff22,
    0px 0px 4px #30ff1f,
    0px 0px 8px #20ff1b,
    0px 0px 16px #10ff18;
  filter: hue-rotate(15deg);
`;
const StyledCardAccentBottomRare = styled(StyledCardAccentBottom)`
  box-shadow:
    0px 0px 0 #40ff22,
    0px 0px 4px #30ff1f,
    0px 0px 8px #20ff1b,
    0px 0px 16px #10ff18;
  filter: hue-rotate(15deg);
`;

const StyledCardAccentTopMagical = styled(StyledCardAccentTop)`
  box-shadow:
    0px 0px 0 #40ff22,
    0px 0px 4px #30ff1f,
    0px 0px 8px #20ff1b,
    0px 0px 16px #10ff18;
  filter: hue-rotate(140deg);
`;
const StyledCardAccentLeftMagical = styled(StyledCardAccentLeft)`
  box-shadow:
    0px 0px 0 #40ff22,
    0px 0px 4px #30ff1f,
    0px 0px 8px #20ff1b,
    0px 0px 16px #10ff18;
  filter: hue-rotate(140deg);
`;
const StyledCardAccentRightMagical = styled(StyledCardAccentRight)`
  box-shadow:
    0px 0px 0 #40ff22,
    0px 0px 4px #30ff1f,
    0px 0px 8px #20ff1b,
    0px 0px 16px #10ff18;
  filter: hue-rotate(140deg);
`;
const StyledCardAccentBottomMagical = styled(StyledCardAccentBottom)`
  box-shadow:
    0px 0px 0 #40ff22,
    0px 0px 4px #30ff1f,
    0px 0px 8px #20ff1b,
    0px 0px 16px #10ff18;
  filter: hue-rotate(140deg);
`;

const StyledCardAccentTopSet = styled(StyledCardAccentTop)`
  box-shadow:
    0px 0px 0 #40ff22,
    0px 0px 4px #30ff1f,
    0px 0px 8px #20ff1b,
    0px 0px 16px #10ff18;
  filter: hue-rotate(15deg);
`;
const StyledCardAccentLeftSet = styled(StyledCardAccentLeft)`
  box-shadow:
    0px 0px 0 #40ff22,
    0px 0px 4px #30ff1f,
    0px 0px 8px #20ff1b,
    0px 0px 16px #10ff18;
  filter: hue-rotate(15deg);
`;
const StyledCardAccentRightSet = styled(StyledCardAccentRight)`
  box-shadow:
    0px 0px 0 #40ff22,
    0px 0px 4px #30ff1f,
    0px 0px 8px #20ff1b,
    0px 0px 16px #10ff18;
  filter: hue-rotate(15deg);
`;
const StyledCardAccentBottomSet = styled(StyledCardAccentBottom)`
  box-shadow:
    0px 0px 0 #40ff22,
    0px 0px 4px #30ff1f,
    0px 0px 8px #20ff1b,
    0px 0px 16px #10ff18;
  filter: hue-rotate(15deg);
`;

const Perfection = styled.div`
  position: absolute;
  top: 5px;
  left: 5px;
  font-size: 2rem;
  font-weight: bold;
  color: #fff;
  opacity: 0.1;
  font-family: 'webfontexl', Verdana, Arial, Helvetica, sans-serif;
`;

const RarityEffect = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
`;
const NormalEffect = styled(RarityEffect)``;
const MythicEffect = styled(RarityEffect)`
  background: linear-gradient(0deg, #b9463e80 0%, #b9463e10 100%);
`;
const UniqueEffect = styled(RarityEffect)`
  background: linear-gradient(0deg, #ffb74380 0%, #ffb74310 100%);
  filter: hue-rotate(350deg);
`;
const LegendaryEffect = styled(RarityEffect)`
  background: linear-gradient(0deg, #ffb74380 0%, #ffb74310 100%);
`;
const EpicEffect = styled(RarityEffect)`
  background: linear-gradient(0deg, #945ebb80 0%, #945ebb10 100%);
`;
const RareEffect = styled(RarityEffect)`
  background: linear-gradient(0deg, #bbad5e80 0%, #bbad5e10 100%);
`;
const MagicalEffect = styled(RarityEffect)`
  background: linear-gradient(0deg, #3e6db980 0%, #3e6db910 100%);
`;
const SetEffect = styled(RarityEffect)`
  background: linear-gradient(0deg, #b0b93e80 0%, #b0b93e10 100%);
`;

const Video = styled.video`
  position: relative;
  z-index: 1;
`;

const ItemInformation: React.FC<Props> = ({
  item,
  children,
  price = 0,
  showPerfection = true,
  showActions = true,
  background = false,
  hideDetails = false,
  hideImage = false,
  hideMetadata = false,
  showBranches = true,
  hideRoll = false,
  showOwner = false,
  defaultBranch = '1',
  quantity = 1,
}) => {
  const isRune = item.name?.slice(-4).toLowerCase() === 'rune';
  const symbol = item.name?.toLowerCase().replace(' rune', '');
  const [gameTabIndex, setGameTabIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(ModalOptions.NONE);
  const [onPresentCraftModal] = useModal(<CraftModal onSuccess={() => {}} />);
  const [onPresentTradeModal] = useModal(<TradeModal item={item} onSuccess={() => {}} />);
  const [onPresentEquipModal] = useModal(<EquipModal tokenId={item.tokenId} onSuccess={() => {}} />);
  const [onPresentUnequipModal] = useModal(<UnequipModal tokenId={item.tokenId} onSuccess={() => {}} />);
  const [onPresentTransferModal] = useModal(
    <TransferModal
      symbol={symbol}
      maxAmount={quantity}
      tokenAddress={isRune ? getRuneAddress(symbol) : null}
      tokenId={item.tokenId}
      onSuccess={() => {}}
    />
  );
  const [onPresentTransmuteModal] = useModal(<TransmuteModal tokenId={item.tokenId} onSuccess={() => {}} />);
  const [onPresentSkinModal] = useModal(<SkinModal tokenId={item.tokenId} onSuccess={() => {}} />);
  const [onPresentNoteModal] = useModal(<NoteModal tokenId={item.tokenId} onSuccess={() => {}} />);
  const [onPresentDetailsModal] = useModal(
    <RuneDetailsModal
      tokenAddress={isRune ? getRuneAddress(symbol) : null}
      details={item.details}
      item={item}
      onSuccess={() => {}}
    />
  );
  const [onPresentUpgradeModal] = useModal(<UpgradeModal tokenId={item.tokenId} onSuccess={() => {}} />);

  const { isMd, isLg, isXl, isXxl, isXxxl } = useMatchBreakpoints();
  const isMobile = !isMd && !isLg && !isXl && !isXxl && !isXxxl;

  const videoRef = useRef();
  const previousUrl = useRef(item.video);

  useEffect(() => {
    if (!item.video) return;
    if (previousUrl.current === item.video) return;

    // @ts-ignore
    videoRef.current?.load();

    previousUrl.current = item.video;
  }, [item.video]);

  const onEquip = () => {
    setSelectedOption(ModalOptions.EQUIP);
    onPresentEquipModal();
  };

  const onUnequip = () => {
    setSelectedOption(ModalOptions.UNEQUIP);
    onPresentUnequipModal();
  };

  const onTransfer = () => {
    setSelectedOption(ModalOptions.TRANSFER);
    onPresentTransferModal();
  };

  const onTrade = () => {
    setSelectedOption(ModalOptions.TRADE);
    onPresentTradeModal();
  };

  const onCraft = () => {
    setSelectedOption(ModalOptions.CRAFT);
    history.push(`/transmute/${item.name.toLowerCase()}`);
    // onPresentCraftModal()
  };

  const onDetails = () => {
    setSelectedOption(ModalOptions.DETAILS);
    onPresentDetailsModal();
  };

  const onUpgrade = () => {
    setSelectedOption(ModalOptions.UPGRADE);
    onPresentUpgradeModal();
  };

  const onTransmute = () => {
    setSelectedOption(ModalOptions.TRANSMUTE);
    onPresentTransmuteModal();
  };

  const onSkin = () => {
    setSelectedOption(ModalOptions.SKIN);
    onPresentSkinModal();
  };

  const onNote = () => {
    setSelectedOption(ModalOptions.NOTE);
    onPresentNoteModal();
  };

  return (
    <Container className={cx('relative w-full z-10', 'text-white text-sm py-4 px-6 md:mx-4')}>
      {item.rarity?.name === 'Unique' ? (
        <UniqueEffect>
          <StyledCardAccent>
            <StyledCardAccentLeftUnique />
            <StyledCardAccentTopUnique />
            <StyledCardAccentRightUnique />
            <StyledCardAccentBottomUnique />
          </StyledCardAccent>
        </UniqueEffect>
      ) : null}
      {item.rarity?.name === 'Legendary' ? (
        <LegendaryEffect>
          <StyledCardAccent>
            <StyledCardAccentLeftLegendary />
            <StyledCardAccentTopLegendary />
            <StyledCardAccentRightLegendary />
            <StyledCardAccentBottomLegendary />
          </StyledCardAccent>
        </LegendaryEffect>
      ) : null}
      {item.rarity?.name === 'Mythic' ? (
        <MythicEffect>
          <StyledCardAccent>
            <StyledCardAccentLeftMythic />
            <StyledCardAccentTopMythic />
            <StyledCardAccentRightMythic />
            <StyledCardAccentBottomMythic />
          </StyledCardAccent>
        </MythicEffect>
      ) : null}
      {item.rarity?.name === 'Epic' ? (
        <EpicEffect>
          <StyledCardAccent>
            <StyledCardAccentLeftEpic />
            <StyledCardAccentTopEpic />
            <StyledCardAccentRightEpic />
            <StyledCardAccentBottomEpic />
          </StyledCardAccent>
        </EpicEffect>
      ) : null}
      {item.rarity?.name === 'Rare' ? (
        <RareEffect>
          <StyledCardAccent>
            <StyledCardAccentLeftRare />
            <StyledCardAccentTopRare />
            <StyledCardAccentRightRare />
            <StyledCardAccentBottomRare />
          </StyledCardAccent>
        </RareEffect>
      ) : null}
      {item.rarity?.name === 'Magical' ? (
        <MagicalEffect>
          <StyledCardAccent>
            <StyledCardAccentLeftMagical />
            <StyledCardAccentTopMagical />
            <StyledCardAccentRightMagical />
            <StyledCardAccentBottomMagical />
          </StyledCardAccent>
        </MagicalEffect>
      ) : null}
      {item.rarity?.name === 'Set' ? (
        <SetEffect>
          <StyledCardAccent>
            <StyledCardAccentLeftSet />
            <StyledCardAccentTopSet />
            <StyledCardAccentRightSet />
            <StyledCardAccentBottomSet />
          </StyledCardAccent>
        </SetEffect>
      ) : null}
      {item.rarity?.name === 'Normal' ? (
        <NormalEffect>
          <StyledCardAccent>
            <StyledCardAccentLeftNormal />
            <StyledCardAccentTopNormal />
            <StyledCardAccentRightNormal />
            <StyledCardAccentBottomNormal />
          </StyledCardAccent>
        </NormalEffect>
      ) : null}
      {/* <ItemImage path={item.icon} /> */}
      {/* {item.rarity?.name === 'Legendary' ? (
        <StyledCardAccent>
          <StyledCardAccentLeftLegendary />
          <StyledCardAccentTopLegendary />
          <StyledCardAccentRightLegendary />
          <StyledCardAccentBottomLegendary />
        </StyledCardAccent>
      ) : null}
      {item.rarity?.name === 'Unique' ? (
        <StyledCardAccent>
          <StyledCardAccentLeftUnique />
          <StyledCardAccentTopUnique />
          <StyledCardAccentRightUnique />
          <StyledCardAccentBottomUnique />
        </StyledCardAccent>
      ) : null} */}
      {/* {item.rarity?.name === 'Mythic' ? (
        <StyledCardAccent>
          <StyledCardAccentLeftMythic />
          <StyledCardAccentTopMythic />
          <StyledCardAccentRightMythic />
          <StyledCardAccentBottomMythic />
        </StyledCardAccent>
      ) : null} */}
      {/* {item.rarity?.name === 'Epic' ? (
        <StyledCardAccent>
          <StyledCardAccentLeftEpic />
          <StyledCardAccentTopEpic />
          <StyledCardAccentRightEpic />
          <StyledCardAccentBottomEpic />
        </StyledCardAccent>
      ) : null}
      {item.rarity?.name === 'Rare' ? (
        <StyledCardAccent>
          <StyledCardAccentLeftRare />
          <StyledCardAccentTopRare />
          <StyledCardAccentRightRare />
          <StyledCardAccentBottomRare />
        </StyledCardAccent>
      ) : null}
      {item.rarity?.name === 'Magical' ? (
        <StyledCardAccent>
          <StyledCardAccentLeftMagical />
          <StyledCardAccentTopMagical />
          <StyledCardAccentRightMagical />
          <StyledCardAccentBottomMagical />
        </StyledCardAccent>
      ) : null} */}
      {/* {item.rarity?.name === 'Normal' ? (
        <StyledCardAccent>
          <StyledCardAccentLeftNormal />
          <StyledCardAccentTopNormal />
          <StyledCardAccentRightNormal />
          <StyledCardAccentBottomNormal />
        </StyledCardAccent>
      ) : null} */}
      {showPerfection && Number.isFinite(item.perfection) ? (
        <Perfection>{(item.perfection * 100).toFixed(0)}%</Perfection>
      ) : null}
      {/* <div className="text-lg font-bold mb-2 pb-2 border-arcane-darkGray border-b">
        {item.name} {item.shorthand ? `(${item.shorthand})` : ''}
      </div> */}
      <div className="min-h-32">
        <div className="leading-5">
          <ItemInfo
            item={item}
            hideDetails={hideDetails}
            hideImage={hideImage}
            hideMetadata={hideMetadata}
            price={price}
            showBranches={showBranches}
            hideRoll={hideRoll}
            defaultBranch={defaultBranch}
            hidePerfection
            quantity={quantity}>
            {children}
          </ItemInfo>
          {!isMobile && item.video ? (
            <Video
              width="100%"
              height="240"
              ref={videoRef}
              loop
              autoPlay
              muted
              style={{ marginTop: 10, borderRadius: 5 }}>
              <source src={item.video} type="video/mp4" />
            </Video>
          ) : null}
          {/* <WalletBalance balance={item.value} symbol={symbol} /> */}
          {/* {item.video ? <Player
            playsInline
            loop
            muted
            light
            poster={item.icon}
            src={item.video}
          /> : null} */}
          {showActions ? (
            <div className="flex flex-col p-4" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
              {item.isEquipped ? (
                <ItemOption
                  className={cx(
                    {
                      'shadow-yellow border-arcane-softYellow border-2': true,
                    },
                    'flex justify-center px-6 py-2 relative border border-arcane-darkGray mb-4'
                  )}
                  onMouseEnter={() => setSelectedOption(ModalOptions.UNEQUIP)}
                  onClick={onUnequip}>
                  {selectedOption === ModalOptions.UNEQUIP && <TrianglesBox />}
                  Unequip
                </ItemOption>
              ) : null}
              {item.isEquipable ? (
                <ItemOption
                  className={cx(
                    {
                      'shadow-yellow border-arcane-softYellow border-2': true,
                    },
                    'flex justify-center px-6 py-2 relative border border-arcane-darkGray mb-4'
                  )}
                  onClick={onEquip}
                  onMouseEnter={() => setSelectedOption(ModalOptions.EQUIP)}>
                  {selectedOption === ModalOptions.EQUIP && <TrianglesBox />}
                  Equip
                </ItemOption>
              ) : null}
              {item.isTransferable ? (
                <ItemOption
                  className={cx(
                    {
                      'shadow-yellow border-arcane-softYellow border-2': true,
                    },
                    'flex justify-center px-6 py-2 relative border border-arcane-darkGray mb-4'
                  )}
                  onMouseEnter={() => setSelectedOption(ModalOptions.TRANSFER)}
                  onClick={onTransfer}>
                  {selectedOption === ModalOptions.TRANSFER && <TrianglesBox />}
                  Transfer
                </ItemOption>
              ) : null}
              {item.isTradeable ? (
                <ItemOption
                  className={cx(
                    {
                      'shadow-yellow border-arcane-softYellow border-2': true,
                    },
                    'flex justify-center px-6 py-2 relative border border-arcane-darkGray mb-4'
                  )}
                  onClick={onTrade}
                  onMouseEnter={() => setSelectedOption(ModalOptions.TRADE)}>
                  {selectedOption === ModalOptions.TRADE && <TrianglesBox />}
                  Trade
                </ItemOption>
              ) : null}
              {item.isCraftable ? (
                <ItemOption
                  className={cx(
                    {
                      'shadow-yellow border-arcane-softYellow border-2': true,
                    },
                    'flex justify-center px-6 py-2 relative border border-arcane-darkGray mb-4'
                  )}
                  onClick={onCraft}
                  onMouseEnter={() => setSelectedOption(ModalOptions.CRAFT)}>
                  {selectedOption === ModalOptions.CRAFT && <TrianglesBox />}
                  Craft
                </ItemOption>
              ) : null}
              {item.isUpgradable ? (
                <ItemOption
                  className={cx(
                    {
                      'shadow-yellow border-arcane-softYellow border-2': true,
                    },
                    'flex justify-center px-6 py-2 relative border border-arcane-darkGray mb-4'
                  )}
                  onClick={onUpgrade}
                  onMouseEnter={() => setSelectedOption(ModalOptions.UPGRADE)}>
                  {selectedOption === ModalOptions.UPGRADE && <TrianglesBox />}
                  Upgrade
                </ItemOption>
              ) : null}
              {item.details ? (
                <ItemOption
                  className={cx(
                    {
                      'shadow-yellow border-arcane-softYellow border-2': true,
                    },
                    'flex justify-center px-6 py-2 relative border border-arcane-darkGray  mb-4'
                  )}
                  onClick={onDetails}
                  onMouseEnter={() => setSelectedOption(ModalOptions.DETAILS)}>
                  {selectedOption === ModalOptions.DETAILS && <TrianglesBox />}
                  Details
                </ItemOption>
              ) : null}
              {item.isTransmutable ? (
                <ItemOption
                  className={cx(
                    {
                      'shadow-yellow border-arcane-softYellow border-2': true,
                    },
                    'flex justify-center px-6 py-2 relative border border-arcane-darkGray mb-4'
                  )}
                  onClick={onTransmute}
                  onMouseEnter={() => setSelectedOption(ModalOptions.TRANSMUTE)}>
                  {selectedOption === ModalOptions.TRANSMUTE && <TrianglesBox />}
                  Transmute
                </ItemOption>
              ) : null}
              {item.isSkinnable ? (
                <ItemOption
                  className={cx(
                    {
                      'shadow-yellow border-arcane-softYellow border-2': true,
                    },
                    'flex justify-center px-6 py-2 relative border border-arcane-darkGray mb-4'
                  )}
                  onClick={onSkin}
                  onMouseEnter={() => setSelectedOption(ModalOptions.SKIN)}>
                  {selectedOption === ModalOptions.SKIN && <TrianglesBox />}
                  Skin
                </ItemOption>
              ) : null}
              <ItemOption
                className={cx(
                  {
                    'shadow-yellow border-arcane-softYellow border-2': true,
                  },
                  'flex justify-center px-6 py-2 relative border border-arcane-darkGray mb-4'
                )}
                onClick={onNote}
                onMouseEnter={() => setSelectedOption(ModalOptions.NOTE)}>
                {selectedOption === ModalOptions.NOTE && <TrianglesBox />}
                Note
              </ItemOption>
            </div>
          ) : null}
        </div>
      </div>
    </Container>
  );
};

export default ItemInformation;
