import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getFilteredItems, itemData } from '@arken/node/data/items';
import { ItemsMainCategoriesType } from '@arken/node/data/items.type';
import { decodeItem } from '@arken/node/util/decoder';
import styled, { css } from 'styled-components';
import useSound from 'use-sound';
import Inventory from '~/components/Inventory';
import Item from '~/components/Item';
import ItemCatalogFull from '~/components/ItemCatalogFull';
import { ItemInfo } from '~/components/ItemInfo';
import Page from '~/components/layout/Page';
import { RecipeInfo } from '~/components/RecipeInfo';
import TipCard from '~/components/TipCard';
import useInventory from '~/hooks/useInventory';
import { Button, Flex, Heading } from '~/ui';
import getItems from '~/utils/getItems';
import Transmute from './TransmuteBox';

// itemData[ItemsMainCategoriesType.OTHER] = itemData[ItemsMainCategoriesType.OTHER].filter(r => !!r)

const Image = styled.img`
  width: 100%;
  filter: contrast(1.1);
  line-height: 0;
  ${({ theme }) => theme.mediaQueries.md} {
    max-width: 670px;
  }
`;

const Runes = styled.div``;

const Rune = styled.div<{ position: number }>`
  position: absolute;
  filter: drop-shadow(2px 4px 6px black);
  zoom: 0.7;
  z-index: 999;

  ${({ theme }) => theme.mediaQueries.sm} {
    zoom: 1;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    zoom: 1;
  }

  ${({ position }) => {
    if (position === 0)
      return `
      top: 40%;
      left: 39%;
    `;
    if (position === 1)
      return `
      top: 40%;
      left: 53%;
    `;
    if (position === 2)
      return `
      top: 50%;
      left: 55.5%;
    `;
    if (position === 3)
      return `
      top: 55%;
      left: 45.5%;
    `;
    if (position === 4)
      return `
      top: 49%;
      left: 36%;
    `;
  }}
`;

const CubeContainer = styled.div`
  width: 100%;
  // box-shadow: 0 2px 0 0 rgb(0 0 0 / 80%), inset 0 -1px 0 0 rgb(0 0 0 / 10%), 0 0 66px 66px rgb(0 0 0 / 10%);

  margin: 0 0 30px;
  ${({ theme }) => theme.mediaQueries.md} {
  }
`;

const CubeContainer2 = styled.div`
  border-width: 10px;
  border-style: solid;
  border-color: transparent;
  border-image: url('/images/frame.png') 80 repeat;
  border-image-width: 80px;
  background-image: url(/images/background.jpeg);
  background-size: 400px;
  margin-bottom: 25px;

  ${({ theme }) => theme.mediaQueries.lg} {
    margin-right: 25px;
  }

  max-width: 700px;
  zoom: 0.9;
  float: left;
  line-height: 0;
`;

const CubeContainer3 = styled.div`
  background: transparent;
  color: #bb955e;
  position: relative;
`;

const InventoryContainer = styled.div`
  width: 100%;
  box-shadow: 0 2px 0 0 rgb(0 0 0 / 80%), inset 0 -1px 0 0 rgb(0 0 0 / 10%), 0 0 66px 66px rgb(0 0 0 / 10%);
  max-width: 100%;
  float: right;
  margin-bottom: 50px;

  ${({ theme }) => theme.mediaQueries.md} {
    width: 495px;
  }
`;

const InventoryContainer2 = styled.div`
  background: #000;
  border-width: 15px;
  border-style: solid;
  border-color: transparent;
  border-image: url('/images/frame.png') 80 repeat;
  border-image-width: 80px;
`;

const InventoryContainer3 = styled.div`
  color: #bb955e;
  padding: 10px 20px 10px;
`;

const RecipeContainer = styled.div`
  width: 100%;
  border-width: 15px;
  border-style: solid;
  border-color: transparent;
  border-image: url('/images/frame.png') 80 repeat;
  border-image-width: 80px;
  background-color: rgba(0, 0, 0, 1);
  box-shadow: 0 2px 0 0 rgb(0 0 0 / 80%), inset 0 -1px 0 0 rgb(0 0 0 / 10%), 0 0 66px 66px rgb(0 0 0 / 10%);
  max-width: 100%;
  margin-top: 25px;

  ${({ theme }) => theme.mediaQueries.md} {
    width: 495px;
  }
`;

