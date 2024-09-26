import cx from 'classnames';
import styled, { css, keyframes } from 'styled-components';
import React, { useContext, useEffect, useState } from 'react';
import { BsCheckSquareFill } from 'react-icons/bs';
import useMatchBreakpoints from '~/hooks/useMatchBreakpoints';
import useSettings from '~/hooks/useSettings2';
import { Popover } from 'react-tiny-popover';
import ItemsContext from '~/contexts/ItemsContext';
import symbolMap from '~/utils/symbolMap';
import { ItemCategoriesType, ItemDetails, ItemsBonusType, ItemType } from '@arken/node/data/items.type';
import { toFixed } from '@arken/node/util/math';
import useCache from '~/hooks/useCache';
import BonusIcon from '~/components/BonusIcon';
import TrianglesBox from '~/components/TrianglesBox';
import ItemInformation from '~/components/ItemInformation';
import SoundContext from '~/contexts/SoundContext';
import SparkleAnimation from '~/components/SparkleAnimation';

type Props = {
  item: ItemType;
  itemIndex: string;
  isDisabled?: boolean;
  showQuantity?: boolean;
  showDropdown?: boolean;
  showActions?: boolean;
  showBranches?: boolean;
  hideMetadata?: boolean;
  showName?: boolean;
  background?: boolean;
  isSelectable?: boolean;
  selectMode?: boolean;
  enableMouseLeave?: boolean;
  children?: any;
  containerCss?: any;
  innerCss?: any;
  hideRoll?: boolean;
  defaultBranch?: string;
};

const RuneBackground = styled.div<{ isDisabled: boolean }>`
  position: absolute;
  top: 3%;
  left: 15%;
  width: 70%;
  height: 70%;
  background: url(/images/rune-bg.png) no-repeat 0 0;
  background-size: contain;
  z-index: 1;
  opacity: ${({ isDisabled }) => (isDisabled ? '0.5' : '1')};
`;

const AccentIcon = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  display: none;

  body.good-quality & {
    display: block;
  }
`;

const SelectOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  background: rgba(255, 255, 255, 0.2);
`;

const Name = styled.div`
  position: absolute;
  bottom: -14px;
  right: 0;
  text-align: center;
  font-size: 14px;
  background: #000;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  margin: -0.25rem;
  --text-opacity: 1;
  color: rgba(255, 255, 255, var(--text-opacity));
`;

const RuneForeground = styled.div<{ isDisabled: boolean }>`
  position: absolute;
  top: 3%;
  left: 15%;
  width: 70%;
  height: 70%;
  z-index: 2;
  opacity: ${({ isDisabled }) => (isDisabled ? '0.5' : '1')};
`;

const ItemTags = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
`;
const ItemTag = styled.div<{ color: string }>`
  height: 13px;
  width: 11px;
  line-height: 0;
  font-size: 1.8rem;
  color: ${({ color }) => color};
`;

const ItemForeground = styled.div<{ isPadded: boolean; isDisabled: boolean }>`
  position: absolute;
  top: ${({ isPadded }) => (isPadded ? '4%' : '15%')};
  left: ${({ isPadded }) => (isPadded ? '4%' : '15%')};
  width: ${({ isPadded }) => (isPadded ? '92%' : '70%')};
  height: ${({ isPadded }) => (isPadded ? '92%' : '70%')};
  z-index: 2;
  opacity: ${({ isDisabled }) => (isDisabled ? '0.5' : '1')};

  &:hover {
    border-color: #fff !important;
  }
`;

const Container = styled.div<{ rarity: string; isSelected: boolean }>`
  width: 3.5rem;
  height: 3.5rem;
  position: relative;

  border: 2px solid transparent;
  ${({ rarity }) => (rarity === 'Unique' ? 'border-color: rgba(185, 147, 93, 1);' : '')}
  ${({ rarity }) => (rarity === 'Mythic' ? 'border-color: rgba(168, 82, 79, 1);' : '')}
  ${({ rarity }) => (rarity === 'Epic' ? 'border-color: rgba(128, 79, 168, 1);' : '')}
  ${({ rarity }) => (rarity === 'Rare' ? 'border-color: rgba(168, 160, 79, 1);' : '')}
  ${({ rarity }) => (rarity === 'Magical' ? 'border-color: rgba(79, 116, 168, 1);' : '')} // ${({ isSelected }) =>
    isSelected ? 'border-color: #fff !important;' : ''}
