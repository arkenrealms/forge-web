import React from 'react'
import styled, { keyframes } from 'styled-components'
import Triangle from './Triangle'

// const StyledCardAccent = styled.div`
//   position: absolute;
//   top: -3px;
//   right: -3px;
//   bottom: -3px;
//   left: -3px;
//   z-index: 0;
//   pointer-events: none;
//   filter: hue-rotate(295deg) blur(0.3px);
//   opacity: 0.9;
// `

// const AnimationTop = keyframes`
// 0%  {width: 0; top: 0; left: 0;}
// 20% {width: 0; top: 0; left: 0;}
// 40% {width: 100%; top: 0; left: 0;}
// 60% {width: 0; top:0; left: 100%;}
// `
// const StyledCardAccentTop = styled.div`
// background: #d0f0dd;
// box-shadow: 0px 0px 0 #40ff22,
//   0px 0px 4px #30ff1f,
//   0px 0px 8px #20ff1b,
//   0px 0px 16px #10ff18;
// border-radius: 3px;
// position: absolute;
// height: 3px;
// top: 0;
// left: 0;
// width: 0;
// -webkit-animation: ${AnimationTop} 1.3s linear infinite;
// `

// const AnimationLeft = keyframes`
// 0%  {height: 0; top: calc(100% - 3px); left: 0;}
// 20% {height: 100%; top: 0; left: 0;}
// 40% {height: 0; top: 0; left: 0;}
// `
// const StyledCardAccentLeft = styled.div`
// background: #d0f0dd;
// box-shadow: 0px 0px 0 #40ff22,
//   0px 0px 4px #30ff1f,
//   0px 0px 8px #20ff1b,
//   0px 0px 16px #10ff18;
// border-radius: 3px;
// position: absolute;
// top: 0;
// left: 0;
// height: 0;
// width: 3px;
// -webkit-animation: ${AnimationLeft} 1.3s linear infinite;

// `
// const AnimationRight = keyframes`
// 0%  {height: 0; top: 0; left: calc(100% - 3px);}
// 40% {height: 0; top: 0; left: calc(100% - 3px);}
// 60% {height: 100%; top: 0; left: calc(100% - 3px);}
// 80% {height: 0; top: 100%;left: calc(100% - 3px);}
// `
// const StyledCardAccentRight = styled.div`
// background: #d0f0dd;
// box-shadow: 0px 0px 0 #40ff22,
//   0px 0px 4px #30ff1f,
//   0px 0px 8px #20ff1b,
//   0px 0px 16px #10ff18;
// border-radius: 3px;
// position: absolute;
// width: 3px;
// top: 0;
// left: 0;
// height: 0;
// -webkit-animation: ${AnimationRight} 1.3s linear infinite;

// `
// const AnimationBottom = keyframes`
// 0%  {width: 0; top: calc(100% - 3px); left: calc(100% - 3px);}
// 60% {width: 0; top: calc(100% - 3px); left: calc(100% - 3px);}
// 80% {width: 100%; top:calc(100% - 3px); left: 0px;}
// 100% {width: 0px; top:calc(100% - 3px); left: 0px;}
// `
// const StyledCardAccentBottom = styled.div`
// background: #d0f0dd;
// box-shadow: 0px 0px 0 #40ff22,
//   0px 0px 4px #30ff1f,
//   0px 0px 8px #20ff1b,
//   0px 0px 16px #10ff18;
// border-radius: 3px;
// position: absolute;
// height: 3px;
// top: 0;
// left: 0;
// width: 0;
// -webkit-animation: ${AnimationBottom} 1.3s linear infinite;

// `

// .arcane-triangle-top-left {
//   width: 0;
//   height: 0;
//   border-left: 7px solid transparent;
//   border-right: 7px solid transparent;
//   border-bottom: 7px solid white;
//   transform: translateX(0) translateY(0) rotate(-45deg) translateZ(0);
// }

// .arcane-triangle-top-right {
//   width: 0;
//   height: 0;
//   border-left: 7px solid transparent;
//   border-right: 7px solid transparent;
//   border-bottom: 7px solid white;
//   transform: translateX(0) translateY(0) rotate(45deg) translateZ(0);
// }

// .arcane-triangle-bottom-right {
//   width: 0;
//   height: 0;
//   border-left: 7px solid transparent;
//   border-right: 7px solid transparent;
//   border-top: 7px solid white;
//   transform: translateX(0) translateY(0) rotate(-45deg) translateZ(0);
// }

// .arcane-triangle-bottom-left {
//   width: 0;
//   height: 0;
//   border-left: 7px solid transparent;
//   border-right: 7px solid transparent;
//   border-top: 7px solid white;
//   transform: translateX(0) translateY(0) rotate(45deg) translateZ(0);
// }

const Container = styled.div`
  // display: none;

  // body.good-quality & {
  //   display: block;
  // }
  // border: 1px solid #fff;
  // opacity: 0.3;
  // width: 100%;
  // height: 100%;
`

const TrianglesBox = () => (
  <Container>
    <Triangle
      animateParams={{ rotate: '-45deg', x: [0, -6, 0], y: [0, -6, 0] }}
      className="arcane-triangle-top-left absolute left-0 top-0 -mx-1"
    />
    <Triangle
      animateParams={{ rotate: '45deg', x: [0, 6, 0], y: [0, -6, 0] }}
      className="arcane-triangle-top-right absolute right-0 top-0 -mx-1"
    />
    <Triangle
      animateParams={{ rotate: '45deg', x: [0, -6, 0], y: [0, 6, 0] }}
      className="arcane-triangle-bottom-left absolute left-0 bottom-0 -mx-1"
    />
    <Triangle
      animateParams={{ rotate: '-45deg', x: [0, 6, 0], y: [0, 6, 0] }}
      className="arcane-triangle-bottom-right absolute right-0 bottom-0 -mx-1 z-10"
    />
  </Container>
)

export default TrianglesBox
