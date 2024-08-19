import React from 'react';
import { ItemsMainCategoriesType } from '@arken/node/data/items.type';
import { Flex, Button, CardBody } from '~/ui';
import useMatchBreakpoints from '~/hooks/useMatchBreakpoints';
import CategoriesMenuItem from './CategoriesMenuItem';
import Armor from './Icons/Armor';
import Shield from './Icons/Shield';
import Sword from './Icons/Sword';
import Rune from './Icons/Rune';
import Accessory from './Icons/Accessory';

type Props = {
  categorySelected: ItemsMainCategoriesType;
  setCategory: React.Dispatch<React.SetStateAction<[string, number]>>;
  showRunes?: boolean;
};

const CategoriesMenu: React.FC<Props> = ({ categorySelected, setCategory, showRunes = true }) => {
  return (
    <Flex flexDirection="row" alignItems="center" justifyContent="center">
      {/* <div className="flex mx-auto mb-6 z-20"> */}
      {showRunes ? (
        <CategoriesMenuItem
          category={ItemsMainCategoriesType.RUNES}
          setCategory={setCategory}
          isSelected={categorySelected === ItemsMainCategoriesType.RUNES}>
          <Rune className="fill-current h-10 w-16 pb-3 px-4" />
        </CategoriesMenuItem>
      ) : null}
      <CategoriesMenuItem
        category={ItemsMainCategoriesType.WEAPONS}
        setCategory={setCategory}
        isSelected={categorySelected === ItemsMainCategoriesType.WEAPONS}>
        <Sword className="fill-current h-10 w-16 pb-3 px-4" />
      </CategoriesMenuItem>
      <CategoriesMenuItem
        category={ItemsMainCategoriesType.SHIELDS}
        setCategory={setCategory}
        isSelected={categorySelected === ItemsMainCategoriesType.SHIELDS}>
        <Shield className="fill-current h-10 w-16 pb-3 px-4" />
      </CategoriesMenuItem>
      <CategoriesMenuItem
        category={ItemsMainCategoriesType.ARMORS}
        setCategory={setCategory}
        isSelected={categorySelected === ItemsMainCategoriesType.ARMORS}>
        <Armor className="fill-current h-10 w-16 pb-3 px-4" />
      </CategoriesMenuItem>
      <CategoriesMenuItem
        category={ItemsMainCategoriesType.ACCESSORIES}
        setCategory={setCategory}
        isSelected={categorySelected === ItemsMainCategoriesType.ACCESSORIES}>
        <Accessory className="fill-current h-10 w-16 pb-3 px-4" />
      </CategoriesMenuItem>
    </Flex>
  );
};

export default CategoriesMenu;
