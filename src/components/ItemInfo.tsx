import { BigNumber } from 'bignumber.js';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Link as RouterLink } from 'react-router-dom';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import {
  ClassNames,
  ItemAttributesByName,
  itemData,
  ItemSlotToText,
  ItemTypeNames,
} from 'rune-backend-sdk/build/data/items';
import { toFixed } from 'rune-backend-sdk/build/util/math';
import styled from 'styled-components';
import Linker from '~/components/Linker';
import Tooltip from '~/components/Tooltip/Tooltip';
import useCache from '~/hooks/useCache';
import useWeb3 from '~/hooks/useWeb3';
import { useRunePrice } from '~/state/hooks';
import { Button, ButtonMenu, ButtonMenuItem, Text } from '~/ui';
// import {
//   decodeItem
// } from 'rune-backend-sdk/build/util/item-decoder'

const Container = styled.div`
  position: relative;
  text-align: center;
  z-index: 1;
  min-width: 265px; // 350 better
`;

const DetailItem = styled.div`
  text-shadow: 0 0 1px #000;
  color: #fff;
  text-align: right;

  span {
    font-weight: bold;
    color: rgb(187, 149, 94);
  }
`;

const Divider = styled.div<{ rarity: string }>`
  border-bottom: 2px solid transparent;
  margin: 10px 0;
  opacity: 0.5;
  box-shadow: 1px 1px 17px 0 rgba(0, 0, 0, 0.38);

  ${({ rarity }) => (rarity === 'Legendary' ? 'border-color: rgba(185,147,93,1);' : '')}
  ${({ rarity }) => (rarity === 'Unique' ? 'border-color: rgba(185,147,93,1);' : '')}
  ${({ rarity }) => (rarity === 'Mythic' ? 'border-color: #c38585;' : '')}
  ${({ rarity }) => (rarity === 'Epic' ? 'border-color: #b885c3;' : '')}
  ${({ rarity }) => (rarity === 'Rare' ? 'border-color: #c2c385;' : '')}
  ${({ rarity }) => (rarity === 'Magical' ? 'border-color: #a9c5f7;' : '')}
`;

const ItemTitle = styled.div<{ rarity: string }>`
  font-size: 2.3rem;
  line-height: 2.3rem;
  text-shadow: 1px 1px 3px #000;
  z-index: 1;
  pointer-events: none;
  ${({ rarity }) => (rarity === 'Legendary' ? 'color: rgba(185,147,93,1);' : '')}
  ${({ rarity }) => (rarity === 'Unique' ? 'color: rgba(185,147,93,1);' : '')}
  ${({ rarity }) => (rarity === 'Mythic' ? 'color: #c38585;' : '')}
  ${({ rarity }) => (rarity === 'Epic' ? 'color: #b885c3;' : '')}
  ${({ rarity }) => (rarity === 'Rare' ? 'color: #c2c385;' : '')}
  ${({ rarity }) => (rarity === 'Magical' ? 'color: #a9c5f7;' : '')}
`;

const ItemType = styled.div<{ rarity: string }>`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 10px 0 5px;
  text-shadow: 0 0 1px #000;
  z-index: 1;
  pointer-events: none;
  ${({ rarity }) => (rarity === 'Legendary' ? 'color: rgba(185,147,93,1);' : '')}
  ${({ rarity }) => (rarity === 'Unique' ? 'color: rgba(185,147,93,1);' : '')}
  ${({ rarity }) => (rarity === 'Mythic' ? 'color: #c38585;' : '')}
  ${({ rarity }) => (rarity === 'Epic' ? 'color: #b885c3;' : '')}
  ${({ rarity }) => (rarity === 'Rare' ? 'color: #c2c385;' : '')}
  ${({ rarity }) => (rarity === 'Magical' ? 'color: #a9c5f7;' : '')}
`;

const ItemSubtype = styled.div`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 10px 0 10px;
  text-shadow: 0 0 1px #000;
  z-index: 1;
  pointer-events: none;
`;

const ItemRecipe = styled.div`
  font-size: 1.1rem;
  margin: 5px 0;

  letter-spacing: 0.1rem;
  text-shadow: 0 0 1px #000;
  z-index: 1;
`;

