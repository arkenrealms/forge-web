import React from 'react'

import styled, { css } from 'styled-components'
import { createGlobalStyle } from 'styled-components'
import Page from '~/components/layout/Page'
import PageWindow from '~/components/PageWindow'
import Lore from '~/components/Lore'

const zzz = styled.div``

const LoreView = ({ active }) => {
  if (!active) return

  return (
    <div
      css={css`
        position: relative;
        height: calc(100vh - 104px);
        width: 100%;
      `}
    >
      <Lore />
    </div>
  )
}

export default LoreView