`;

const Item: React.FC<Props> = ({
  item,
  itemIndex,
  showName = false,
  showQuantity = true,
  showDropdown = true,
  showBranches = false,
  showActions = false,
  hideMetadata = false,
  background = true,
  isDisabled = false,
  containerCss = undefined,
  innerCss = undefined,
  hideRoll = true,
  selectMode = false,
  enableMouseLeave = true,
  isSelectable = false,
  defaultBranch = undefined,
  children,
}) => {
  const { name, icon: _icon, tokenId, value, category, bonus, details, isNew } = item;
  const { tokenSkins, userNotes } = useCache();
  const icon = tokenId && tokenSkins[tokenId] ? `https://s1.envoy.arken.asi.sh${tokenSkins[tokenId]}` : _icon;
  const {
    itemPreviewed,
    setItemPreviewed,
    itemSelected,
    setItemSelected,
    itemMultiSelected,
    setItemMultiSelected,
    isModalOpened,
    setIsModalOpened,
    itemsEquipped,
  } = useContext(ItemsContext);
  const isRune = name.toLowerCase().indexOf('rune') !== -1;
  const symbol = name.toLowerCase().replace(' rune', '');
  const [showAnimation, setShowAnimation] = useState(false);
  const [showInformation, setShowInformation] = useState(false);
  const { quality } = useSettings();
  const { isMd, isLg, isXl, isXxl, isXxxl } = useMatchBreakpoints();
  const isMobile = !isMd && !isLg && !isXl && !isXxl && !isXxxl;

  const { playAction } = useContext(SoundContext);

  const handleClick = () => {
    setItemPreviewed(null);

    if (!isModalOpened) {
      playAction();
    }

    if (showDropdown) {
      if (!isDisabled) {
        //  && itemSelected === itemIndex
        if (setIsModalOpened) setIsModalOpened(!isModalOpened);
      } else {
        if (setIsModalOpened) setIsModalOpened(false);
      }
    }

    if (selectMode && category !== ItemCategoriesType.RUNE) {
      if (setItemMultiSelected) setItemMultiSelected(item.tokenId);
    } else {
      if (setItemSelected) setItemSelected(itemIndex);
    }
  };
  // console.log(itemSelected, itemIndex)
  const isSelected = itemSelected === itemIndex;
  const isEquipped = itemsEquipped && itemsEquipped[category]?.name === name;
  const isPreviewed = itemPreviewed === itemIndex;
  // if (itemIndex === 5) console.log(888, itemIndex, itemPreviewed, itemSelected)
  useEffect(() => {
    if (showAnimation) return;
    setShowAnimation(true);
  }, [showAnimation, setShowAnimation]);

  const onMouseEnter = () => {
    if (itemPreviewed === itemIndex) return;
    // if (isMobile) return
    // console.log(88881, itemIndex)
    setItemPreviewed(itemIndex);
    // setTimeout(() => {
    //   if (itemIndex === itemPreviewed)
    //     setItemPreviewed(null)
    // }, 5 * 1000)
    //setShowInformation(true)
  };

  const onMouseLeave = () => {
    if (itemPreviewed !== itemIndex || !enableMouseLeave) return;
    // if (isMobile) return
    // console.log(88882)
    setItemPreviewed(null);
    // setShowInformation(false)
    // setIsModalOpened && setIsModalOpened(false)
  };

  return (
    <Popover
      isOpen={isPreviewed && !!name}
      align="start"
      padding={20}
      positions={['right', 'left', 'top', 'bottom']} // preferred positions by priority
      content={
        <div style={{ background: '#000' }}>
          <ItemInformation
            item={item}
            showActions={showActions}
            showBranches={showBranches}
            hideMetadata
            hideRoll={hideRoll}
            defaultBranch={defaultBranch}
          />
        </div>
      }>
      <Container
        rarity={item.rarity?.name}
        isSelected={isSelected}
        css={[
          css`
            ${item.rarity?.name === 'Legendary' ? 'color: rgba(185,147,93,1);' : ''}
            ${item.rarity?.name === 'Unique' ? 'color: rgba(185,147,93,1);' : ''}
          ${item.rarity?.name === 'Mythic' ? 'color: rgba(168, 82, 79, 1);' : ''}
          ${item.rarity?.name === 'Epic' ? 'color: rgba(128, 79, 168, 1);' : ''}
          ${item.rarity?.name === 'Rare' ? 'color: rgba(168, 160, 79, 1);' : ''}
          ${item.rarity?.name === 'Magical' ? 'color: rgba(79, 116, 168, 1);' : ''}
          `,
          containerCss,
        ]}
        className={cx(
          {
            'arcane-item': true,
            'arcane-background-item ': background,
          },
          'relative border border-arcane-darkGray cursor-pointer'
        )}>
        <div
          onClick={handleClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          style={{ width: '100%', height: '100%', zIndex: 1 }}
          css={innerCss}>
          {/* {item.rarity?.name === 'Legendary' ? (
        <StyledCardAccent>
          <StyledCardAccentLeftLegendary />
          <StyledCardAccentTopLegendary />
          <StyledCardAccentRightLegendary />
          <StyledCardAccentBottomLegendary />
        </StyledCardAccent>
      ) : null}
      {item.rarity?.name === 'Mythic' ? (
        <StyledCardAccent>
          <StyledCardAccentLeftMythic />
          <StyledCardAccentTopMythic />
          <StyledCardAccentRightMythic />
          <StyledCardAccentBottomMythic />
        </StyledCardAccent>
      ) : null}
      {item.rarity?.name === 'Epic' ? (
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
      ) : null}
      {item.perfection === 1 && item.rarity?.name === 'Normal' ? (
        <StyledCardAccent>
          <StyledCardAccentLeft />
          <StyledCardAccentTop />
          <StyledCardAccentRight />
          <StyledCardAccentBottom />
        </StyledCardAccent>
      ) : null} */}
          {value && category === ItemCategoriesType.RUNE ? <RuneBackground isDisabled={isDisabled} /> : null}
          {value && category === ItemCategoriesType.RUNE ? (
            <RuneForeground isDisabled={isDisabled}>
              <img alt={name} src={icon} style={{ imageRendering: 'initial' }} />
            </RuneForeground>
          ) : null}
          {value && category !== ItemCategoriesType.RUNE ? (
            <ItemForeground isPadded={item.icon !== icon} isDisabled={isDisabled}>
              <img alt={name} src={icon} style={{ imageRendering: '-webkit-optimize-contrast' }} />
            </ItemForeground>
          ) : null}
          {selectMode && itemMultiSelected[item.tokenId] ? (
            <SelectOverlay>
              <BsCheckSquareFill style={{ marginLeft: 7 }} />
            </SelectOverlay>
          ) : null}
          {isNew && quality === 'good' ? (
            <AccentIcon>
              <SparkleAnimation />
            </AccentIcon>
          ) : null}
          <ItemTags>
            {item.tokenId && tokenSkins[item.tokenId] ? <ItemTag color="yellow">&bull;</ItemTag> : null}
            {item.tokenId && tokenSkins[item.tokenId] === null ? <ItemTag color="orange">&bull;</ItemTag> : null}
            {item.tokenId && userNotes[item.tokenId] ? <ItemTag color="green">&bull;</ItemTag> : null}
          </ItemTags>
          {isSelectable && isSelected && <TrianglesBox />}
          {bonus && <BonusIcon bonusType={bonus} className="absolute top-0 left-0" />}

          {/* {showName && <Name>{name.replace(' Rune', '')}</Name>} */}
          {showQuantity && value && (category === ItemCategoriesType.RUNE || parseFloat(value) > 1) && (
            <div
              className=" text-sm border border-arcane-darkGray"
              css={css`
                z-index: 4;
                text-align: right;
                top: 0;
                left: 0;
                position: absolute;
                color: #fff;
                padding: 0 5px;
                font-size: 0.8em;
                line-height: 1.3em;
                // background: rgba(0, 0, 0, 0.5);
                text-shadow: 1px 1px 1px #000;
              `}>
              {parseFloat(value) < 1 && parseFloat(value) > 0
                ? toFixed(value, 2)
                : Math.floor(parseFloat(value)).toFixed(0)}
            </div>
          )}
          {showName ? (
            <div
              css={css`
                z-index: 4;
                bottom: 0;
                left: 0;
                width: 100%;
                text-align: center;
                position: absolute;
                font-size: 0.8em;
                line-height: 1.1em;
                color: #fff;
              `}>
              {symbolMap(name).replace(' Rune', '')}
            </div>
          ) : null}
        </div>
        {/* {isModalOpened && isSelected ? <Modal item={item} name={name} symbol={symbol} details={details} /> : null} */}
        {/* {showInformation && name ? (
        <>
          <div
            css={css`
              background: #000;
              position: absolute;
              right: 70px;
              top: 0px;
              z-index: 999;
              min-width: 370px;
            `}
          >
            <ItemInformation item={item} showActions={showActions} showBranches={showBranches} hideMetadata hideRoll={hideRoll} />
          </div>
        </>
      ) : null} */}
        {children}
      </Container>
    </Popover>
  );
};

export default Item;
