import React, { useEffect, useLayoutEffect, useMemo, useRef, useState, useContext, useCallback } from 'react';
import useSound from 'use-sound';
import { Button, Flex, ButtonMenu, ButtonMenuItem } from '~/ui';
import useMatchBreakpoints from '~/hooks/useMatchBreakpoints';
import styled, { css } from 'styled-components';
import ItemInformation from '~/components/ItemInformation';
import useWeb3 from '~/hooks/useWeb3';
import SoundContext from '~/contexts/SoundContext';
import useInventory from '~/hooks/useInventory';
import { ClassNames, GamesById, itemData, ItemSlot, ItemType, ItemAttributesById } from '@arken/node/data/items';
import { ItemsMainCategoriesType, ItemCategoriesType } from '@arken/node/data/items.type';

const Container = styled.div`
  // margin-bottom: 30px;
  width: 100%;
  height: 100%;
  position: relative;
  height: 738px;
  min-width: 512px;
`;

const Background1 = styled.div`
  position: absolute;
  top: 0;
  z-index: 1;
  pointer-events: none;

  background: url(/images/inventory/character-bg.png) no-repeat 50% 50%;
  width: 100%;
  height: 100%;
  opacity: 0.7;
  mix-blend-mode: screen;
  filter: drop-shadow(2px 4px 6px black);

  background-size: 120%;
  left: 0;

  ${({ theme }) => theme.mediaQueries.sm} {
    background-size: contain;
    left: -5px;

    body.good-quality & {
      animation-name: spin;
      animation-duration: 200000ms;
      animation-iteration-count: infinite;
      animation-timing-function: linear;
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  }
`;
const Background2 = styled.div`
  position: absolute;
  top: 0;
  z-index: 2;
  pointer-events: none;

  background: url(/images/inventory/character-male-bg.png) no-repeat 50% 50%;
  width: 100%;
  height: 100%;
  background-size: 180%;
  left: 15px;

  ${({ theme }) => theme.mediaQueries.sm} {
    left: 0;
    background-size: contain;
  }
`;

const Mod = styled.div`
  width: 100%;
  margin-bottom: 7px;
  text-align: left;
  color: #bb955e;
  border: 1px solid #bb955e;
  border-radius: 5px;
  padding: 0 0 0 6px;
`;

const CharStats = styled.div``;

const SlotContainer = styled.div<{ top: string; left: string }>`
  position: absolute;
  top: ${({ top }) => top};
  left: ${({ left }) => left};

  width: 63px;
  height: 63px;
  z-index: 2;

  &:hover {
    cursor: url('/images/cursor3.png'), pointer;
  }

  &:before {
    position: absolute;
    top: 5px;
    left: 5px;
    content: ' ';
    background-size: contain;
    width: 53px;
    height: 53px;
    z-index: 1;
  }
`;
const SlotContainerBackground = styled.div<{ position: number; background: string }>`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;

  &:hover {
    cursor: url('/images/cursor3.png'), pointer;
  }

  background: url(/images/inventory/${({ position }) => position}.png) no-repeat 50% 50%;
  background-size: contain;
  width: 63px;
  height: 63px;
  content: ' ';
  border-radius: 3px;
  filter: drop-shadow(2px 4px 6px black);
  ${({ background }) => (background ? `background-image: url(/images/inventory/basic.png);` : '')}
  z-index: 2;

  &:before {
    position: absolute;
    top: 5px;
    left: 5px;
    content: ' ';
    background-size: contain;
    width: 53px;
    height: 53px;
    border-radius: 3px;
    ${({ background }) => (background ? `background-image: url(${background});` : '')}
    filter: drop-shadow(2px 4px 6px black);
    z-index: 1;
  }
`;

