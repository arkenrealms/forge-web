import React from 'react'
import { ItemCategoriesType } from 'rune-backend-sdk/build/data/items.type'
import Shield from './Icons/Shield'
import Sword from './Icons/Sword'
import Armor from './Icons/Armor'
import Rune from './Icons/Rune'
import Accessory from './Icons/Accessory'

const categoryMapping = {
  [ItemCategoriesType.SHIELD]: Shield,
  [ItemCategoriesType.WEAPON]: Sword,
  [ItemCategoriesType.ARMOR]: Armor,
  [ItemCategoriesType.GREAVE]: Armor,
  [ItemCategoriesType.HELM]: Armor,
  [ItemCategoriesType.RUNE]: Rune,
  [ItemCategoriesType.ACCESSORY]: Accessory,
}

type Props = {
  type: ItemCategoriesType
}

const CategoryIcon: React.FC<Props> = ({ type }) => {
  const CategoryIcon2 = categoryMapping[type]

  return <CategoryIcon2 className="fill-current w-12 h-12 px-4 text-white" />
}

export default CategoryIcon
