import React from 'react'
import { createGlobalStyle } from 'styled-components'
import Page from '~/components/layout/Page'
import PageWindow from '~/components/PageWindow'
import Transmute from '~/components/Transmute'

const TransmuteView = ({ ...props }) => {
  if (!props.active) return <></>

  return (
    <Page>
      <Transmute {...props} />
    </Page>
  )
}

export default TransmuteView
