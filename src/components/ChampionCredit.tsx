import React, { useState, useRef, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { Flex } from '~/ui'
import { Button } from './Button'

const zzz = styled.div``

const Credit = (props) => {
  const videoRef = useRef(null)
  const [videoUrl, setVideoUrl] = useState('/videos/infinite/bg-video.mp4')

  // useEffect(() => {
  //     if (!videoRef?.current) return

  //     // videoRef.current.play()
  //     // const pauseVideo = () => {
  //     //     if (!document.hidden) {
  //     //         videoRef.current.play()
  //     //     } else {
  //     //         videoRef.current.pause()
  //     //     }
  //     // }
  //     // document.addEventListener('webkitvisibilitychange', pauseVideo)
  //     // return () => {
  //     //     document.removeEventListener('webkitvisibilitychange', pauseVideo)
  //     // }
  // }, [videoRef]);

  return (
    <div
      className={`credit overlay ${props.isActive ? 'active' : ''}`}
      css={css`
        height: 100%;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;

        video {
          position: absolute;
        }

        .credit__content {
          position: relative;

          .title {
            text-align: center;
          }

          .btns > * ~ * {
            margin-left: 1rem;
          }
        }
      `}
    >
      <video ref={videoRef} width="100%" height="auto" autoPlay loop muted className="overlay">
        <source src={videoUrl} type="video/mp4" />
      </video>
      <div className="credit__content">
        <div className="title">
          <span>Start Your</span>
          <h2 className="main-color">ADVENTURE</h2>
        </div>
        <div className="btns m-t-4">
          <Button className="btn-main">PLAY NOW</Button>
          <Button className="btn-second">GET STARTED</Button>
        </div>
      </div>
    </div>
  )
}

export default Credit
