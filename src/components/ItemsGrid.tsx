import React from 'react'
import { css } from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import Item from '~/components/Item'
import { ItemType, ItemCategoriesType } from 'rune-backend-sdk/build/data/items.type'
import useSettings from '~/hooks/useSettings'

type Props = {
  id: string
  items: ItemType[]
  page: number
  direction: number
  columns: number
  rows: number
  showAll: boolean
  showNames?: boolean
  showQuantity?: boolean
  showItemDropdown?: boolean
  noDisabled?: boolean
  disableAnimation?: boolean
  selectMode?: boolean
  isSelectable?: boolean
  defaultBranch?: string
}

const variants = {
  enter: (direction: number) => {
    return {
      x: direction * 100,
      opacity: 0,
    }
  },
  center: {
    x: 0,
    opacity: 1,
  },
}

const ItemsGrid: React.FC<Props> = ({
  showAll,
  id,
  items,
  page,
  direction,
  columns,
  rows,
  defaultBranch = undefined,
  showQuantity = true,
  showNames = false,
  showItemDropdown = true,
  noDisabled = false,
  disableAnimation = false,
  selectMode = false,
  isSelectable = false,
}) => {
  const { quality } = useSettings()

  if (quality === 'bad' || disableAnimation)
    return (
      <div
        className={`mx-auto grid gap-2`}
        css={css`
          grid-template-columns: repeat(${columns}, minmax(0, 1fr));
        `}>
        {items.map((item, index) => (
          <Item
            key={`${item.name}-${index}`}
            itemIndex={id + index + ''}
            item={item}
            isDisabled={noDisabled ? false : item.isDisabled}
            showDropdown={showItemDropdown}
            showName={showNames || item.category === ItemCategoriesType.RUNE}
            showQuantity={showQuantity}
            selectMode={selectMode}
            defaultBranch={defaultBranch}
          />
        ))}
      </div>
    )

  return (
    <motion.div
      key={page}
      className={`mx-auto grid gap-2`}
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      transition={{
        x: { type: 'tween' },
        opacity: { duration: 0.2 },
      }}
      css={css`
        grid-template-columns: repeat(${columns}, minmax(0, 1fr));
      `}>
      {items.map((item, index) => (
        <Item
          key={`${index}`}
          itemIndex={id + index + ''}
          item={item}
          isDisabled={noDisabled ? false : item.isDisabled}
          showDropdown={showItemDropdown}
          showName={showNames}
          showQuantity={showQuantity}
          selectMode={selectMode}
          defaultBranch={defaultBranch}
          isSelectable={isSelectable}
        />
      ))}
    </motion.div>
  )
}

export default ItemsGrid
