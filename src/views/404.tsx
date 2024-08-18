import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { Button, Heading, Text, LogoIcon } from '~/ui';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

import RaidIcon from '~/assets/images/icons/raid-desktop.png';
import InfiniteIcon from '~/assets/images/icons/infinite-desktop.png';
import EvolutionIcon from '~/assets/images/icons/evolution-desktop.png';
import SanctuaryIcon from '~/assets/images/icons/sanctuary-desktop.png';
import GuardiansIcon from '~/assets/images/icons/guardians-desktop.png';
import history from '~/routerHistory';

const StyledNotFound = styled.div`
  position: fixed;
  width: 100%;
  height: calc(100% - 200px);
  text-align: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const ShortcutBay = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-content: flex-start;
  margin-left: 20px;
`;

const Shortcut = styled.div`
  text-align: center;
  height: 90px;
  width: auto;
  margin-top: 20px;
  cursor: url('/images/cursor3.png'), pointer;
  color: #fff;
  font-size: 0.9rem;

  p {
    margin-top: 5px;
  }

  img {
    width: auto;
    height: 50px;
    image-rendering: pixelated;
  }
`;

const NotFound = ({ defaultNotFoundValue }) => {
  const { t } = useTranslation();
  const [notFound, setNotFound] = useState(defaultNotFoundValue);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!window) return;

    if (!show) {
      setShow(true);
    }

    const timeout = setTimeout(() => {
      setNotFound(true);
    }, 5 * 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [show, setNotFound]);

  if (!show) return <></>;

  return (
    <>
      {notFound ? (
        <div
          key="shortcut-bay-container"
          css={css`
            width: 100%;
            height: 600px;
            position: absolute;
            top: 65px;
            left: 0;
            z-index: 10;
            &:empty {
              display: none;
            }
          `}>
          <div
            css={css`
              display: flex;
              flex-wrap: wrap;
              padding: 10px;
              width: 100%;
              height: 100%;
              flex-direction: column;
              align-content: flex-start;
              margin-left: 20px;
            `}>
            <div
              css={css`
                text-align: center;
                height: 90px;
                width: auto;
                margin-top: 20px;
                cursor: url('/images/cursor3.png'), pointer;
                color: #fff;
                font-size: 0.9rem;

                p {
                  margin-top: 5px;
                }

                img {
                  width: auto;
                  height: 50px;
                  image-rendering: pixelated;
                }
              `}
              onClick={() => {
                history.push('/raid');
              }}>
              <img src={RaidIcon} />
              <p>Raid</p>
            </div>
            <div
              css={css`
                text-align: center;
                height: 90px;
                width: auto;
                margin-top: 20px;
                cursor: url('/images/cursor3.png'), pointer;
                color: #fff;
                font-size: 0.9rem;

                p {
                  margin-top: 5px;
                }

                img {
                  width: auto;
                  height: 50px;
                  image-rendering: pixelated;
                }
              `}
              onClick={() => history.push('/infinite')}>
              <img src={InfiniteIcon} />
              <p>Infinite</p>
            </div>
            <div
              css={css`
                text-align: center;
                height: 90px;
                width: auto;
                margin-top: 20px;
                cursor: url('/images/cursor3.png'), pointer;
                color: #fff;
                font-size: 0.9rem;

                p {
                  margin-top: 5px;
                }

                img {
                  width: auto;
                  height: 50px;
                  image-rendering: pixelated;
                }
              `}
              onClick={() => history.push('/evolution')}>
              <img src={EvolutionIcon} />
              <p>Evolution</p>
            </div>
            <div
              css={css`
                text-align: center;
                height: 90px;
                width: auto;
                margin-top: 20px;
                cursor: url('/images/cursor3.png'), pointer;
                color: #fff;
                font-size: 0.9rem;

                p {
                  margin-top: 5px;
                }

                img {
                  width: auto;
                  height: 50px;
                  image-rendering: pixelated;
                }
              `}
              onClick={() => history.push('/sanctuary')}>
              <img src={SanctuaryIcon} />
              <p>Sanctuary</p>
            </div>
            <div
              css={css`
                text-align: center;
                height: 90px;
                width: auto;
                margin-top: 20px;
                cursor: url('/images/cursor3.png'), pointer;
                color: #fff;
                font-size: 0.9rem;

                p {
                  margin-top: 5px;
                }

                img {
                  width: auto;
                  height: 50px;
                  image-rendering: pixelated;
                }
              `}
              onClick={() => history.push('/guardians')}>
              <img src={GuardiansIcon} />
              <p>Guardians</p>
            </div>
          </div>
        </div>
      ) : null}
      <StyledNotFound>
        {notFound ? (
          <>
            <Heading size="xxl">404</Heading>
            <Text mb="16px">{t('What you seek could not be found.')}</Text>
            <Button as="a" href="/" scale="sm">
              {t('Back Home')}
            </Button>
          </>
        ) : (
          <>
            <Heading size="xxl">Loading...</Heading>
          </>
        )}
      </StyledNotFound>
    </>
  );
};

export default NotFound;
