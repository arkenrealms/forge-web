import React, { useRef } from 'react'
import styled, { css } from 'styled-components'

const zzz = styled.div``

const ChampionCard = (props) => {
  const cardRef = useRef(null)

  const { item } = props

  const onClick = () => {
    const img = cardRef.current.querySelector('img')
    const pos = img.getBoundingClientRect()

    const newNode = img.cloneNode(true)
    newNode.style.width = img.offsetWidth + 'px'
    newNode.style.height = img.offsetHeight + 'px'
    newNode.style.position = 'absolute'
    newNode.style.top = pos.top + 'px'
    newNode.style.left = pos.left + 'px'
    newNode.style.zIndex = '102'

    newNode.style.transition = 'all 0.7s ease'
    newNode.id = `champ-img-${props.id}`

    setTimeout(() => {
      newNode.style.width = '40%'
      newNode.style.height = 'auto'
      newNode.style.top = '80px'
      newNode.style.left = '40px'
    })

    document.body.appendChild(newNode)

    // const videoUrl = `https://youtube.com/embed/${item.video}`
    // document.querySelector(`#champ-detail-${props.id} iframe`).setAttribute('src', videoUrl)
    document.querySelector(`#champ-detail-${props.id}`).classList.add('active')
  }

  return (
    <div
      className="champion-card"
      onClick={onClick}
      ref={cardRef}
      css={css`
        width: 450px;
        position: relative;
        pointer-events: none;

        img {
          max-width: 100%;
          position: relative;
          opacity: 0;
          transition: opacity 0.5s ease;
        }

        &:hover img {
          opacity: 1;
        }

        .frame,
        .name {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }

        &:hover .frame::before {
          opacity: 1;
          animation-play-state: running;
        }

        .frame {
          width: 70%;
          height: 80%;
          overflow: hidden;
          bottom: 0;
          pointer-events: visible;

          &::before {
            content: '';
            position: absolute;
            width: 60%;
            height: 150%;
            background-image: linear-gradient(90deg, #3652cd, #00e4ff);
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation: rotate 3s linear infinite;
            animation-play-state: paused;
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .bg {
            position: absolute;
            inset: 4px;
            &::before {
              background-color: rgba(0, 0, 0, 0);
            }
          }

          &:hover .frame .bg::before {
            background-color: rgba(0, 0, 0, 0.6);
          }
        }

        .name {
          height: max-content;
          bottom: 4px;
          width: calc(70% - 8px);
          text-align: center;
          padding: 1rem 0;
          background-color: rgba(0, 0, 0, 0.5);
          text-transform: uppercase;
          font-size: 1.5rem;
          font-family: 'webfontexl', sans-serif !important;
        }

        @keyframes rotate {
          0% {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
      `}>
      <div className="frame">
        <div className="bg-image overlay bg" style={{ backgroundImage: `url(${item.bg})` }}></div>
      </div>
      <img src={item.img} alt="" />
      <div className="name">{item.name}</div>
    </div>
  )
}

export default ChampionCard
