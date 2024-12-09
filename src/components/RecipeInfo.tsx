import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Select } from 'antd';
import { Link as RouterLink } from 'react-router-dom';
import { itemData } from '@arken/node/data/items';
import styled from 'styled-components';
import Tooltip from '~/components/Tooltip/Tooltip';
import useCache from '~/hooks/useCache';
import useMatchBreakpoints from '~/hooks/useMatchBreakpoints';
import { Button, ButtonMenu, ButtonMenuItem } from '~/ui';

const RecipeName = styled.div`
  font-size: 2.3rem;
  line-height: 2.3rem;
  margin-bottom: 10px;
  z-index: 1;
`;

const ItemType = styled.div<{ rarity?: string }>`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.85);
  margin: 10px 0 5px;
  text-shadow: 0 0 1px #000;
  z-index: 1;
  margin-bottom: 10px;
  ${({ rarity }) => (rarity === 'Legendary' ? 'color: rgba(185,147,93,1);' : '')}
  ${({ rarity }) => (rarity === 'Unique' ? 'color: rgba(185,147,93,1);' : '')}
  ${({ rarity }) => (rarity === 'Mythic' ? 'color: #c38585;' : '')}
  ${({ rarity }) => (rarity === 'Epic' ? 'color: #b885c3;' : '')}
  ${({ rarity }) => (rarity === 'Rare' ? 'color: #c2c385;' : '')}
  ${({ rarity }) => (rarity === 'Magical' ? 'color: #a9c5f7;' : '')}
`;
const NotImplemented = styled.span`
  color: #b9463e;
  font-weight: bold;
  font-size: 0.9rem;
  vertical-align: top;
  margin: 0 3px 0 -2px;
`;

const ItemSubType = styled.div`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 5px 0;
  z-index: 1;
`;

const RecipeRequirements = styled.div``;

const RecipeRequirement = styled.div`
  display: inline-block;
  color: #fff;
  margin-right: 10px;
  font-size: 1.2rem;
`;

const RecipeDescription = styled.div`
  font-style: italic;
  font-size: 0.9em;
  color: #bbb;
  margin-bottom: 10px;
  line-height: 20px;
`;

const RecipeAttributes = styled.div`
  text-align: left;
`;

const RecipeAttribute = styled.div`
  line-height: 1.8rem;
  color: #7576df;
  font-size: 1.2rem;
  position: relative;
  // padding-left: 17px;
  font-weight: normal;

  & > div {
    font-size: 1.2rem;
  }

  // &:before {
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  //   content: '•';
  // }
`;

const ItemAttributeCenter = styled.div`
  line-height: 25px;
  color: #7576df;
  font-size: 1.2rem;
  position: relative;
  padding-left: 12px;
  text-shadow: 0 0 1px #7576df;
  text-align: center;
`;

const RecipeRunes = styled.div`
  font-size: 1.3rem;
  margin: 15px 0 5px;

  letter-spacing: 0.1rem;
  z-index: 1;
`;

const Container = styled.div`
  position: relative;
  padding-bottom: 150px;
  height: 100%;
  width: 100%;
  z-index: 1;
`;

const ItemImage = styled.div<{ path: string }>`
  position: absolute !important;
  top: -20px;
  right: -20px;
  width: calc(256px / 3);
  height: calc(256px / 3);
  z-index: -1;
  background: url(${({ path }) => path}) no-repeat 0 0;
  background-size: 100% 100%;
  filter: contrast(1.1) drop-shadow(1px 2px 3px black);
  opacity: 0.9;

  ${({ theme }) => theme.mediaQueries.md} {
    top: -20px;
    right: -20px;
    width: calc(256px / 2);
    height: calc(256px / 2);
  }
`;

const Footer = styled.div`
  position: absolute;
  bottom: -15px;
  width: 100%;
  height: auto;
  text-align: center;
`;

const Video = styled.video`
  position: relative;
  z-index: 1;
`;

