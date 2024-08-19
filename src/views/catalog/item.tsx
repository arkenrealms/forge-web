import itemAttributes from '@arken/node/data/generated/itemAttributes.json';
import itemData from '@arken/node/data/generated/items.json';
import itemSpecificTypes from '@arken/node/data/generated/itemSpecificTypes.json';
import itemTypes from '@arken/node/data/generated/itemTypes.json';
import items, { ItemRarity, RuneNames } from '@arken/node/data/items';
import { ItemsMainCategoriesType } from '@arken/node/data/items.type';
import { normalizeItem } from '@arken/node/util/decoder';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styled, { css } from 'styled-components';
import ItemCatalogFull from '~/components/ItemCatalogFull';
import ItemInformation from '~/components/ItemInformation';
import LoreContainer from '~/components/LoreContainer';
import { RecipeInfo } from '~/components/RecipeInfo';
import useCache from '~/hooks/useCache';
import useWeb3 from '~/hooks/useWeb3';
import { BaseLayout, Card, CardBody, CardHeader, Flex, Heading, Text } from '~/ui';

const Wrapper = styled.div`
  // ol {
  //   list-style: none;
  //   counter-reset: li;
  // }
  // ol li {
  //   counter-increment: li;
  //   margin-bottom: 4px;
  // }
  // ol li::before {
  //   content: counter(li);
  //   color: #f0c980;
  //   font-family: 'Exocet';
  //   font-weight: 500;
  //   display: inline-block;
  //   width: 1em;
  //   margin-left: -1.5em;
  //   margin-right: 0.4em;
  //   text-align: right;
  //   direction: rtl;
  //   padding-right: 0.4em;
  //   border-right: 2px solid #6d0000;
  // }

  // ul {
  //   list-style: none;
  //   counter-reset: li;
  // }
  // ul li {
  //   margin-bottom: 4px;
  // }
  // ul li::before {
  //   content: '';
  //   background-color: #6d0000;
  //   position: relative;
  //   width: 0.3em;
  //   top: -0.2em;
  //   margin-bottom: -2px;
  //   transform: rotate(45deg);
  //   height: 0.3em;
  //   display: inline-block;
  //   margin-left: -1.5em;
  //   margin-right: 0.4em;
  //   border: 1px solid #cccccc;
  // }
  // p {
  //   margin-bottom: 8px;
  //   text-indent: 8px;
  // }

  // p:first-of-type {
  //   text-indent: 0;
  // }
  // .bg-art {
  //   -webkit-mask-image: url(/images/6193355813c9abc7f059f7d6_mask-bottom-fullhd.png);
  //   -webkit-mask-position: bottom;
  //   -webkit-mask-size: contain;
  //   -webkit-mask-repeat: no-repeat;

  //   mask-image: url(https://assets.website-files.com/61888fc216a41f3be2f8ae35/618c8cbbf09b3420e8fc1075_css-mask-2.png);
  //   mask-position: bottom;
  //   mask-size: contain;
  //   mask-repeat: no-repeat;
  // }
  // .bg-art-top {
  //   -webkit-mask-image: url(/images/mask1.png);
  //   -webkit-mask-position: bottom;
  //   -webkit-mask-size: contain;
  //   -webkit-mask-repeat: no-repeat;

  //   mask-image: url(/images/mask1.png);
  //   mask-position: bottom;
  //   mask-size: contain;
  //   mask-repeat: no-repeat;
  // }
  // .frame {
  //   border-width: 1px;
  //   border-style: solid;
  //   border-color: transparent;
  //   border-image: url(/images/61933e0f25619deab717576c_frame.png) 80 /
  //     80px / 0 repeat;
  //   background-color: rgba(0, 0, 0, 0.4);
  //   border-radius: 0px;
  // }

  // .frame-light {
  //   border-width: 1px;
  //   border-style: solid;
  //   border-color: transparent;
  //   border-image: url(/images/61933e0f25619deab717576c_frame.png) 80 /
  //     80px / 0 repeat;
  //   background-color: rgba(0, 0, 0, 0.4);
  //   border-radius: 0px;
  // }
  // table {
  //   width: 100%;
  //   text-align: left;
  //   margin-top: 16px;
  // }

  // thead {
  //   border-bottom: 2px solid #7e7654;
  // }

  // th {
  //   padding-bottom: 5px;
  // }

  // td {
  //   padding: 5px 0;
  //   border-bottom: 1px solid rgb(255 255 255 / 8%);
  // }
  // tbody tr:hover {
  //   background-image: linear-gradient(90deg, rgba(213, 177, 109, 0.2), rgba(240, 201, 128, 0.02));
  // }
  // tbody tr:nth-child(odd) {
  //   background-color: #08ff3d0d;
  // }

  // .rich-text-block-7 p {
  //   color: black;
  //   text-shadow: none;
  // }

  padding: 30px;

  p {
    font-size: 1rem;
    color: #cfcbbf;
  }

  // background-image: -webkit-gradient(linear, left top, left bottom, from(transparent), to(transparent)),
  //   url('/images/bg-brighter.jpg');
  // background-image: linear-gradient(180deg, transparent, transparent),
  //   url('/images/bg-brighter.jpg');
  color: #c5bbad;
`;

