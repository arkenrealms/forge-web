import React from 'react'
import styled, { css } from 'styled-components'

const Container = styled.div``

export default ({ name, onClick, children }) => {
  return (
    <Container
      className="w-layout-grid page-layout"
      onClick={onClick}
      css={css`
        border: 1px solid transparent;
        // border-radius: 7px;
        padding: 30px;
        background: rgb(0 0 0 / 20%);

        &:hover {
          border: 1px solid rgb(255 255 255 / 15%);
          cursor: url('/images/cursor3.png'), pointer;
        }
      `}>
      <article className="section-right">
        <div className="hmax">
          <div className="character-details-content">
            <div className="blocktitle-sm">{name}</div>
            <div className="character-details-block no-bb">
              <div className="class-perk">
                <div className="class-perk-name-2">{children}</div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Container>
  )
}
