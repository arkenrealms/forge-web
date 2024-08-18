import React from 'react'
import LiveInner from '~/components/Live'

const Live = ({ active }) => {
  if (!active) return <></>

  return <LiveInner />
}

export default Live