const ItemDescription = styled.div`
  font-size: 1rem;
  margin-bottom: 10px;
  line-height: 20px;
  text-align: left;
  text-shadow: 0 0 1px #000;
  font-style: italic;
`;

const ItemAttributeList = styled.div`
  text-align: left;
`;

const ItemAttribute = styled.div`
  line-height: 25px;
  color: #fff;
  font-size: 1.1rem;
  position: relative;
  // padding-left: 17px;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.8); //0 0 1px #7576df;
  margin-bottom: 3px;
  // text-align: center;

  // &:after {
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  //   content: '•';
  //   color: #b9463e;
  //   font-weight: bold;
  //   font-size: 1.2rem;
  // }

  & > div {
    font-size: 1.2rem;
  }
`;

const ItemAttributeCenter = styled.div`
  line-height: 25px;
  color: #aeafff;
  font-size: 1.2rem;
  position: relative;
  padding-left: 12px;
  text-shadow: 0 0 1px #9d9eff;
  text-align: center;

  & > div {
    font-size: 1.2rem;
  }
`;

const ItemImage = styled.div<{ isPadded: boolean; path: string; rarity: string }>`
  position: absolute !important;
  top: -20px;
  right: -20px;
  width: calc(256px / 3);
  height: calc(256px / 3);
  width: ${({ isPadded }) => (isPadded ? 'calc(256px / 2.5);' : 'calc(256px / 3);')};
  height: ${({ isPadded }) => (isPadded ? 'calc(256px / 2.5);' : 'calc(256px / 3);')};
  z-index: -1;
  background: url(${({ path }) => path}) no-repeat 0 0;
  background-size: 100% 100%;
  filter: contrast(1.1) drop-shadow(1px 2px 3px black);
  opacity: 0.9;
  cursor: url('/images/cursor3.png'), pointer;

  // ${({ rarity }) => (rarity === 'Legendary' ? 'filter: drop-shadow(0px 0px 6px #ffd94d);' : '')}
  // ${({ rarity }) => (rarity === 'Unique' ? 'filter: drop-shadow(0px 0px 6px #ffd94d);' : '')}
  // ${({ rarity }) => (rarity === 'Mythic' ? 'filter: drop-shadow(0px 0px 6px #ffd94d);' : '')}
  // ${({ rarity }) => (rarity === 'Epic' ? 'filter: drop-shadow(0px 0px 6px #ffd94d);' : '')}
  // ${({ rarity }) => (rarity === 'Rare' ? 'filter: drop-shadow(0px 0px 6px #ffd94d);' : '')}
  // ${({ rarity }) => (rarity === 'Magic' ? 'filter: drop-shadow(0px 0px 6px #ffd94d);' : '')}

  ${({ theme }) => theme.mediaQueries.md} {
    top: -25px;
    right: -10px;
    width: ${({ isPadded }) => (isPadded ? 'calc(256px / 1.5);' : 'calc(256px / 2);')};
    height: ${({ isPadded }) => (isPadded ? 'calc(256px / 1.5);' : 'calc(256px / 2);')};
  }
`;

const RuneImage = styled(ItemImage)`
  filter: invert(1);
  top: -50px;
`;

const Mod = styled.div`
  width: 100%;
  margin-bottom: 2px;
  text-shadow: 0 0 1px #000;
`;

const ItemMeta = styled.div`
  color: rgba(255, 255, 255, 1);
  text-align: left;
  // color: #bb955e;
  // color: #7576df;
  text-shadow: 0 0 1px #000;
`;

const Perfection = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
  opacity: 0.2;
  font-family: 'webfontexl', Verdana, Arial, Helvetica, sans-serif;
`;

const ItemTags = styled.div`
  position: absolute;
  top: -32px;
  right: -17px;
`;
const ItemTag = styled.div<{ color: string }>`
  height: 16px;
  width: 22px;
  line-height: 0;
  font-size: 4rem;
  color: ${({ color }) => color};