const RecipeContainer2 = styled.div`
  position: relative;
  color: #bb955e;
  padding: 30px 60px 0;
`;

const SpecialButton = styled.div<{ title: string }>`
  position: relative;
  height: 110px;
  width: 260px;
  border-width: 44px 132px;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0);
  border-image-source: url(/images/special-button.png);
  border-image-slice: 110 330 fill;
  filter: drop-shadow(rgba(0, 0, 0, 0.6) 1px 1px 1px) drop-shadow(rgba(0, 0, 0, 0.6) 0px 0px 4px);
  cursor: url('/images/cursor3.png'), pointer;
  font-family: 'webfontexl', sans-serif !important;
  text-transform: uppercase;

  &:before {
    content: '${({ title }) => title}';
    position: absolute;
    top: 0;
    white-space: nowrap;
    font-size: 24px;
    left: -75px;
    color: #d2c8ae;
  }

  filter: contrast(1.1);
  &:hover {
    filter: contrast(1.2) brightness(1.3);
  }
`;

const RecipeHeading = styled(Heading)`
  color: #fff;
  margin-bottom: 40px;
`;

const Page2 = styled(Page)`
  padding: 0;
  margin: 0;
`;

const RuneWord = styled.div`
  position: absolute;
  bottom: 13%;
  left: 0;
  width: 100%;
  height: 30px;
  text-align: center;
  filter: drop-shadow(0px 0px 4px #e6dab6);

  ${({ theme }) => theme.mediaQueries.md} {
    bottom: 33%;
  }
`;

const RuneWordItem = styled.div`
  font-size: 1.4rem;
  font-weight: bold;
  color: #3b2b15;
  margin-right: 10px;
`;

const HeadingFire = styled.div<{
  fireStrength: number;
  color1: string;
  color2: string;
  color3: string;
  color4: string;
}>`
  background-image: -webkit-linear-gradient(
    top,
    #bcbcbc 0%,
    #bcbcbc 17.5%,
    #cecece 33.75%,
    #f0f0f0 50%,
    #cecece 63.75%,
    #bcbcbc 77.5%,
    #bcbcbc 100%
  );
  -webkit-background-clip: text;
  // -webkit-text-fill-color: transparent;
  // filter: sepia(1) saturate(5) hue-rotate(-25deg);
  // sepia(1) saturate(5) hue-rotate(-25deg) grayscale(1) drop-shadow(0px 0px 10px #000) invert(1)

  -webkit-animation: fire 0.4s infinite;

  @keyframes fire {
    0% {
      text-shadow: 0 0 2px ${(props) => props.color1},
        0 ${(props) => props.fireStrength * -5}px ${(props) => props.fireStrength * 4}px ${(props) => props.color2},
        ${(props) => props.fireStrength * 2}px ${(props) => props.fireStrength * -10}px
          ${(props) => props.fireStrength * 6}px ${(props) => props.color1},
        ${(props) => props.fireStrength * -2}px ${(props) => props.fireStrength * -15}px
          ${(props) => props.fireStrength * 11}px ${(props) => props.color3},
        ${(props) => props.fireStrength * -2}px ${(props) => props.fireStrength * -25}px
          ${(props) => props.fireStrength * 18}px ${(props) => props.color4};
    }
    25% {
      text-shadow: 0 0 3px ${(props) => props.color1},
        ${(props) => props.fireStrength * 1}px ${(props) => props.fireStrength * -6}px
          ${(props) => props.fireStrength * 5}px ${(props) => props.color2},
        ${(props) => props.fireStrength * 1}px ${(props) => props.fireStrength * -11}px
          ${(props) => props.fireStrength * 7}px ${(props) => props.color1},
        ${(props) => props.fireStrength * -2}px ${(props) => props.fireStrength * -16}px
          ${(props) => props.fireStrength * 13}px ${(props) => props.color3},
        ${(props) => props.fireStrength * -0}px ${(props) => props.fireStrength * -26}px
          ${(props) => props.fireStrength * 20}px ${(props) => props.color4};
    }
    50% {
      text-shadow: 0 0 3px ${(props) => props.color1},
        ${(props) => props.fireStrength * -1}px ${(props) => props.fireStrength * -4}px
          ${(props) => props.fireStrength * 6}px ${(props) => props.color2},
        ${(props) => props.fireStrength * 0}px ${(props) => props.fireStrength * -12}px
          ${(props) => props.fireStrength * 6}px ${(props) => props.color1},
        ${(props) => props.fireStrength * -3}px ${(props) => props.fireStrength * -16}px
          ${(props) => props.fireStrength * 15}px ${(props) => props.color3},
        ${(props) => props.fireStrength * -1}px ${(props) => props.fireStrength * -28}px
          ${(props) => props.fireStrength * 22}px ${(props) => props.color4};
    }
    75% {
      text-shadow: 0 0 2px ${(props) => props.color1},
        ${(props) => props.fireStrength * 1}px ${(props) => props.fireStrength * -7}px
          ${(props) => props.fireStrength * 4}px ${(props) => props.color2},
        ${(props) => props.fireStrength * 1}px ${(props) => props.fireStrength * -11}px
          ${(props) => props.fireStrength * 8}px ${(props) => props.color1},
        ${(props) => props.fireStrength * -1}px ${(props) => props.fireStrength * -14}px
          ${(props) => props.fireStrength * 12}px ${(props) => props.color3},
        ${(props) => props.fireStrength * -2}px ${(props) => props.fireStrength * -25}px
          ${(props) => props.fireStrength * 21}px ${(props) => props.color4};
    }
    100% {
      text-shadow: 0 0 2px ${(props) => props.color1},
        0 ${(props) => props.fireStrength * -5}px ${(props) => props.fireStrength * 4}px ${(props) => props.color2},
        ${(props) => props.fireStrength * 2}px ${(props) => props.fireStrength * -10}px
          ${(props) => props.fireStrength * 6}px ${(props) => props.color1},
        ${(props) => props.fireStrength * -2}px ${(props) => props.fireStrength * -15}px
          ${(props) => props.fireStrength * 11}px ${(props) => props.color3},
        ${(props) => props.fireStrength * -2}px ${(props) => props.fireStrength * -25}px
          ${(props) => props.fireStrength * 18}px ${(props) => props.color4};
    }
  }
`;

