import React from 'react'
import RoyaleInner from '~/components/Royale'

const Royale = ({ active }) => {
  if (!active) return <></>

  return <RoyaleInner />
}

export default Royale
