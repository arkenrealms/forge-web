import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { itemData } from '@arken/node/data/items';
import { ItemsMainCategoriesType } from '@arken/node/data/items.type';
import { normalizeItem } from '@arken/node/util/decoder';
import styled, { css } from 'styled-components';
import Item from '~/components/Item';
import { Heading } from '~/ui';

const isLocal = process.env.REACT_APP_RUNE_ENV === 'local';

const endpoints = {
  // cache: 'https://envoy.arken.gg',
  // coordinator: 'https://coordinator.arken.gg',
  cache: isLocal ? 'http://localhost:6001' : 'https://envoy.arken.gg',
  coordinator: isLocal ? 'http://localhost:5001' : 'https://coordinator.arken.gg',
};

const BoxHeading = styled(Heading)`
  margin-bottom: 16px;
`;
const Nothing = styled.div``;

const ThankYou = () => {
  const { t } = useTranslation();

  const [holders, setHolders] = useState([]);

  useEffect(() => {
    if (holders.length) return;

    const init = async function () {
      const res = ((await (await fetch(`${endpoints.cache}/patrons.json`)).json()) as any) || [];

      setHolders(res.filter((p) => !!p.isCubeHolder));
    };

    init();
  }, [holders, setHolders]);

  const cubeItem = normalizeItem(itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === "Founder's Cube"));

  return (
    <>
      <BoxHeading as="h2" size="lg" style={{ textAlign: 'center' }}>
        Big thank you to all our supportors!
      </BoxHeading>
      <br />
      <p>
        And special thanks to our{' '}
        <RouterLink
          to="/cube"
          // style={{ zoom: 1, padding: '6px 20px', textAlign: 'center', background: '#222' }}
          // onClick={() => {
          //   window.scrollTo(0, 0)
          // }}
          css={css`
            position: relative;
            display: inline-block;
            text-decoration: none;
            border: 0 none !important;
            margin-left: 5px;
            margin-right: 5px;

            & > div {
              position: relative;
              width: auto;
              height: auto;
              // border: 1px solid #fff;
              background: rgb(73 74 128 / 10%);
              border-radius: 5px;
              padding: 0 8px 8px;

              &:hover {
                background: rgb(73 74 128 / 20%);
              }
            }

            & > div > div:first-child {
              display: inline;
              margin-right: 5px;
            }

            & > div > div:first-child > div:first-child {
              display: inline-block;
              position: relative;
              top: 10px;
              left: 0;
              width: 30px;
              height: 30px;
            }
          `}>
          <Item
            itemIndex="thanksCube"
            item={cubeItem}
            isDisabled={false}
            showDropdown
            showQuantity={false}
            showActions={false}
            hideMetadata>
            <span style={{ borderBottom: '1px solid transparent' }}>Founder's Tavern</span>
          </Item>
        </RouterLink>{' '}
        patrons 🍻
        <br />
        <br />
        <div
          css={css`
            color: #999;
            & > * {
              color: #999 !important;
              border-bottom: none;
            }
          `}>
          {holders
            .sort(function (a, b) {
              return a.name > b.name ? 1 : -1;
            })
            .map((holder, index) => (
              <>
                <RouterLink to={`/user/${holder.name}`}>{holder.name}</RouterLink>
                {index !== holders.length - 1 ? ', ' : ''}
              </>
            ))}
        </div>
        {/* <span style={{color: '#888'}}>{holders.map(h => h.name).join(', ')}</span> */}
      </p>
      {/* {holders
            .map((holder) => (
              <div
                key={holder.id}
                css={css`
                  display: inline-block;
                  text-align: center;
                  width: 100px;
                  height: 100px;
                  vertical-align: top;
                  line-height: 1em;
                  font-size: 0.9rem;
                  cursor: url('/images/cursor3.png'), pointer;
                `}
              >
                <div
                  css={css`
                    background: url(${holder.icon}) no-repeat 0 0;
                    background-size: contain;
                    width: 60px;
                    height: 60px;
                    margin: 0 auto 10px;
                  `}
                />
                {holder.name}
              </div>
            ))} */}
    </>
  );
};

export default ThankYou;