// const HeadingFire = styled.div<({ fireStrength: number, color1: string, color2: string, color3: string, color4: string })>`
//   background-image: -webkit-linear-gradient(
//     top,
//     #bcbcbc 0%,
//     #bcbcbc 17.5%,
//     #cecece 33.75%,
//     #f0f0f0 50%,
//     #cecece 63.75%,
//     #bcbcbc 77.5%,
//     #bcbcbc 100%
//   );
//   -webkit-background-clip: text;
//   // -webkit-text-fill-color: transparent;
//   color: #000;
//   text-transform: uppercase;
//   line-height: 1rem;
//   font-family: "FMB", "Palatino Linotype", "Times", serif;
//   font-size: 48px;
//   font-weight: bold;
//   margin-top: 5px;
//   // filter: sepia(1) saturate(5) hue-rotate(-25deg);
//   // sepia(1) saturate(5) hue-rotate(-25deg) grayscale(1) drop-shadow(0px 0px 10px #000) invert(1)

//   -webkit-animation: fire 0.2s infinite;

//   @keyframes fire {
//     0% {
//       text-shadow: 0 0 2px ${(props) => props.color1}, 0 ${(props) => props.fireStrength * -5}px ${(props) => props.fireStrength * 4}px ${(props) => props.color2},
//         ${(props) => props.fireStrength * 2}px ${(props) => props.fireStrength * -10}px
//           ${(props) => props.fireStrength * 6}px ${(props) => props.color1},
//         ${(props) => props.fireStrength * -2}px ${(props) => props.fireStrength * -15}px
//           ${(props) => props.fireStrength * 11}px ${(props) => props.color3},
//         ${(props) => props.fireStrength * -2}px ${(props) => props.fireStrength * -25}px
//           ${(props) => props.fireStrength * 18}px ${(props) => props.color4};
//     }
//     25% {
//       text-shadow: 0 0 3px ${(props) => props.color1},
//         ${(props) => props.fireStrength * 1}px ${(props) => props.fireStrength * -6}px
//           ${(props) => props.fireStrength * 5}px ${(props) => props.color2},
//         ${(props) => props.fireStrength * 1}px ${(props) => props.fireStrength * -11}px
//           ${(props) => props.fireStrength * 7}px ${(props) => props.color1},
//         ${(props) => props.fireStrength * -2}px ${(props) => props.fireStrength * -16}px
//           ${(props) => props.fireStrength * 13}px ${(props) => props.color3},
//         ${(props) => props.fireStrength * -0}px ${(props) => props.fireStrength * -26}px
//           ${(props) => props.fireStrength * 20}px ${(props) => props.color4};
//     }
//     50% {
//       text-shadow: 0 0 3px ${(props) => props.color1},
//         ${(props) => props.fireStrength * -1}px ${(props) => props.fireStrength * -4}px
//           ${(props) => props.fireStrength * 6}px ${(props) => props.color2},
//         ${(props) => props.fireStrength * 0}px ${(props) => props.fireStrength * -12}px
//           ${(props) => props.fireStrength * 6}px ${(props) => props.color1},
//         ${(props) => props.fireStrength * -3}px ${(props) => props.fireStrength * -16}px
//           ${(props) => props.fireStrength * 15}px ${(props) => props.color3},
//         ${(props) => props.fireStrength * -1}px ${(props) => props.fireStrength * -28}px
//           ${(props) => props.fireStrength * 22}px ${(props) => props.color4};
//     }
//     75% {
//       text-shadow: 0 0 2px ${(props) => props.color1},
//         ${(props) => props.fireStrength * 1}px ${(props) => props.fireStrength * -7}px
//           ${(props) => props.fireStrength * 4}px ${(props) => props.color2},
//         ${(props) => props.fireStrength * 1}px ${(props) => props.fireStrength * -11}px
//           ${(props) => props.fireStrength * 8}px ${(props) => props.color1},
//         ${(props) => props.fireStrength * -1}px ${(props) => props.fireStrength * -14}px
//           ${(props) => props.fireStrength * 12}px ${(props) => props.color3},
//         ${(props) => props.fireStrength * -2}px ${(props) => props.fireStrength * -25}px
//           ${(props) => props.fireStrength * 21}px ${(props) => props.color4};
//     }
//     100% {
//       text-shadow: 0 0 2px ${(props) => props.color1}, 0 ${(props) => props.fireStrength * -5}px ${(props) => props.fireStrength * 4}px ${(props) => props.color2},
//         ${(props) => props.fireStrength * 2}px ${(props) => props.fireStrength * -10}px
//           ${(props) => props.fireStrength * 6}px ${(props) => props.color1},
//         ${(props) => props.fireStrength * -2}px ${(props) => props.fireStrength * -15}px
//           ${(props) => props.fireStrength * 11}px ${(props) => props.color3},
//         ${(props) => props.fireStrength * -2}px ${(props) => props.fireStrength * -25}px
//           ${(props) => props.fireStrength * 18}px ${(props) => props.color4};
//     }
//   }
// `;

