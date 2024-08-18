import React from 'react'
import { motion } from 'framer-motion'
import Sparkle from '~/components/Icons/Sparkle'
import useSettings from '~/hooks/useSettings'

const SparkleAnimation = () => {
  return (
    <motion.div
      className="absolute top-0 right-0"
      animate={{ scale: [0, 1, 0], rotate: [0, 90, 180] }}
      transition={{
        loop: Infinity,
        ease: 'easeInOut',
        duration: 1,
      }}
    >
      <Sparkle className="fill-current text-arcane-lightYellow w-4 h-4 m-3" />
    </motion.div>
  )
}

export default SparkleAnimation
