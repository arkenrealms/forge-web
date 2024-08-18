import { BsX } from 'react-icons/bs'
import React, { useState } from 'react'
import styled, { css } from 'styled-components'

import { Button, Card, CardBody, Heading } from '~/ui'

const Content = styled.div``

export default function ({
  id,
  npc,
  heading,
  npcMargin,
  children,
}: {
  id: string
  npc: string
  heading?: any
  npcMargin?: number
  children?: any
}) {
  const cacheKey = `TipCard-${id}`

  const [isClosed, _setIsClosed] = useState(() => {
    if (!window.localStorage) return false

    return window.localStorage.getItem(cacheKey) === 'closed'
  })

  const setIsClosed = (val) => {
    _setIsClosed(val)
    window.localStorage.setItem(cacheKey, 'closed')
  }

  if (isClosed) return <></>

  return (
    <Card style={{ width: '100%', position: 'relative', overflow: 'visible' }}>
      {heading ? (
        <>
          <Heading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
            {heading}
          </Heading>
          <hr />
        </>
      ) : null}
      <CardBody>
        <div
          css={css`
            ${({ theme }) => theme.mediaQueries.lg} {
              float: left;
            }
            margin-bottom: 20px;
            background: url('/images/team/${npc}-anime.png') 0px 100% no-repeat;
            width: 200px;
            height: 200px;
            background-size: contain;
            margin-right: 20px;
            margin-bottom: ${npcMargin || 0}px;
          `}></div>
        {children}
      </CardBody>
      <Button
        scale="sm"
        variant="text"
        onClick={() => setIsClosed(true)}
        css={css`
          position: absolute;
          top: 5px;
          right: -9px;
        `}>
        <BsX style={{ zoom: 1.7 }} />
      </Button>
    </Card>
  )
}