`;

const Label = styled.div`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 14px;
`;

function pad(n, width, z = '0') {
  const nn = n + '';
  return nn.length >= width ? nn : new Array(width - nn.length + 1).join(z) + nn;
}

const getTokenIdFromItem = (data) => {
  const version = 3;

  let attrs = '';

  for (let i = 0; i < 8; i++) {
    const attribute = data.attributes[i];

    if (attribute && attribute?.id) {
      attrs += '2' + pad(attribute?.id || 0, 3) + pad(attribute?.value || 0, 3);
    } else {
      attrs += '0' + pad(attribute?.id || 0, 3) + pad(attribute?.value || 0, 3);
    }
  }

  attrs += '001';

  return `1${pad(version, 3)}${pad(data.id, 5)}${pad(data.type, 2)}${attrs}`;
};

const WalletBalance = ({ symbol, balance }) => {
  const { t } = useTranslation();
  const busdBalance = new BigNumber(balance).multipliedBy(useRunePrice(symbol.toLowerCase())).toNumber();

  const { address: account } = useWeb3();

  if (!account) {
    return (
      <>
        <Text mr="10px" bold>
          Wallet:
        </Text>{' '}
        <Text color="textDisabled" style={{ lineHeight: '54px' }}>
          {t('Locked')}
        </Text>
      </>
    );
  }

  return (
    <>
      <Text mr="10px" bold>
        Wallet:
      </Text>{' '}
      <Text bold fontSize="24px" style={{ lineHeight: '36px' }}>
        $ {busdBalance.toFixed(2)}
      </Text>
      <Text>{balance}</Text>
    </>
  );
};

const NotImplemented = styled.span`
  color: #b9463e;
  font-weight: bold;
  font-size: 0.9rem;
  vertical-align: top;
  margin: 0 3px 0 -2px;
