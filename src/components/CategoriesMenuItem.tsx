import cx from 'classnames'
import React, { useContext } from 'react'
import SoundContext from '~/contexts/SoundContext'

type Props = {
  category: string
  setCategory: React.Dispatch<React.SetStateAction<[string, number]>>
  isSelected: boolean
}

const CategoriesMenuItem: React.FC<Props> = ({ category, setCategory, isSelected, children }) => {
  const { playAction } = useContext(SoundContext)

  return (
    <div
      onClick={() => {
        setCategory([category, 0])
        playAction()
      }}
      className={cx(
        {
          'text-white border-white': isSelected,
          'text-arcane-lightGray border-arcane-lightGray': !isSelected,
        },
        'border-b cursor-pointer'
      )}>
      {children}
    </div>
  )
}

export default CategoriesMenuItem