const Slot = ({ position, equip, onClick, onClose, hidePreview, isModalOpened }) => {
  const [showInformation, setShowInformation] = useState(false);
  const { isMd, isLg, isXl, isXxl, isXxxl } = useMatchBreakpoints();
  const isMobile = !isMd && !isLg && !isXl && !isXxl && !isXxxl;

  let top = '0%';
  let left = '0%';
  if (position === ItemSlot.LeftHand) {
    top = '59%';
    left = '23%';
  }
  if (position === ItemSlot.RightHand) {
    top = '59%';
    left = '65%';
  }
  if (position === ItemSlot.Head) {
    top = '17%';
    left = '43%';
  }
  if (position === ItemSlot.Body) {
    top = '55%';
    left = '43%';
  }
  if (position === ItemSlot.Neck) {
    top = '5%';
    left = '85%';
  }
  // if (position === ItemSlot.Shoulder) {
  //   top = '28%'
  //   left = '29%'
  // }
  if (position === ItemSlot.Chest) {
    top = '32%';
    left = '43%';
  }
  if (position === ItemSlot.Waist) {
    top = '42%';
    left = '43%';
  }
  if (position === ItemSlot.Hands) {
    top = '49%';
    left = '23%';
  }
  if (position === ItemSlot.Wrists) {
    top = '49%';
    left = '65%';
  }
  if (position === ItemSlot.Legs) {
    top = '52%';
    left = '43%';
  }
  if (position === ItemSlot.Feet) {
    top = '76%';
    left = '43%';
  }
  if (position === ItemSlot.Finger1) {
    top = '15%';
    left = '85%';
  }
  if (position === ItemSlot.Finger2) {
    top = '25%';
    left = '85%';
  }
  if (position === ItemSlot.Trinket1) {
    top = '65%';
    left = '85%';
  }
  if (position === ItemSlot.Trinket2) {
    top = '75%';
    left = '85%';
  }
  if (position === ItemSlot.Trinket3) {
    top = '85%';
    left = '85%';
  }
  if (position === ItemSlot.Pet) {
    top = '85%';
    left = '5%';
  }
  const onMouseEnter = () => {
    if (isMobile) return;
    setShowInformation(true);
  };
  const onMouseLeave = () => {
    if (isMobile) return;
    setShowInformation(false);
  };

  return (
    <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <SlotContainer top={top} left={left} onClick={onClick}>
        <SlotContainerBackground position={position} background={equip ? equip.icon : null} />
        {/* <ItemTooltip
          content={equip ? <ItemInformation item={equip} showActions={false} hideMetadata /> : <></>}
          style={{width: '100%', height: '100%'}}
        >
        </ItemTooltip> */}
      </SlotContainer>
      {showInformation && !hidePreview && equip ? (
        <>
          <div
            onClick={onClick}
            css={css`
              padding: 25px 40px;
              position: absolute;
              left: ${left};
              top: ${top};
              z-index: 999;
            `}>
            &nbsp;
          </div>
          <div
            css={css`
              background: #000;
              position: absolute;
              left: calc(${left} + 60px);
              top: ${top};
              z-index: 999;
            `}>
            <ItemInformation item={equip} />
          </div>
        </>
      ) : null}
      {/* {equip && isModalOpened && (
        <Modal
          item={{
            ...equip,
            isEquipable: false,
            isTradeable: false,
            isTransferable: false,
            isEquipped: true,
          }}
          name={equip.name}
          details={equip.details}
          symbol={null}
          onClose={onClose}
          style={{ top, left }}
        />
      )} */}
    </div>
  );
};

