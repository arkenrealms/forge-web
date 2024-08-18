import styled, { css } from 'styled-components'
import React, { useRef, useEffect } from 'react'

import { bg3, trailerImg } from '~/assets/data/images'
import ChampionHome from './ChampionHome'

const zzz = styled.div``

const Trailer = (props) => {
  const iframeRef = useRef(null)

  useEffect(() => {
    const height = (iframeRef.current.offsetWidth * 9) / 16 + 'px'
    iframeRef.current.setAttribute('height', height)
  }, [])

  return (
    <ChampionHome
      className={`trailer ${props.isActive ? 'active' : ''}`}
      contentClassName="overlay trailer__content"
      bgImage={bg3}
      containerCss={css`
        .trailer__content__wrapper {
          display: flex;
          align-items: flex-start;
          justify-content: center;
        }

        .trailer__content__img,
        .trailer__content__info {
          position: relative;
          width: 50%;
          height: 100%;
          transition: transform 0.5s ease, opacity 0.5s ease;
          opacity: 0;
          transition-delay: 0s;
        }

        .trailer__content__img {
          transform: translateX(-200px) scale(1.3);
          padding-top: 6.5rem;

          img {
          }
        }

        .trailer__content__info {
          transform: translateX(200px);

          .video {
            margin-top: 3rem;
            width: 90%;
          }
        }

        .trailer__content__img {
          transform: translateX(0) scale(1.3);
          opacity: 1;
          transition-delay: 1s;
        }

        .trailer__content__info {
          transform: translateX(0);
          opacity: 1;
          transition-delay: 1s;
        }
      `}
    >
      <div className="trailer__content__wrapper">
        <div className="trailer__content__img">
          <img src={trailerImg} alt="" />
        </div>
        <div className="trailer__content__info">
          <div className="title">
            <span>Compete With</span>
            <h2 className="main-color">Friends</h2>
          </div>
          <div className="video">
            <iframe
              ref={iframeRef}
              width="100%"
              title="trailer"
              src="https://www.youtube.com/embed/U5mG8V55EEs"
              css={css`
                border-width: 9px;
                border-style: solid;
                border-color: transparent;
                border-image: url(/images/frame.png) 80 / 80px / 0 repeat;
              `}
            ></iframe>
          </div>
        </div>
      </div>
      {props.children}
    </ChampionHome>
  )
}

export default Trailer