`;

const GameTitleMap = {
  1: 'Raid',
  2: 'Evolution',
  3: 'Infinite',
  4: 'Sanctuary',
};

export const ItemInfo: React.FC<any> = ({
  item,
  children,
  price,
  showBranches = true,
  defaultBranch = '1',
  hideDetails,
  hideImage,
  hideRoll,
  hideShorthand,
  hideAttributes,
  hideRecipe,
  hideMetadata,
  hidePerfection,
  hideTokenId,
  quantity = 1,
  useZoom = false,
}) => {
  const { t } = useTranslation();
  const [metadataExpanded, setMetadataExpanded] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  // console.log(item)

  const [gameTabIndex, setGameTabIndex] = useState(parseInt(defaultBranch) - 1 || 0);
  const branch = item.branches?.[gameTabIndex + 1];
  // if (branch?.rarity && item.rarity) {
  //   for (const i in branch.rarity[item.rarity.id]) {
  //     item.attributes[i] = branch.attributes[i]
  //     item.attributes[i].value = branch.rarity[item.rarity.id][i]
  //   }
  // }

  useEffect(
    function () {
      setGameTabIndex(parseInt(defaultBranch) - 1 || 0);
    },
    [defaultBranch]
  );

  const isRune = item.name?.slice(-4).toLowerCase() === 'rune';

  // if (window.location.hostname === 'localhost' && !isRune) {
  //   item = decodeItem(getTokenIdFromItem(item))
  // }

  const cache = useCache();
  const { tokenSkins, userNotes } = useCache();
  const icon =
    item.tokenId && tokenSkins[item.tokenId] ? `https://envoy.arken.gg${tokenSkins[item.tokenId]}` : item.icon;
  const totalMinted = cache.stats.items[item.id]?.total || 0;
  const attributes =
    gameTabIndex === 0
      ? item.attributes.length
        ? item.attributes
        : branch?.attributes.length
        ? branch?.attributes
        : branch?.attributes || []
      : branch?.attributes || [];
  let description = isRune ? item.description : branch?.description || item.description || 'To Be Announced';

  if (item.id === 1212) {
    description = `Redeemed for a random runeword: \n${itemData.runeword
      .filter((i) => i.isCraftable && !i.isSecret && !(i as any).isUltraSecret)
      .map((i) => i.name)
      .join(' ')} \n(the list will be updated with new runewords, and retired runewords will be removed)`;
  }

  return (
    <Container>
      {!hidePerfection && Number.isFinite(item.perfection) ? (
        <Perfection>{(item.perfection * 100).toFixed(0)}%</Perfection>
      ) : null}
      <ItemTags>
        {item.tokenId && tokenSkins[item.tokenId] ? <ItemTag color="yellow">&bull;</ItemTag> : null}
        {item.tokenId && tokenSkins[item.tokenId] === null ? <ItemTag color="orange">&bull;</ItemTag> : null}
        {item.tokenId && userNotes[item.tokenId] === null ? <ItemTag color="green">&bull;</ItemTag> : null}
      </ItemTags>
      {isRune && !hideImage ? <RuneImage isPadded={false} path={icon} rarity={item.rarity?.name} /> : null}
      {!showZoom && !isRune && !hideImage ? (
        <ItemImage
          isPadded={item.icon !== icon}
          path={icon}
          rarity={item.rarity?.name}
          onClick={() => setShowZoom(true)}
        />
      ) : null}
      {showZoom ? (
        <TransformWrapper>
          <TransformComponent>
            <img src={icon} />
          </TransformComponent>
        </TransformWrapper>
      ) : null}
      <ItemTitle rarity={item.rarity}>
        {item.name}
        {quantity > 1 ? ` x${quantity}` : ''}
      </ItemTitle>
      <ItemType rarity={item.rarity?.name}>
        {item.rarity?.name} {item.details?.['Type']}
      </ItemType>
      <ItemSubtype>{item.details?.['Subtype']}</ItemSubtype>
      {!hideRecipe && item.details?.['Rune Word'] ? (
        <ItemRecipe>&apos;{item.details?.['Rune Word']}&apos;</ItemRecipe>
      ) : null}
      <br />
      {!hideAttributes ? (
        <ItemAttributeList>
          {attributes.map((attribute) => {
            // if (!attribute.param1) {
            //   attribute.param1 = {}
            //   attribute.param1.min = attribute.min
            //   attribute.param1.max = attribute.max
            //   attribute.param1.value = attribute.value
            //   attribute.param1.map = attribute.map
            // } else {
            //   attribute.param1.value = attribute.value
            //   attribute.min = attribute.param1.min
            //   attribute.max = attribute.param1.max
            //   attribute.map = attribute.param1.map
            // }
            const parent1 = attribute.param1 || attribute;

            const { param1, param2, param3 } = attribute;

            let value1 = parent1.map
              ? parent1.value !== undefined
                ? parent1.map[parent1.value]
                : Object.values(parent1.map)
                    .slice(
                      parent1.min - parseInt(Object.keys(parent1.map)[0]),
                      parent1.max - parseInt(Object.keys(parent1.map)[0]) + 1
                    )
                    .join(' or ')
              : parent1.value !== undefined
              ? parent1.value
              : parent1.min === parent1.max
              ? parent1.min
              : `${parent1.min}-${parent1.max}`;

            if (typeof value1 === 'string') value1 = value1.replace(/Hidden Skill([ 0-9]*)/gi, 'Hidden Skill');

            const parent2 = attribute.param2 || attribute;

            let value2 = parent2.map
              ? parent2.value !== undefined
                ? parent2.map[parent2.value]
                : Object.values(parent2.map)
                    .slice(
                      parent2.min - parseInt(Object.keys(parent2.map)[0]),
                      parent2.max - parseInt(Object.keys(parent2.map)[0]) + 1
                    )
                    .join(' or ')
              : parent2.value !== undefined
              ? parent2.value
              : parent2.min === parent2.max
              ? parent2.min
              : `${parent2.min}-${parent2.max}`;

            if (typeof value2 === 'string') value2 = value2.replace(/Hidden Skill([ 0-9]*)/gi, 'Hidden Skill');

            const parent3 = attribute.param3 || attribute;

            let value3 = parent3.map
              ? parent3.value !== undefined
                ? parent3.map[parent3.value]
                : Object.values(parent3.map)
                    .slice(
                      parent3.min - parseInt(Object.keys(parent3.map)[0]),
                      parent3.max - parseInt(Object.keys(parent3.map)[0]) + 1
                    )
                    .join(' or ')
              : parent3.value !== undefined
              ? parent3.value
              : parent3.min === parent3.max
              ? parent3.min
              : `${parent3.min}-${parent3.max}`;

            if (typeof value3 === 'string') value3 = value3.replace(/Hidden Skill([ 0-9]*)/gi, 'Hidden Skill');

            const isNotImplemented =
              attribute.description?.indexOf('Not Implemented') !== -1 || attribute.isImplemented === false;

            const attr = attribute.description
              ?.replace(/{value}/gi, attribute.paramType1 === 'percent' || param1?.isPercent ? value1 + '%' : value1)
              .replace(/{Value}/gi, attribute.paramType1 === 'percent' || param1?.isPercent ? value1 + '%' : value1)
              .replace(/{min}-{max}/gi, attribute.paramType1 === 'percent' || param1?.isPercent ? value1 + '%' : value1)
              .replace(
                /{parameter1}/gi,
                attribute.paramType1 === 'percent' || param1?.isPercent ? value1 + '%' : value1
              )
              .replace(/{param1}/gi, attribute.paramType1 === 'percent' || param1?.isPercent ? value1 + '%' : value1)
              .replace(
                /{parameter2}/gi,
                attribute.paramType2 === 'percent' || param2?.isPercent ? value2 + '%' : value2
              )
              .replace(/{param2}/gi, attribute.paramType2 === 'percent' || param2?.isPercent ? value2 + '%' : value2)
              .replace(
                /{parameter3}/gi,
                attribute.paramType3 === 'percent' || param3?.isPercent ? value3 + '%' : value3
              )
              .replace(/{param3}/gi, attribute.paramType3 === 'percent' || param3?.isPercent ? value3 + '%' : value3)
              .replace('(Not Implemented)', '')
              .replace(/\.$/, '')
              .replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
            const explanation = attribute.explanation
              ?.replace(/{value}/gi, attribute.paramType1 === 'percent' || param1?.isPercent ? value1 + '%' : value1)
              .replace(/{Value}/gi, attribute.paramType1 === 'percent' || param1?.isPercent ? value1 + '%' : value1)
              .replace(/{min}-{max}/gi, attribute.paramType1 === 'percent' || param1?.isPercent ? value1 + '%' : value1)
              .replace(
                /{parameter1}/gi,
                attribute.paramType1 === 'percent' || param1?.isPercent ? value1 + '%' : value1
              )
              .replace(/{param1}/gi, attribute.paramType1 === 'percent' || param1?.isPercent ? value1 + '%' : value1)
              .replace(
                /{parameter2}/gi,
                attribute.paramType2 === 'percent' || param2?.isPercent ? value2 + '%' : value2
              )
              .replace(/{param2}/gi, attribute.paramType2 === 'percent' || param2?.isPercent ? value2 + '%' : value2)
              .replace(
                /{parameter3}/gi,
                attribute.paramType3 === 'percent' || param3?.isPercent ? value3 + '%' : value3
              )
              .replace(/{param3}/gi, attribute.paramType3 === 'percent' || param3?.isPercent ? value3 + '%' : value3)
              .replace('(Not Implemented)', '')
              .replace(/\.$/, '')
              .replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
            // .replace(/{parameter2}/gi, attribute.paramType2 === 'percent' || param2?.isPercent ? value2 + '%' : value2)
            // .replace(/{param2}/gi, attribute.paramType2 === 'percent' || param2?.isPercent ? value2 + '%' : value2)
            // .replace(/{parameter3}/gi, attribute.paramType3 === 'percent' || param3?.isPercent ? value3 + '%' : value3)
            // .replace(/{param3}/gi, attribute.paramType3 === 'percent' || param3?.isPercent ? value3 + '%' : value3)
            // const attr = attribute.description
            //   .replace('{parameter1}', value)
            //   .replace('{param1}', value)
            //   .replace('{value}', value)
            //   .replace('{Value}', value)
            //   .replace('{min}-{max}', value)

            if (!attr) return <div key={attr}></div>;
            if (attribute.ignore) return <div key={attr}></div>;
            if (attribute.id === 40) return <div key={attr}></div>;
            if (attribute.id === ItemAttributesByName[1].Sockets.id) return <div key={attr}></div>;
            if (attribute.id === ItemAttributesByName[1].Rarity.id) return <div key={attr}></div>;

            // if (attribute.id === ItemAttributesByName[1].Sockets.id) {
            //   return (
            //     <ItemAttributeCenter key={attr} style={{marginTop: 10}}>
            //       Socketed ({attribute.value})
            //     </ItemAttributeCenter>
            //   )
            // }
            if (attribute.id === ItemAttributesByName[1].SpecificClass.id) {
              return null;
              // return (
              //   <ItemAttributeCenter key={attr} style={{ marginTop: 10 }}>
              //     {attr}
              //   </ItemAttributeCenter>
              // )
            }

            return (
              <ItemAttribute key={attr}>
                {attribute.explanation ? (
                  <Tooltip content={t(explanation)} style={{ textShadow: 'none' }}>
                    {attr}
                  </Tooltip>
                ) : (
                  attr
                )}{' '}
                {isNotImplemented ? (
                  <Tooltip content={t('This attribute has not been implemented yet')} style={{ textShadow: 'none' }}>
                    <NotImplemented>*</NotImplemented>
                  </Tooltip>
                ) : null}
                {/* • */}
                {!hideRoll ? (
                  attribute.min !== attribute.max ? (
                    <Tooltip
                      content={`This attribute can roll a range between ${attribute.min}-${attribute.max}`}
                      style={{ textShadow: 'none' }}>
                      <span style={{ color: '#bbb', display: 'inline-block', margin: '0 3px' }}>
                        {/* [<span style={{color: 'rgb(231 134 134)'}}>{attribute.min}</span>-<span style={{color: '#9ae786'}}>{attribute.max}</span>] */}
                        [<span>{attribute.min}</span>-<span>{attribute.max}</span>]
                      </span>
                    </Tooltip>
                  ) : attribute.value !== undefined ? (
                    <>
                      {/* <br />
                      <span style={{ fontSize: 12, color: 'grey' }}>Always: {attribute.value}</span> */}
                    </>
                  ) : (
                    <></>
                  )
                ) : null}
              </ItemAttribute>
            );
          })}
        </ItemAttributeList>
      ) : null}
      {!isRune && gameTabIndex !== 0 ? (
        <em style={{ fontSize: '0.9rem', color: 'rgb(255 156 149)' }}>
          <br />
          Note: These attributes are tentative and will likely be balanced many times.
          <br />
        </em>
      ) : null}
      {isRune && item.branches
        ? Object.keys(item.branches).map((i) => (
            <div key={i} style={{ textAlign: 'left', marginBottom: 10 }}>
              <strong>{GameTitleMap[i]}:</strong> {item.branches[i].description || 'Not announced yet.'}
            </div>
          ))
        : null}
      {!hideDetails ? (
        <>
          <br />
          <ItemDescription>
            {Array.isArray(description) ? (
              description
                .filter((d) => !!d)
                .map((desc, index) => (
                  <div key={index}>
                    {/* {index === 0 ? <TypeWriter text={desc} /> : desc} */}
                    <Linker id={`item-desc-array-${index}`} replaceItems={false}>
                      {desc}
                    </Linker>
                    <br />
                    <br />
                  </div>
                ))
            ) : (
              <>
                {/* <TypeWriter text={description} /> */}
                <Linker id="item-desc-1" replaceItems={false}>
                  {description}
                </Linker>
                <br />
                <br />
              </>
            )}
          </ItemDescription>
          <Divider rarity={item.rarity?.name} />
          {userNotes[item.tokenId] ? (
            <div style={{ textAlign: 'left' }}>
              {userNotes[item.tokenId]}
              <Divider rarity={item.rarity?.name} />
            </div>
          ) : null}
          {item.meta?.classRequired ? (
            <DetailItem>
              <span>Requires:</span> {ClassNames[item.meta.classRequired]}
            </DetailItem>
          ) : null}
          {item.isSkinnable ? (
            <DetailItem>
              <span>Skin Claimable:</span>{' '}
              {tokenSkins[item.tokenId] !== undefined ? (
                <span style={{ color: '#d74144' }}>No</span>
              ) : (
                <span style={{ color: '#42d741' }}>Yes</span>
              )}
            </DetailItem>
          ) : null}
          {branch.maxCharge ? (
            <DetailItem>
              <Tooltip
                content={t(
                  `When the charge reaches zero, the item won't be usable until recharged. There are no known way to charge runewords yet, until one is found.`
                )}
                style={{ textShadow: 'none' }}>
                <span>Charge:</span>{' '}
                {branch.currentCharge ? toFixed((branch.currentCharge / branch.maxCharge) * 100, 0) + '%' : 'Unknown'}
              </Tooltip>
            </DetailItem>
          ) : null}
          {item.transmutingPotential ? (
            <DetailItem>
              <span>Transmuting Potential:</span> {item.transmutingPotential}
            </DetailItem>
          ) : null}
          {/* style={{color: '#d74144'}} */}
        </>
      ) : null}
      {price && item.details?.Symbol ? (
        <div style={{ marginBottom: 20 }}>
          <Text mr="10px" bold>
            Market Price:
          </Text>{' '}
          <Text bold fontSize="24px" style={{ lineHeight: '36px' }}>
            $ {price.toFixed(2)}
          </Text>
          <br />
          <WalletBalance balance={item.value} symbol={item.details.Symbol} />
        </div>
      ) : null}
      {children}
      {showBranches ? (
        <div style={{ marginBottom: 20, marginTop: 20 }}>
          <ButtonMenu activeIndex={gameTabIndex} scale="xs" onItemClick={(index) => setGameTabIndex(index)}>
            <ButtonMenuItem>{t('Raid')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Evolution')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Infinite')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Sanctuary')}</ButtonMenuItem>
          </ButtonMenu>
        </div>
      ) : null}
      {!hideMetadata && item.meta ? (
        <Button style={{ color: '#fff' }} variant="text" onClick={() => setMetadataExpanded(!metadataExpanded)}>
          {metadataExpanded ? 'Hide' : 'Show'} Metadata
        </Button>
      ) : null}
      {!hideMetadata && metadataExpanded && item.meta ? (
        <ItemMeta>
          {/* <strong>Metadata:</strong>
          <br /> */}
          <div style={{ textAlign: 'left', fontSize: '0.9rem', lineHeight: '1.1rem' }}>
            {item.branches[1].perfection?.length && item.shorthand ? (
              <>
                <strong>Roll:</strong> {item.shorthand ? `${item.shorthand}` : ''} (out of{' '}
                {item.branches[1].perfection.filter((p) => p !== undefined && p !== null).join('-')})
              </>
            ) : null}
            <br />
            {item.perfection !== null && !Number.isNaN(item.perfection) ? (
              <>
                <strong>Perfection:</strong> {(item.perfection * 100).toFixed(0)}%
              </>
            ) : null}
            {item.meta.probability ? (
              <>
                <Mod>
                  <strong>Roll Probability:</strong> 1 out of {(1 / item.meta.probability.roll).toFixed(2)}
                </Mod>
                <Mod>
                  <strong>Mythic Probability:</strong> 1 out of {(1 / item.meta.probability.mythic).toFixed(2)}
                </Mod>
                <Mod>
                  <strong>Epic Probability:</strong> 1 out of {(1 / item.meta.probability.epic).toFixed(2)}
                </Mod>
                <Mod>
                  <strong>Rare Probability:</strong> 1 out of {(1 / item.meta.probability.rare).toFixed(2)}
                </Mod>
                <Mod>
                  <strong>Magical Probability:</strong> 1 out of {(1 / item.meta.probability.magical).toFixed(2)}
                </Mod>
              </>
            ) : null}
            {item.meta.unstakeLocked ? (
              <Mod>
                <strong>Unstake Locked:</strong> When Equipped, Until End of Raid
              </Mod>
            ) : null}
            {item.meta.classRequired ? (
              <Mod>
                <strong>Class Required:</strong> {ClassNames[item.meta.classRequired]}
              </Mod>
            ) : null}
            {item.meta.worldstoneShardChance > 0 ? (
              <Mod>
                <strong>Chance To Find Worldstone Shard:</strong> {item.meta.worldstoneShardChance}%
              </Mod>
            ) : null}
            {item.meta.chanceToSendHarvestToHiddenPool > 0 ? (
              <Mod>
                <strong>Chance To Send Harvest To Hidden Pool:</strong> {item.meta.chanceToSendHarvestToHiddenPool}%
              </Mod>
            ) : null}
            {item.meta.chanceToLoseHarvest > 0 ? (
              <Mod>
                <strong>Chance To Lose Harvest:</strong> {item.meta.chanceToLoseHarvest}%
              </Mod>
            ) : null}
            {item.meta.randomRuneExchange > 0 ? (
              <Mod>
                <strong>Harvest Random Rune Exchange:</strong> {item.meta.randomRuneExchange}%
              </Mod>
            ) : null}
            {item.meta.harvestYield > 0 ? (
              <Mod>
                <strong>Harvest Yield Bonus:</strong> {item.meta.harvestYield}%
              </Mod>
            ) : null}
            {item.meta.harvestBurn > 0 ? (
              <Mod>
                <strong>Harvest Burned:</strong> {item.meta.harvestBurn}%
              </Mod>
            ) : null}
            {item.meta.harvestFees
              ? Object.keys(item.meta.harvestFees).map((key) => (
                  <Mod key={key}>
                    <strong>Harvest Fee:</strong> {item.meta.harvestFees[key]}% {key}
                  </Mod>
                ))
              : null}
            {item.meta.feeReduction > 0 ? (
              <Mod>
                <strong>Reduced Harvest Fees:</strong> {item.meta.feeReduction}%
              </Mod>
            ) : null}
            <Mod>
              <strong>Item ID:</strong> {item.id}
            </Mod>
            <Mod>
              <strong>Item Type:</strong> {ItemTypeNames[item.type]} ({item.type})
            </Mod>
            <Mod>
              <strong>Item Rarity:</strong> {item.rarity?.name}
            </Mod>
            <Mod>
              <strong>Total Attributes:</strong> {item.attributes.length}
            </Mod>
            <Mod>
              <strong>Item Slots:</strong>{' '}
              {item.slots.length ? item.slots.map((slot) => `${ItemSlotToText[slot]} (${slot})`).join(', ') : 'None'}
            </Mod>
            <Mod>
              <strong>Runeform?</strong> {item.isRuneword ? 'Yes' : 'No'}
            </Mod>
            <Mod>
              <strong>Craftable?</strong> {item.isCraftable ? 'Yes' : 'No'}
            </Mod>
            <Mod>
              <strong>Transferable?</strong> {item.isTransferable ? 'Yes' : item.isEquipped ? 'No, is equipped' : 'No'}
            </Mod>
            <Mod>
              <strong>Tradeable?</strong> {item.isTradeable ? 'Yes' : item.isEquipped ? 'No, is equipped' : 'No'}
            </Mod>
            <Mod>
              <strong>Equipable?</strong> {item.isEquipable ? 'Yes' : item.isEquipped ? 'No, is equipped' : 'No'}
            </Mod>
            {!hideTokenId ? (
              <Mod>
                <Link target="_blank" to={`/token/${item.tokenId}`}>
                  <strong>Token ID:</strong> {item.shortTokenId || 'Not set'}
                </Link>
              </Mod>
            ) : null}
            <Mod>
              <strong>Total Minted:</strong> {totalMinted}
            </Mod>
            {item.ownerUsername ? (
              <Mod>
                <strong>Owner:</strong> <RouterLink to={`/user/${item.ownerUsername}`}>{item.ownerAddress}</RouterLink>
              </Mod>
            ) : null}
            {item.tokenIds ? (
              <Mod>
                <strong>Token IDs:</strong>{' '}
                {item.tokenIds.map((tokenId) => (
                  <span key={tokenId}>
                    <RouterLink to={`/token/${tokenId}`}>
                      {tokenId.slice(0, 7)}...{tokenId.slice(-7)}
                    </RouterLink>
                    ,{' '}
                  </span>
                ))}
              </Mod>
            ) : null}
          </div>
        </ItemMeta>
      ) : null}
    </Container>
  );
};

export default ItemInfo;