const EquipmentInner = ({ address, hidePreview, children }) => {
  const [itemSelected, setItemSelected] = useState(null);
  const [gameTabIndex, setGameTabIndex] = useState(0);

  const { playAction } = useContext(SoundContext);

  const { address: account } = useWeb3();

  const forceShowSlots =
    window.location.hostname === 'dev.arken.gg' || account === '0xa987f487639920A3c2eFe58C8FBDedB96253ed9B';

  const handleClick = (itemType) => {
    if (itemSelected === itemType) {
      //   setItemSelected(null)
    } else {
      setItemSelected(itemType);
      playAction();
    }
  };

  const handleClose = () => {
    // setItemSelected(null)
  };

  const inventory = useInventory(address);
  const { items, equipment, setUserAddress, refreshEquipment } = inventory;
  const buffs = inventory.meta;

  useLayoutEffect(() => {
    setUserAddress(address);
    refreshEquipment();
  }, [address, setUserAddress, refreshEquipment]);

  const getAttributeList = (attributeList, gameId) => {
    return Object.keys(attributeList).map((attributeId) => {
      if (!attributeList[attributeId]) return null;
      if (!ItemAttributesById[attributeId]?.description) return;
      const attribute = ItemAttributesById[attributeId];
      if (attribute.id === 2 || attribute.id === 3 || attribute.id === 39 || attribute.id === 40) return;
      if (attribute.game !== gameId) return;
      // if (attribute.id > 1000) return

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

      if (!attr.trim()) return;

      return (
        <Mod key={attr}>
          <strong>{attribute.displayName}</strong>: {attributeList[attributeId]}%
        </Mod>
      );
    });
  };

  return (
    <>
      <Container>
        {children}
        <Background1 />
        <Background2 />
        <Slot
          position={ItemSlot.LeftHand}
          equip={equipment[ItemSlot.LeftHand]}
          onClick={() => handleClick(ItemSlot.LeftHand)}
          isModalOpened={itemSelected === ItemSlot.LeftHand}
          onClose={handleClose}
          hidePreview={hidePreview}
        />
        {equipment[ItemSlot.LeftHand]?.type === ItemType.TwoHandedWeapon && !forceShowSlots ? null : (
          <Slot
            position={ItemSlot.RightHand}
            equip={equipment[ItemSlot.RightHand]}
            onClick={() => handleClick(ItemSlot.RightHand)}
            isModalOpened={itemSelected === ItemSlot.RightHand}
            onClose={handleClose}
            hidePreview={hidePreview}
          />
        )}
        <Slot
          position={ItemSlot.Head}
          equip={equipment[ItemSlot.Head]}
          onClick={() => handleClick(ItemSlot.Head)}
          isModalOpened={itemSelected === ItemSlot.Head}
          onClose={handleClose}
          hidePreview={hidePreview}
        />
        {/* <Slot
          position={ItemSlot.Body}
          equip={equipment[ItemSlot.Body]}
          onClick={() => handleClick(ItemSlot.Body)}
          isModalOpened={itemSelected === ItemSlot.Body}
          onClose={handleClose}
          hidePreview={hidePreview}
        /> */}
        <Slot
          position={ItemSlot.Neck}
          equip={equipment[ItemSlot.Neck]}
          onClick={() => handleClick(ItemSlot.Neck)}
          isModalOpened={itemSelected === ItemSlot.Neck}
          onClose={handleClose}
          hidePreview={hidePreview}
        />
        {/* <Slot
          position={ItemSlot.Shoulder}
          equip={equipment[ItemSlot.Shoulder]}
          onClick={() => handleClick(ItemSlot.Shoulder)}
          isModalOpened={itemSelected === ItemSlot.Shoulder}
          onClose={handleClose}
          hidePreview={hidePreview}
        /> */}
        <Slot
          position={ItemSlot.Chest}
          equip={equipment[ItemSlot.Chest]}
          onClick={() => handleClick(ItemSlot.Chest)}
          isModalOpened={itemSelected === ItemSlot.Chest}
          onClose={handleClose}
          hidePreview={hidePreview}
        />
        <Slot
          position={ItemSlot.Waist}
          equip={equipment[ItemSlot.Waist]}
          onClick={() => handleClick(ItemSlot.Waist)}
          isModalOpened={itemSelected === ItemSlot.Waist}
          onClose={handleClose}
          hidePreview={hidePreview}
        />
        <Slot
          position={ItemSlot.Hands}
          equip={equipment[ItemSlot.Hands]}
          onClick={() => handleClick(ItemSlot.Hands)}
          isModalOpened={itemSelected === ItemSlot.Hands}
          onClose={handleClose}
          hidePreview={hidePreview}
        />
        <Slot
          position={ItemSlot.Wrists}
          equip={equipment[ItemSlot.Wrists]}
          onClick={() => handleClick(ItemSlot.Wrists)}
          isModalOpened={itemSelected === ItemSlot.Wrists}
          onClose={handleClose}
          hidePreview={hidePreview}
        />
        <Slot
          position={ItemSlot.Legs}
          equip={equipment[ItemSlot.Legs]}
          onClick={() => handleClick(ItemSlot.Legs)}
          isModalOpened={itemSelected === ItemSlot.Legs}
          onClose={handleClose}
          hidePreview={hidePreview}
        />
        <Slot
          position={ItemSlot.Feet}
          equip={equipment[ItemSlot.Feet]}
          onClick={() => handleClick(ItemSlot.Feet)}
          isModalOpened={itemSelected === ItemSlot.Feet}
          onClose={handleClose}
          hidePreview={hidePreview}
        />
        <Slot
          position={ItemSlot.Finger1}
          equip={equipment[ItemSlot.Finger1]}
          onClick={() => handleClick(ItemSlot.Finger1)}
          isModalOpened={itemSelected === ItemSlot.Finger1}
          onClose={handleClose}
          hidePreview={hidePreview}
        />
        <Slot
          position={ItemSlot.Finger2}
          equip={equipment[ItemSlot.Finger2]}
          onClick={() => handleClick(ItemSlot.Finger2)}
          isModalOpened={itemSelected === ItemSlot.Finger2}
          onClose={handleClose}
          hidePreview={hidePreview}
        />
        <Slot
          position={ItemSlot.Trinket1}
          equip={equipment[ItemSlot.Trinket1]}
          onClick={() => handleClick(ItemSlot.Trinket1)}
          isModalOpened={itemSelected === ItemSlot.Trinket1}
          onClose={handleClose}
          hidePreview={hidePreview}
        />
        <Slot
          position={ItemSlot.Trinket2}
          equip={equipment[ItemSlot.Trinket2]}
          onClick={() => handleClick(ItemSlot.Trinket2)}
          isModalOpened={itemSelected === ItemSlot.Trinket2}
          onClose={handleClose}
          hidePreview={hidePreview}
        />
        <Slot
          position={ItemSlot.Trinket3}
          equip={equipment[ItemSlot.Trinket3]}
          onClick={() => handleClick(ItemSlot.Trinket3)}
          isModalOpened={itemSelected === ItemSlot.Trinket3}
          onClose={handleClose}
          hidePreview={hidePreview}
        />
        <Slot
          position={ItemSlot.Pet}
          equip={equipment[ItemSlot.Pet]}
          onClick={() => handleClick(ItemSlot.Pet)}
          isModalOpened={itemSelected === ItemSlot.Pet}
          onClose={handleClose}
          hidePreview={hidePreview}
        />
        <br />
      </Container>

      {itemSelected && equipment[itemSelected] ? (
        <Flex flexDirection="column" alignItems="center" justifyContent="center" mt="-30px">
          <ItemInformation
            item={{
              ...equipment[itemSelected],
              value: '1',
              isEquipable: false,
              isEquipped: true,
              isTradeable: false,
              isTransferable: false,
            }}
            price={0}
          />
        </Flex>
      ) : null}
      <br />
      <br />
      <br />
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        style={{ textAlign: 'center' }}
        mt="-100px"
        ml="20px"
        mr="20px">
        <br />
        <br />
        {buffs.unstakeLocked ? (
          <Mod>
            <strong>Raid: Unstake Locked:</strong> If Smoke Was Equipped This Raid
          </Mod>
        ) : null}
        {buffs.classRequired ? (
          <Mod>
            <strong>Raid: Class Required:</strong> {ClassNames[buffs.classRequired]}
          </Mod>
        ) : null}
        {/* {buffs.worldstoneShardChance > 0 ? (
          <Mod>
            <strong>Chance To Find Worldstone Shard:</strong> {buffs.worldstoneShardChance}%
          </Mod>
        ) : null}
        {buffs.chanceToSendHarvestToHiddenPool > 0 ? (
          <Mod>
            <strong>Chance To Send Harvest To Hidden Pool:</strong> {buffs.chanceToSendHarvestToHiddenPool}%
          </Mod>
        ) : null}
        {buffs.chanceToLoseHarvest > 0 ? (
          <Mod>
            <strong>Chance To Lose Harvest:</strong> {buffs.chanceToLoseHarvest}%
          </Mod>
        ) : null}
        {buffs.randomRuneExchange > 0 ? (
          <Mod>
            <strong>Harvest Random Rune Exchange:</strong> {buffs.randomRuneExchange}%
          </Mod>
        ) : null}
        {buffs.harvestYield > 0 ? (
          <Mod>
            <strong>Harvest Yield Bonus:</strong> {buffs.harvestYield}%
          </Mod>
        ) : null}
        {buffs.harvestBurn > 0 ? (
          <Mod>
            <strong>Harvest Burned:</strong> {buffs.harvestBurn}%
          </Mod>
        ) : null} */}

        <div style={{ marginBottom: 20, marginTop: 20 }}>
          <ButtonMenu activeIndex={gameTabIndex} scale="md" onItemClick={(index) => setGameTabIndex(index)}>
            <ButtonMenuItem>Raid</ButtonMenuItem>
            <ButtonMenuItem>Evolution</ButtonMenuItem>
            <ButtonMenuItem>Infinite</ButtonMenuItem>
            <ButtonMenuItem>Sanctuary</ButtonMenuItem>
          </ButtonMenu>
        </div>
        {gameTabIndex === 0 && buffs.harvestFees
          ? Object.keys(buffs.harvestFees).map((key) => (
              <Mod key={key}>
                <strong>Harvest Fee:</strong> {buffs.harvestFees[key]}% {key}
              </Mod>
            ))
          : null}
        {/* {buffs.feeReduction > 0 ? (
          <Mod>
            <strong>Reduced Harvest Fees:</strong> {buffs.feeReduction}%
          </Mod>
        ) : null} */}
        {gameTabIndex === 0 && buffs.feeReduction > 0 ? (
          <Mod>
            <strong>Fee After Reduction:</strong> {buffs.harvestFeePercent}% {buffs.harvestFeeToken}
          </Mod>
        ) : null}
        {buffs.attributes ? getAttributeList(buffs.attributes, gameTabIndex + 1) : null}
      </Flex>
    </>
  );
};

const Equipment = (props) => {
  const [playSelect] = useSound('/assets/sounds/select.mp3');
  const [playAction] = useSound('/assets/sounds/action.mp3', { volume: 0.5 });
  const contextState = {
    playSelect,
    playAction,
  };
  return (
    <SoundContext.Provider value={contextState}>
      <EquipmentInner {...props} />
    </SoundContext.Provider>
  );
};

Equipment.defaultProps = {};

export default Equipment;