export const RecipeInfo: React.FC<any> = ({
  item,
  showBranches = true,
  showCraftButton = false,
  showMarketButton = false,
  showStatus = false,
  showStats = false,
  showDetailsButton = false,
}) => {
  const cache = useCache();
  const { t } = useTranslation();
  const [gameTabIndex, setGameTabIndex] = useState(0);

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

  let description = item.branches[gameTabIndex + 1]?.description || item.description;
  if (item.id === 1212) {
    description = `Redeemed for a random runeword: ${itemData.runeword
      .filter((i) => i.isCraftable && !i.isSecret && !(i as any).isUltraSecret)
      .map((i) => i.name)
      .join(', ')} (the list will be updated with new runeforms, and retired runeforms will be removed)`;
  }

  const gameOptions = [
    { value: 0, label: 'Runic Raids' },
    { value: 1, label: 'Evolution Isles' },
    { value: 2, label: 'Infinite Arena' },
    { value: 3, label: 'Heart of the Oasis' },
  ];

  return (
    <Container>
      <ItemImage path={item.icon} />
      <RecipeName>{item.name}</RecipeName>
      {item.rarity?.name ? (
        <ItemType rarity={item.rarity?.name}>
          {item.rarity?.name} {item.details?.['Type']}
        </ItemType>
      ) : null}
      {!item.rarity?.name && item.details?.['Type'] ? <ItemType>{item.details?.['Type']}</ItemType> : null}
      {/* <ItemType>{item.details?.['Type']}</ItemType> */}
      <ItemSubType>{item.details?.['Subtype']}</ItemSubType>
      {item?.details['Runeform'] ? <RecipeRunes>&apos;{item.details?.['Runeform']}&apos;</RecipeRunes> : null}
      <br />

      <RecipeDescription>{description}</RecipeDescription>
      <RecipeAttributes>
        {item.branches[gameTabIndex + 1]?.attributes.map((attribute) => {
          if (attribute.id === 40) return;

          if (!attribute.param1) {
            attribute.param1 = {
              min: attribute.min,
              max: attribute.max,
              value: attribute.value,
              map: attribute.map,
            };
          }
          const { param1, param2, param3 } = attribute;

          let value1 = param1.map
            ? Object.values(param1.map)
                .slice(
                  param1.min - parseInt(Object.keys(param1.map)[0]),
                  param1.max - parseInt(Object.keys(param1.map)[0]) + 1
                )
                .join(' or ')
            : param1.value !== undefined
              ? param1.value
              : param1.min === param1.max
                ? param1.min
                : `${param1.min}-${param1.max}`;

          if (typeof value1 === 'string') value1 = value1.replace(/Hidden Skill([ 0-9]*)/gi, 'Hidden Skill');

          const value2 = param2
            ? param2.map
              ? Object.values(param2.map)
                  .slice(
                    param2.min - parseInt(Object.keys(param2.map)[0]),
                    param2.max - parseInt(Object.keys(param2.map)[0]) + 1
                  )
                  .join(' or ')
              : param2.value !== undefined
                ? param2.value
                : param2.min === param2.max
                  ? param2.min
                  : `${param2.min}-${param2.max}`
            : '';

          const value3 = param3
            ? param3.map
              ? Object.values(param3.map)
                  .slice(
                    param3.min - parseInt(Object.keys(param3.map)[0]),
                    param3.max - parseInt(Object.keys(param3.map)[0]) + 1
                  )
                  .join(' or ')
              : param3.value !== undefined
                ? param3.value
                : param3.min === param3.max
                  ? param3.min
                  : `${param3.min}-${attribute.param3.max}`
            : '';

          const attr = attribute.description
            ?.replace(/{value}/gi, attribute.paramType1 === 'percent' || param1?.isPercent ? value1 + '%' : value1)
            .replace(/{Value}/gi, attribute.paramType1 === 'percent' || param1?.isPercent ? value1 + '%' : value1)
            .replace(/{min}-{max}/gi, attribute.paramType1 === 'percent' || param1?.isPercent ? value1 + '%' : value1)
            .replace(/{parameter1}/gi, attribute.paramType1 === 'percent' || param1?.isPercent ? value1 + '%' : value1)
            .replace(/{param1}/gi, attribute.paramType1 === 'percent' || param1?.isPercent ? value1 + '%' : value1)
            .replace(/{parameter2}/gi, attribute.paramType2 === 'percent' || param2?.isPercent ? value2 + '%' : value2)
            .replace(/{param2}/gi, attribute.paramType2 === 'percent' || param2?.isPercent ? value2 + '%' : value2)
            .replace(/{parameter3}/gi, attribute.paramType3 === 'percent' || param3?.isPercent ? value3 + '%' : value3)
            .replace(/{param3}/gi, attribute.paramType3 === 'percent' || param3?.isPercent ? value3 + '%' : value3)
            .replace('(Not Implemented)', '')
            .replace(/\.$/, '')
            .replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
          const explanation = attribute.explanation
            ?.replace(/{value}/gi, attribute.paramType1 === 'percent' || param1?.isPercent ? value1 + '%' : value1)
            .replace(/{Value}/gi, attribute.paramType1 === 'percent' || param1?.isPercent ? value1 + '%' : value1)
            .replace(/{min}-{max}/gi, attribute.paramType1 === 'percent' || param1?.isPercent ? value1 + '%' : value1)
            .replace(/{parameter1}/gi, attribute.paramType1 === 'percent' || param1?.isPercent ? value1 + '%' : value1)
            .replace(/{param1}/gi, attribute.paramType1 === 'percent' || param1?.isPercent ? value1 + '%' : value1)
            .replace(/{parameter2}/gi, attribute.paramType2 === 'percent' || param2?.isPercent ? value2 + '%' : value2)
            .replace(/{param2}/gi, attribute.paramType2 === 'percent' || param2?.isPercent ? value2 + '%' : value2)
            .replace(/{parameter3}/gi, attribute.paramType3 === 'percent' || param3?.isPercent ? value3 + '%' : value3)
            .replace(/{param3}/gi, attribute.paramType3 === 'percent' || param3?.isPercent ? value3 + '%' : value3)
            .replace('(Not Implemented)', '')
            .replace(/\.$/, '')
            .replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());

          if (!attr) return;
          // if (attribute.id === ItemAttributesByName[1].Sockets.id) {
          //   return (
          //     <ItemAttributeCenter key={attr} style={{marginTop: 10}}>
          //       Socketed ({attribute.value})
          //     </ItemAttributeCenter>
          //   )
          // }

          const isNotImplemented =
            attribute.description?.indexOf('Not Implemented') !== -1 || attribute.isImplemented === false;

          return (
            <RecipeAttribute key={attr}>
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
              {attribute.min !== attribute.max ? (
                <Tooltip
                  content={`This attribute can roll a range between ${attribute.min}-${attribute.max}`}
                  style={{ textShadow: 'none' }}>
                  <span style={{ color: '#bbb', display: 'inline-block', margin: '0 3px' }}>
                    {/* [<span style={{color: 'rgb(231 134 134)'}}>{attribute.min}</span>-<span style={{color: '#9ae786'}}>{attribute.max}</span>] */}
                    [<span>{attribute.min}</span>-<span>{attribute.max}</span>]
                  </span>
                </Tooltip>
              ) : null}
            </RecipeAttribute>
          );
        })}
      </RecipeAttributes>
      {gameTabIndex !== 0 ? (
        <em style={{ fontSize: '0.9rem', color: 'rgb(255 156 149)' }}>
          <br />
          Note: These attributes are tentative and will likely be balanced many times.
          <br />
        </em>
      ) : null}
      {!isMobile && item.video ? (
        <Video width="100%" height="240" ref={videoRef} loop autoPlay muted>
          <source src={item.video} type="video/mp4" />
        </Video>
      ) : null}
      <Footer>
        {showBranches ? (
          <Select
            prefix="Game: "
            placeholder="Choose"
            defaultValue={gameOptions.find((go) => go.value === gameTabIndex).label}
            onChange={(value: string) => setGameTabIndex(value)}
            options={gameOptions}
          />
        ) : null}
        <br />
        {showStatus && (item.isCraftable || item.isRetired) ? (
          <div style={{ marginBottom: 10, marginTop: 10 }}>
            Status: {item.isCraftable ? 'Available' : item.isRetired ? 'Retired' : 'Unknown'}
          </div>
        ) : null}
        {showStats && cache.stats.items[item.id] ? (
          <div style={{ marginBottom: 10, marginTop: 10 }}>Minted: {cache.stats.items[item.id]?.total}</div>
        ) : null}
        {showCraftButton ? (
          <>
            <Button
              disabled={!item.isCraftable}
              as={RouterLink}
              scale="sm"
              to={`/transmute/${item.name.toLowerCase()}`}
              mt="20px">
              {item.isCraftable ? 'Craft' : 'Not Craftable'}
            </Button>
            &nbsp;
          </>
        ) : null}
        {showMarketButton ? (
          <>
            {item.isTradeable ? (
              <Button as={RouterLink} scale="sm" to={`/market/?tab=2&query=${item.name.toLowerCase()}`} mt="20px">
                Market
              </Button>
            ) : (
              <Button disabled scale="sm" mt="20px">
                Not Tradeable
              </Button>
            )}
            &nbsp;
          </>
        ) : null}
        {showDetailsButton ? (
          <Button
            as={RouterLink}
            scale="sm"
            to={`/item/${item.name?.toLowerCase().replace(/'/gi, '').replace(/ /gi, '-')}`}
            mt="20px">
            Details
          </Button>
        ) : null}
      </Footer>
    </Container>
  );
};

export default RecipeInfo;
