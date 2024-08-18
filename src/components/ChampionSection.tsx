import React, { useRef } from 'react'
import styled, { css } from 'styled-components'

const zzz = styled.div``

const Section = (props) => {
  return (
    <div
      className={`section ${props.className}`}
      css={css`
        height: 100%;
        overflow: hidden;
        visibility: visible;
        transition: visibility 1s ease;

        &.active {
          visibility: visible;
        }

        &.active .section__content {
          transform: scale(1);
          opacity: 1;
          transition-delay: 0.3s;
        }

        .section__content {
          position: relative;
          height: 100%;
          // transform: scale(3);
          // opacity: 0;
          transition: transform 0.6s ease, opacity 0.5s ease;
          padding-top: 9.5rem;
        }
      `}
    >
      {props.children}
    </div>
  )
}

export const SectionContent = (props) => {
  const bgImage = props.bgImage
    ? {
        backgroundImage: `url(${props.bgImage})`,
        backgroundSize: 'cover',
      }
    : {}

  return (
    <div className={`section__content ${props.className}`} style={bgImage} css={props.containerCss}>
      {props.children}
    </div>
  )
}

export default Section
