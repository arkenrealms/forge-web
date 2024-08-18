import styled, { css } from 'styled-components'
import React, { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import ChampionHome from './ChampionHome'
import ChampionCard from './ChampionCard'
import { bg2 } from '../assets/data/images'
import { championsData } from '../assets/data/champions'

const zzz = styled.div``

const Champion = (props) => {
  return (
    <ChampionHome
      className={`champion ${props.isActive ? 'active' : ''}`}
      contentClassName="overlay"
      bgImage={bg2}
      containerCss={css`
        .champion-list {
          .swiper-slide {
            width: 450px;
            height: 615px;
            pointer-events: visible;
            overflow: visible;
            transform: translateX(200px);
            opacity: 0;
            transition: transform 0.5s ease, opacity 0.5s ease;
            transition-delay: 0s;
          }
        }

        .champion-list {
          .swiper-slide {
            transform: translateX(0);
            opacity: 1;

            @for $i from 1 through 10 {
              &:nth-child(#{$i}) {
                transition-delay: #{math.div($i, 2)}s;
              }
            }
          }
        }
      `}>
      <div className="relative">
        <div className="champion-list">
          <Swiper slidesPerView={'auto'} spaceBetween={0} grabCursor nested>
            {championsData.map((item, index) => (
              <SwiperSlide key={index}>
                <ChampionCard item={item} id={index} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </ChampionHome>
  )
}

export default Champion