// let transmuteInterval = null

const items = getFilteredItems(itemData[ItemsMainCategoriesType.OTHER]);

const Container: React.FC<any> = ({ match }) => {
  const { t } = useTranslation();
  const { id }: { id: string } = match.params;
  const navigate = useNavigate();

  // const { itemSelected, setItemSelected, isModalOpened, setIsModalOpened, itemsEquipped } = useContext(ItemsContext)
  const [itemsPaginated, setItemsPaginated] = useState(
    getItems(itemData, 4, [ItemsMainCategoriesType.RUNES as ItemsMainCategoriesType], true)
  );
  const [cubeAction] = useSound('/assets/sounds/cubing.mp3', { volume: 0.5 });
  const inventory = useInventory();
  const [recipeItem, setRecipeItem] = useState(undefined);
  const [transmuteStrength, setTransmuteStrength] = useState(1);
  const [isTransmuting, setIsTransmuting] = useState(false);
  const [craftedTokens, setCraftedTokens] = useState([]);
  const [itemSelected, _setItemSelected] = useState(null);
  const [runes, setRunes] = useState([]);
  const currentItems = itemsPaginated[0].items;

  const balances = inventory.runes;

  const onItemSelected = (value) => {
    const item = parseInt(value.replace('inventory', '')) + 1;
    if (itemSelected && itemSelected === item) return;
    _setItemSelected(item);
  };

  const onCloseTransmuteModal = (tokens) => {
    if (tokens?.length) {
      setCraftedTokens(tokens);
      cubeAction();
      setTransmuteStrength(1);
      setIsTransmuting(false);
    } else {
      setTransmuteStrength(1);
      setIsTransmuting(false);
    }
  };

  const findItem = (itemId) => {
    return itemData[ItemsMainCategoriesType.RUNES].find((item) => item.id === itemId);
  };

  const hasRequirement = !runes.find((r) => balances[r - 1] < 1);

  const transmute = () => {
    setCraftedTokens([]);
    setTransmuteStrength(1);
    setIsTransmuting(true);
  };

  const removeRune = (index) => {
    const newRunes = [...runes];
    newRunes.splice(index, 1);
    setRunes(newRunes);
  };

  useEffect(() => {
    const item = itemSelected; //items[ItemsMainCategoriesType.RUNES].find((i) => i.id === itemSelected)
    _setItemSelected(undefined);

    if (item) {
      setCraftedTokens([]);
      // if (runes.includes(item.id)) {
      //   const newRunes = [...runes]
      //   newRunes.splice(runes.indexOf(item.id), 1)
      //   setRunes(newRunes)
      // } else {
      // runes.push(item.id)
      const newRunes = [...runes, item];
      setRunes(newRunes);
      // }
    }
  }, [currentItems, runes, itemSelected]);

  useEffect(() => {
    setRecipeItem(undefined);
    for (const _runeword of items.filter((r) => r.isCraftable)) {
      const runeword = _runeword as any;
      let isMatch = true;

      if (runeword.recipe?.requirement?.length !== runes.length) continue;

      for (const runeIndex in runeword.recipe.requirement) {
        const requiredRuneId = runeword.recipe.requirement[runeIndex].id + 1;
        if (runes[runeIndex] !== requiredRuneId) {
          isMatch = false;
        }
      }

      if (isMatch) {
        setRecipeItem(runeword);
        return;
      }
    }
  }, [runes]);

  useEffect(() => {
    if (!id) return;
    for (const _runeword of items.filter((r) => !r.isDisabled && !r.isSecret && !(r as any).isUltraSecret)) {
      const runeword = _runeword as any;
      const isMatch = runeword.name.toLowerCase() === id;

      if (isMatch) {
        setRecipeItem(runeword);
        setRunes(runeword.recipe.requirement.map((r) => r.id + 1));
        return;
      }
    }
  }, [id]);

  useEffect(() => {
    if (!window.localStorage) return;
    window.localStorage.setItem('autoPushSidebar', '0');
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <TipCard heading={t('Transmutation Cube')} id="transmutation-cube" npc="kevin" npcMargin={70}>
        <p>
          By placing runes in the Crafting Cube, a number of NFTs with added utility can be created. These NFTs are
          called runeforms. These runeforms can be universal or character specific items. Equipping the item(s) rewards
          the wearer with extra utility. These include increasing farm yield, gaining access to hidden pools, access to
          worldstone shard and many more.
          <br />
          <br />
          <ul>
            <li>Add the combination of Runes to the crafting cube.</li>
            <li>Rune Words follow Recipes.</li>
            <li>Runes should be in exact order to create a Rune Word</li>
            <li>Attributes are randomly generated based on the Rune Word Attribute Range</li>
            <li>Make sure that there is sufficient amount of runes when crafting. A recipe requires 1 of each rune.</li>
          </ul>
        </p>
      </TipCard>
      <br />
      <CubeContainer>
        <CubeContainer2>
          <CubeContainer3>
            <Image src="/images/cube-bg.png" />
            <Runes>
              <Flex alignItems="center">
                {runes.slice(0, 5).map((runeId, index) => {
                  const rune = findItem(runeId);
                  return (
                    <Rune key={`${rune.name}`} position={index} onClick={() => removeRune(index)}>
                      <Item
                        item={rune as any}
                        // bonus={rune.bonus}
                        itemIndex={'transmute' + rune.name}
                        isDisabled={rune.isDisabled}
                        background={false}
                        showQuantity={false}
                      />
                    </Rune>
                  );
                })}
                <RuneWord>
                  <Flex flexDirection="row" alignItems="center" justifyContent="center">
                    {runes.slice(0, 5).map((runeId, index) => {
                      const rune = findItem(runeId);
                      return (
                        <RuneWordItem key={`${rune.name}`}>
                          <HeadingFire
                            fireStrength={transmuteStrength}
                            color1="#fd3"
                            color2="#ff3"
                            color3="#f80"
                            color4="#f20">
                            {rune.name.replace(' Rune', '')}
                          </HeadingFire>
                        </RuneWordItem>
                      );
                    })}
                  </Flex>
                </RuneWord>
              </Flex>
            </Runes>
          </CubeContainer3>
        </CubeContainer2>

        <InventoryContainer>
          <InventoryContainer2>
            <InventoryContainer3>
              <Inventory
                showItemDropdown={false}
                onItemSelected={onItemSelected}
                columns={6}
                rows={40}
                page={0}
                direction={0}
                showCategories={[ItemsMainCategoriesType.RUNES as ItemsMainCategoriesType]}
                showNames
                showUnobtained
                hideExtras
                hideArrows
              />
            </InventoryContainer3>
          </InventoryContainer2>
          {recipeItem ? (
            <RecipeContainer>
              <RecipeContainer2>
                <Flex flexDirection="column" alignItems="center" justifyContent="center">
                  <div css={css``}>
                    <br />
                    <RecipeHeading as="h2" size="lg">
                      Recipe found!
                    </RecipeHeading>
                    <RecipeInfo item={recipeItem} />
                    <br />
                    <br />
                  </div>
                  {hasRequirement && isTransmuting ? (
                    <HeadingFire
                      fireStrength={transmuteStrength}
                      color1="#fd3"
                      color2="#ff3"
                      color3="#f80"
                      color4="#f20">
                      <SpecialButton title="Transmute">
                        {/* <HeadingFire fireStrength={1} color1="#fd3" color2="#ff3" color3="#f80" color4="#f20">Sss</HeadingFire> */}
                      </SpecialButton>
                    </HeadingFire>
                  ) : inventory.tokenBalancesLoading ? (
                    <p style={{ textAlign: 'center' }}>
                      Loading...
                      <br />
                      <br />
                    </p>
                  ) : !hasRequirement ? (
                    <p style={{ textAlign: 'center' }}>
                      You don't have the required runes.
                      <br />
                      <br />
                      <SpecialButton title={'Buy Runes'} onClick={() => navigate('/swap')}></SpecialButton>
                    </p>
                  ) : (
                    <>
                      {recipeItem.isCraftable ? (
                        <SpecialButton title={'Transmute'} onClick={transmute}></SpecialButton>
                      ) : (
                        <>
                          <br />
                          {recipeItem.isRetired ? 'Retired' : 'Not Available'}
                          <br />
                          <br />
                          <br />
                        </>
                      )}
                    </>
                  )}

                  {hasRequirement && isTransmuting ? (
                    <Transmute runes={runes} balances={balances} onDismiss={onCloseTransmuteModal} />
                  ) : null}
                </Flex>
              </RecipeContainer2>

              {craftedTokens.length > 1 ? (
                <>
                  <Flex flexDirection="column" alignItems="center" justifyContent="center" ml={30} mr={30}>
                    <hr style={{ width: '90%', marginBottom: 30 }} />
                    <RecipeHeading as="h2" size="lg">
                      Successfully crafted!
                    </RecipeHeading>
                    <br />
                  </Flex>
                  {/* <ItemCatalogFull rows={5} columns={7} tokens={["1003001820120010152069000201301020020152003000200500020390360000000000000316", "1003001820120010202069005201301720020152003001200500020390360000000000000316"]} /> */}
                  <ItemCatalogFull rows={5} columns={7} tokens={craftedTokens} />
                  <Flex flexDirection="column" alignItems="center" justifyContent="center" ml={30} mr={30}>
                    <br />
                    <br />
                    <Button
                      onClick={() => {
                        navigate('/account/inventory');
                      }}>
                      Go To Inventory
                    </Button>
                    <br />
                  </Flex>
                </>
              ) : craftedTokens.length === 1 ? (
                <Flex flexDirection="column" alignItems="center" justifyContent="center" ml={30} mr={30}>
                  <hr style={{ width: '90%', marginBottom: 30 }} />
                  <RecipeHeading as="h2" size="lg">
                    Successfully crafted!
                  </RecipeHeading>
                  <ItemInfo item={decodeItem(craftedTokens[0])} />
                  <br />
                  <br />
                  <Button
                    onClick={() => {
                      navigate('/account/inventory');
                    }}>
                    Go To Inventory
                  </Button>
                  <br />
                </Flex>
              ) : null}
            </RecipeContainer>
          ) : null}
        </InventoryContainer>
      </CubeContainer>
    </>
  );
};

export default Container;
