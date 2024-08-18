import React from 'react'
import ArtComponent from '~/components/Art'

const Art = ({ active }) => {
  if (!active) return <></>

  return <ArtComponent />
}

export default Art
