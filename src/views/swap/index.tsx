import { css } from 'styled-components'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import Page from '~/components/layout/Page'
import Swap from '~/components/Swap'
import { useDefaultsFromURLSearch, useDerivedSwapInfo, useSwapActionHandlers, useSwapState } from '~/state/swap/hooks'

const SwapContainer = ({ ...props }) => {
  // const loadedUrlParams = {
  //   inputCurrencyId: "BNB",
  //   outputCurrencyId: ""
  // }
  // const loadedUrlParams = useDefaultsFromURLSearch()
  // console.log('vvv3', loadedUrlParams)
  if (!props.active) return <></>

  return (
    <Page>
      <Swap showMenu {...props} />
    </Page>
  )
}

export default SwapContainer
