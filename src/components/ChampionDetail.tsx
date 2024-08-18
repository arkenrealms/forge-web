import styled, { css } from 'styled-components'
import React, { useRef, useEffect } from 'react'
import { closeIcon } from '../assets/data/images'

const zzz = styled.div``

const ChampionDetail = ({ id, item, active = false }) => {
  const iframeRef = useRef(null)

  // useEffect(() => {
  //   const height = (iframeRef.current.offsetWidth * 9) / 16 + 'px'
  //   iframeRef.current.setAttribute('height', height)
  // }, [])

  const onClose = () => {
    document.querySelector(`#champ-detail-${id}`).classList.remove('active')
    // iframeRef.current.setAttribute('src', '')

    const img = document.querySelector(`#champ-img-${id}`)
    // @ts-ignore
    img.style.opacity = 0
    setTimeout(() => {
      img.remove()
    }, 500)
  }

  return (
    <div
      id={`champ-detail-${id}`}
      className={`champion-detail bg-image overlay ${active ? 'active' : ''}`}
      style={{ backgroundImage: `url(${item.bgLarge})` }}
      css={css`
        position: fixed;
        background-color: #000;
        top: 40px;
        left: 0;
        width: 100%;
        height: 100vh;
        z-index: 102;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.5s ease, visibility 0.5s ease;

        display: flex;
        align-items: flex-start;
        justify-content: flex-end;

        &.active {
          opacity: 1;
          visibility: visible;
        }

        .champion-detail__content {
          width: 60%;
          padding: 2rem 0;
          position: relative;

          .name {
            font-size: 5rem;
            text-transform: uppercase;
          }

          .story {
            width: 50%;
            padding-left: 1rem;
            border-left: 2px solid #d0a85c;
            margin: 1rem 0;
          }

          .video {
            margin: 1rem 0;
          }

          iframe {
            width: 60%;
          }
        }

        .champion-detail__close {
          width: 50px;
          position: absolute;
          right: 30px;
          top: 30px;
          cursor: pointer;
          transition: transform 0.5s ease;
          transform: rotate(0deg);

          &:hover {
            transform: rotate(90deg);
          }

          img {
            width: 100%;
          }
        }
      `}>
      <div className="champion-detail__content">
        <span>{item.nickName}</span>
        <h2 className="name main-color">{item.name}</h2>
        <span>
          Roles: <span className="second-color">{item.role}</span>
        </span>
        <br />
        {/* <span>
          Difficulty: <span className="second-color">{item.difficulty}</span>
        </span> */}
        <div className="story">{item.description}</div>
        {/* <span>Champion spotlight</span>
        <div className="video">
          <iframe title="champion spotlight" ref={iframeRef} width="100%"></iframe>
        </div> */}
      </div>
      <div className="champion-detail__close" onClick={onClose}>
        <img src={closeIcon} alt="" />
      </div>
    </div>
  )
}

export default ChampionDetail
