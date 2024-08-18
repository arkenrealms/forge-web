import React from 'react'
import { formatDistance, parseISO } from 'date-fns'
import styled, { css } from 'styled-components'
import Linker from '~/components/Linker'

const zzz = styled.div``

const PlayerAction = function ({ action, createdAt, ...rest }) {
  if (!action) return <></>

  return (
    <div
      css={css`
        display: block;
        padding: 3px 0 3px;
      `}>
      <Linker id={`live-${createdAt}`} replaceItems={false} {...action} {...rest}>
        {action.message}
      </Linker>
      {createdAt
        ? formatDistance(parseISO(new Date(createdAt * 1000).toISOString()), new Date(), {
            addSuffix: true,
          })
        : null}
    </div>
  )
}

export default PlayerAction
