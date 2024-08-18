import React, { useEffect } from 'react';
import styled, { css } from 'styled-components';
import HoverEffect from 'hover-effect';
import { Link as RouterLink, NavLink } from 'react-router-dom';
import { Flex } from '~/ui';
import ChampionHome from './ChampionHome';
import { Button } from './Button';
import { bg1, champWarrior, champRanger, champDruid, distortion } from '../assets/data/images';

const zzz = styled.div``;
const champImgs = [champWarrior, champRanger, champDruid];

const Welcome = (props) => {
  useEffect(() => {
    const welcomeImgs = document.querySelectorAll('#welcome__img__slide > img');
    const animates = [];
    welcomeImgs.forEach((item, index) => {
      const nextImg = welcomeImgs[index === welcomeImgs.length - 1 ? 0 : index + 1].getAttribute('src');
      const animation = new HoverEffect({
        parent: document.querySelector('#welcome__img__slide'),
        intensity: 0.5,
        image1: item.getAttribute('src'),
        image2: nextImg,
        displacementImage: distortion,
        hover: false,
      });
      animates.push(animation);
    });
    welcomeImgs.forEach((e) => e.remove());

    let currItem = 0;

    const autoImageSlide = () => {
      const prevItem = currItem;
      currItem = (currItem + 1) % animates.length;

      if (!document.hidden && animates[prevItem]) {
        animates[prevItem].next();
      }

      setTimeout(() => {
        const canvas = document.querySelectorAll('#welcome__img__slide > canvas');

        document.querySelector('#welcome__img__slide')?.appendChild(canvas[0]);
        if (animates[prevItem]) animates[prevItem].previous();
      }, 3000);
    };

    setInterval(autoImageSlide, 3000);
  }, []);

  return (
    <ChampionHome
      className={`welcome ${props.isActive ? 'active' : ''}`}
      contentClassName="overlay welcome__content"
      bgImage={bg1}
      containerCss={css`
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        .welcome__info,
        .welcome__img {
          width: 100%;
          height: 100%;
        }

        .welcome__info {
          display: flex;
          align-items: flex-start;
          justify-content: flex-end;

          .welcome__info__content {
            .title {
              height: 400px;
              padding: 30px;
            }
            .description {
              padding: 30px;
              font-size: 1.2rem;
              line-height: 1.9rem;
            }

            .btns {
              padding: 30px;
            }

            .btns > * ~ * {
              margin-left: 1rem;
            }
          }
        }

        .welcome__img {
          display: flex;
          align-items: flex-end;
          justify-content: flex-start;

          .welcome__img__slide {
            height: 915px;
            width: 915px;
            overflow: hidden;

            canvas {
              display: block;
            }
          }
        }

        @media (min-width: 768px) {
          flex-direction: row;

          .welcome__info,
          .welcome__img {
            width: 50%;
            height: 100%;
          }

          .welcome__info {
            .welcome__info__content {
              padding-left: 15rem;
              .title {
                height: auto;
              }
            }
          }
        }
      `}>
      <div className="welcome__info relative">
        <div className="welcome__info__content">
          <div className="title">
            <span>Welcome To</span>
            <h2 className="main-color" style={{ whiteSpace: 'nowrap' }}>
              {props.title}
            </h2>
          </div>
          <div className="description m-t-2">{props.description}</div>
          <div className="btns m-t-1">
            {props.children}
            {/* <Button className="btn-main">PLAY NOW</Button>
                        <Button className="btn-second">GET STARTED</Button> */}
          </div>
        </div>
      </div>
      <div className="welcome__img relative">
        <div className="welcome__img__slide" id="welcome__img__slide">
          {champImgs.map((item, index) => (
            <img src={item} key={index} />
          ))}
        </div>
      </div>
    </ChampionHome>
  );
};

export default Welcome;