const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;
  grid-gap: 75px;

  & > div {
    grid-column: span 6;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 12;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 6;
    }
  }
`;
const VerticalCards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;

  & > div {
    grid-column: span 12;
    align-items: start;
    width: 100%;
    background: #000;
  }
`;

const ItemContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-gap: 16px;

  & > div {
    min-height: 500px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ItemCard = styled.div`
  position: relative;
  font-weight: bold;
  padding: 20px;
  border-width: 15px;
  border-style: solid;
  border-color: transparent;
  border-image: url('/images/frame.png') 80 repeat;
  border-image-width: 80px;
  background: none;
  // transform: scale(0.8);
  text-shadow: 1px 1px 1px black;
  // box-shadow: 0 2px 0 0 rgb(0 0 0 / 80%), inset 0 -1px 0 0 rgb(0 0 0 / 10%), 0 0 66px 66px rgb(0 0 0 / 10%);
  filter: contrast(1.08);
  text-align: center;
  background: #000;
  color: #bb955e;
  text-shadow: 1px 1px 1px black;
  font-weight: bold;
  width: calc(100% - 0px);

  & > div {
    position: relative;
    z-index: 2;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
  }
`;

function setItemToRarity(item) {
  item.attributes = item.branches[1].attributes;
  for (const key in item.attributes) {
    if (!item.branches[1].perfection?.[key]) continue;

    item.attributes[key].value = item.branches[1].presets?.[item.rarity.id]?.[key]
      ? item.branches[1].presets[item.rarity.id][key]
      : item.branches[1].perfection[key];
  }

  item.mods = [{}, {}, {}, {}, {}, {}, {}, {}];

  return item;
}

const RuneInner = ({ active, match }) => {
  const { t } = useTranslation();
  const { id }: { id: string } = match.params;
  const cache = useCache();
  const { address: account } = useWeb3();
  const [currentBranch, setCurrentBranch] = useState(1);

  if (!active) return <></>;

  const item: any = items[ItemsMainCategoriesType.OTHER].find(
    (i) =>
      i.id === parseInt(id) ||
      (i.name.replace(/ /gi, '-').replace("'", '').toLowerCase() === id &&
        (account === '0xa987f487639920A3c2eFe58C8FBDedB96253ed9B' || (!i.isSecret && !(i as any).isUltraSecret)))
  );

  if (!item) return <>Item not found</>;

  const magicItem = normalizeItem(setItemToRarity({ ...JSON.parse(JSON.stringify(item)), rarity: ItemRarity.Magical }));
  const rareItem = normalizeItem(setItemToRarity({ ...JSON.parse(JSON.stringify(item)), rarity: ItemRarity.Rare }));
  const epicItem = normalizeItem(setItemToRarity({ ...JSON.parse(JSON.stringify(item)), rarity: ItemRarity.Epic }));
  const mythicItem = normalizeItem(setItemToRarity({ ...JSON.parse(JSON.stringify(item)), rarity: ItemRarity.Mythic }));
  const uniqueItem = normalizeItem(setItemToRarity({ ...JSON.parse(JSON.stringify(item)), rarity: ItemRarity.Unique }));
  const normalItem = normalizeItem(setItemToRarity({ ...JSON.parse(JSON.stringify(item)), rarity: ItemRarity.Normal }));

  const rawItem = itemData.find((i) => i.id === item.id);

  const lore1 = ''; // rawItem.lore1

  const itemType = itemTypes.find((i) => i.id === item.type)?.name;
  const specificType = itemSpecificTypes.find((i) => i.id === item.specificType)?.name;
  return (
    <Wrapper>
      <LoreContainer
        color="none"
        wrapperCss={css`
          padding: 30px;
        `}>
        <div className="div-block-32">
          <h1 className="heading-5 dark">{item.name}</h1>
          <div className="div-block-26">
            <div className="text-block-8 dark">{itemType}</div>
            {specificType !== itemType ? <div className="text-block-8 dark">, </div> : null}
            {specificType !== itemType ? <div className="text-block-8 dark">{specificType}</div> : null}
          </div>
          <div className="div-block-30 showsm">
            <img src={item.icon} loading="lazy" alt="" className="image-11" />
          </div>
          <div className="w-layout-grid">
            <div className="div-block-27">
              <div className="rich-text-block-8 w-richtext">
                <p>{item.visualDescription}</p>
              </div>
              <h2>game Description</h2>
              <div className="rich-text-block-8 w-richtext">
                <p>{item.description}</p>
              </div>
              <h2>game attributes</h2>
              <div className="text-block-11">
                Items have different attribute sets on each game. Select different games to see their respective
                attributes.
              </div>
              <div
                data-current="Raid"
                data-easing="ease"
                data-duration-in="300"
                data-duration-out="100"
                className="w-tabs">
                <div className="w-tab-menu" role="tablist">
                  <a
                    className={'tablink w-inline-block w-tab-link ' + (currentBranch === 1 ? 'w--current' : '')}
                    id="w-tabs-0-data-w-tab-0"
                    href="#"
                    role="tab"
                    aria-controls="w-tabs-0-data-w-pane-0"
                    aria-selected="true"
                    onClick={() => setCurrentBranch(1)}>
                    <div>Raid</div>
                  </a>
                  <a
                    className={'tablink w-inline-block w-tab-link ' + (currentBranch === 2 ? 'w--current' : '')}
                    id="w-tabs-0-data-w-tab-2"
                    href="#"
                    role="tab"
                    aria-controls="w-tabs-0-data-w-pane-2"
                    aria-selected="false"
                    onClick={() => setCurrentBranch(2)}>
                    <div>Evolution</div>
                  </a>
                  <a
                    className={'tablink w-inline-block w-tab-link ' + (currentBranch === 3 ? 'w--current' : '')}
                    id="w-tabs-0-data-w-tab-3"
                    href="#"
                    role="tab"
                    aria-controls="w-tabs-0-data-w-pane-3"
                    aria-selected="false"
                    onClick={() => setCurrentBranch(3)}>
                    <div>Infinite</div>
                  </a>
                  <a
                    className={'tablink w-inline-block w-tab-link ' + (currentBranch === 4 ? 'w--current' : '')}
                    id="w-tabs-0-data-w-tab-1"
                    href="#"
                    role="tab"
                    aria-controls="w-tabs-0-data-w-pane-1"
                    aria-selected="false"
                    onClick={() => setCurrentBranch(4)}>
                    <div>Sanctuary</div>
                  </a>
                </div>
                <div className="w-tab-content">
                  <div
                    className="w-tab-pane w--tab-active"
                    id="w-tabs-0-data-w-pane-0"
                    role="tabpanel"
                    aria-labelledby="w-tabs-0-data-w-tab-0">
                    <div className="rich-text-block-9 w-richtext">
                      <table className="lore-table-1">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th style={{ minWidth: 75 }}>Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {item.branches[currentBranch].attributes?.length ? (
                            Object.keys(item.branches[currentBranch].attributes).map((attributeId) => {
                              const attribute = item.branches[currentBranch].attributes[attributeId];

                              if (!attribute) return null;

                              const baseAttribute = itemAttributes.find((i) => i.id === parseInt(attributeId));

                              if (!baseAttribute?.description) return;
                              // if (attribute.id < 1000) return

                              const parent1 = attribute.param1 || attribute;

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

                              if (typeof value1 === 'string')
                                value1 = value1.replace(/Hidden Skill([ 0-9]*)/gi, 'Hidden Skill');

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

                              if (typeof value2 === 'string')
                                value2 = value2.replace(/Hidden Skill([ 0-9]*)/gi, 'Hidden Skill');

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

                              if (typeof value3 === 'string')
                                value3 = value3.replace(/Hidden Skill([ 0-9]*)/gi, 'Hidden Skill');

                              const isNotImplemented =
                                attribute.description?.indexOf('Not Implemented') !== -1 ||
                                attribute.isImplemented === false;

                              const attr = attribute.description
                                ?.replace(/{value}/gi, '')
                                .replace(/{Value}/gi, '')
                                .replace(/{min}-{max}/gi, '')
                                .replace(/{parameter1}/gi, '')
                                .replace(/{param1}/gi, '')
                                .replace(/{parameter2}/gi, '')
                                .replace(/{param2}/gi, '')
                                .replace(/{parameter3}/gi, '')
                                .replace(/{param3}/gi, '')
                                .replace('(Not Implemented)', '')
                                .replace(/\.$/, '')
                                .replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());

                              if (!attr?.trim()) return;

                              return (
                                <tr>
                                  <td>{attribute.displayName || attr.trim()}</td>
                                  <td>{value1}</td>
                                </tr>
                              );
                            })
                          ) : (
                            <>No attributes released yet</>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              id="w-node-_14738635-7e3d-2e3f-365c-55ed94c722f2-0166c121"
              className="div-block-28"
              css={css`
                max-width: 430px;
              `}>
              <div id="w-node-_9b3e23cc-fbe5-778e-95bd-af51cb77886f-0166c121" className="div-block-30 hidesm">
                <img src={item.icon} loading="eager" alt="" className="image-11" />
              </div>
              {lore1 ? (
                <div className="highlightblock1">
                  <div className="div-block-29">
                    <div className="ornament-circle1"></div>
                    <div className="ornament-circle2"></div>
                    <div className="ornament-circle3"></div>
                    <div className="ornament-circle4"></div>
                  </div>
                  <div className="rich-text-block-7 w-richtext">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{lore1}</ReactMarkdown>
                  </div>
                </div>
              ) : null}
              {item.recipe?.requirement?.length > 0 ? (
                <div>
                  <h2>RECIPE</h2>
                  <div className="rich-text-block-10 w-richtext">
                    {item.recipe.requirement.map((rune) => (
                      <div className={'rune rune' + RuneNames[rune.id].toLowerCase()} style={{ marginRight: 8 }}>
                        {RuneNames[rune.id].toUpperCase()}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </LoreContainer>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <Card style={{ overflow: 'visible', backgroundImage: 'none', marginBottom: 30 }}>
        <CardHeader>
          <Flex alignItems="center" justifyContent="space-between">
            <div>
              <Heading size="lg" mb="8px">
                {t('Rarity Examples')}
              </Heading>
              <Text as="p">
                {t(
                  'These are what the item could look like if it can be found in these rarities. Not many items can be found in all rarities.'
                )}
              </Text>
            </div>
          </Flex>
        </CardHeader>
        <CardBody>
          <div
            css={css`
              overflow-x: scroll;
              padding: 20px 0;
            `}>
            <Flex
              alignItems={['start', null, 'center']}
              justifyContent={['start', null, 'space-between']}
              flexDirection={['column', null, 'row']}>
              <Flex justifyContent="space-between" alignItems="center" style={{ marginRight: 10, background: '#000' }}>
                <ItemInformation item={magicItem} showActions={false} price={0} />
              </Flex>
              <Flex justifyContent="space-between" alignItems="center" style={{ marginRight: 10, background: '#000' }}>
                <ItemInformation item={rareItem} showActions={false} price={0} />
              </Flex>
              <Flex justifyContent="space-between" alignItems="center" style={{ marginRight: 10, background: '#000' }}>
                <ItemInformation item={epicItem} showActions={false} price={0} />
              </Flex>
              <Flex justifyContent="space-between" alignItems="center" style={{ marginRight: 10, background: '#000' }}>
                <ItemInformation item={mythicItem} showActions={false} price={0} />
              </Flex>
              <Flex justifyContent="space-between" alignItems="center" style={{ marginRight: 10, background: '#000' }}>
                <ItemInformation item={uniqueItem} showActions={false} price={0} />
              </Flex>
              <Flex justifyContent="space-between" alignItems="center" style={{ marginRight: 10, background: '#000' }}>
                <ItemInformation item={normalItem} showActions={false} price={0} />
              </Flex>
            </Flex>
          </div>
          <div
            css={css`
              overflow-x: scroll;
              padding: 20px 0;
            `}>
            <Flex
              alignItems={['start', null, 'center']}
              justifyContent={['start', null, 'space-between']}
              flexDirection={['column', null, 'row']}>
              <Flex justifyContent="space-between" alignItems="center" style={{ marginRight: 10, background: '#000' }}>
                <ItemInformation
                  item={magicItem}
                  showActions={false}
                  price={0}
                  hideRoll
                  showPerfection={false}
                  showBranches={false}
                  hideMetadata
                />
              </Flex>
              <Flex justifyContent="space-between" alignItems="center" style={{ marginRight: 10, background: '#000' }}>
                <ItemInformation
                  item={rareItem}
                  showActions={false}
                  price={0}
                  hideRoll
                  showPerfection={false}
                  showBranches={false}
                  hideMetadata
                />
              </Flex>
              <Flex justifyContent="space-between" alignItems="center" style={{ marginRight: 10, background: '#000' }}>
                <ItemInformation
                  item={epicItem}
                  showActions={false}
                  price={0}
                  hideRoll
                  showPerfection={false}
                  showBranches={false}
                  hideMetadata
                />
              </Flex>
              <Flex justifyContent="space-between" alignItems="center" style={{ marginRight: 10, background: '#000' }}>
                <ItemInformation
                  item={mythicItem}
                  showActions={false}
                  price={0}
                  hideRoll
                  showPerfection={false}
                  showBranches={false}
                  hideMetadata
                />
              </Flex>
              <Flex justifyContent="space-between" alignItems="center" style={{ marginRight: 10, background: '#000' }}>
                <ItemInformation
                  item={uniqueItem}
                  showActions={false}
                  price={0}
                  hideRoll
                  showPerfection={false}
                  showBranches={false}
                  hideMetadata
                />
              </Flex>
              <Flex justifyContent="space-between" alignItems="center" style={{ marginRight: 10, background: '#000' }}>
                <ItemInformation
                  item={normalItem}
                  showActions={false}
                  price={0}
                  hideRoll
                  showPerfection={false}
                  showBranches={false}
                  hideMetadata
                />
              </Flex>
            </Flex>
          </div>
        </CardBody>
      </Card>

      <Card style={{ overflow: 'visible', backgroundImage: 'none' }}>
        <CardHeader>
          <Flex alignItems="center" justifyContent="space-between">
            <div>
              <Heading size="lg" mb="8px">
                {t('Minted Items')}
              </Heading>
              <Text as="p">{t('Browse all minted items and soon be able to make an offer.')}</Text>
            </div>
          </Flex>
        </CardHeader>
        <CardBody css={css``}>
          <ItemCatalogFull itemId={item.id} autoColumn rightSidedInfo />
        </CardBody>
      </Card>
      <br />
      <br />
      <div style={{ padding: 20 }}>
        <ItemCard style={{ maxWidth: 410 }}>
          <RecipeInfo item={item} showCraftButton showMarketButton />
        </ItemCard>
      </div>
    </Wrapper>
  );
};

export default RuneInner;
