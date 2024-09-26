import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import useFetch from '~/hooks/useFetch';
import history from '~/routerHistory';
import LoreBlock1 from '~/components/LoreBlock1';
import { Flex, Skeleton } from '~/ui';

const Abc = styled.div``;

const ItemTypes = function () {
  const url = `https://s1.envoy.arken.asi.sh/itemTypes.json`;
  const { data } = useFetch(url);

  const itemTypes = data?.[url] || [];

  if (!itemTypes.length)
    return (
      <div style={{ padding: 10 }}>
        <Skeleton height="80px" mb="16px" mt="16px" ml="16px" mr="16px" />
      </div>
    );

  return (
    <>
      <main className="content-wrapper wf-section">
        <div className="page-bg-top">
          <img
            src="/images/61909a3f8c3bca7411981f34_mage-isles-tsunami3.jpeg"
            loading="lazy"
            sizes="100vw"
            srcSet="/images/61909a3f8c3bca7411981f34_mage-isles-tsunami3-p-500.jpeg 500w, /images/61909a3f8c3bca7411981f34_mage-isles-tsunami3-p-800.jpeg 800w, /images/61909a3f8c3bca7411981f34_mage-isles-tsunami3.jpeg 1067w"
            alt=""
            className="bg-art-top"
          />
        </div>
        <div className="container hide-overflow w-container">
          <div className="locationheader">
            <div className="locationheaderbg" />
            <h1 className="locationtitle">Item Types</h1>
          </div>
          <div className="locationdescription w-richtext">
            {/* <h1>Introduction</h1> */}
            <p>
              Found across the lands of Haerra are a plethora of items ranging from scrap metal to unfathomable power.
            </p>
            <p>‍</p>
            {/* {itemTypes.map(race => (
              <div key={race.name} css={css`margin-bottom: 30px;`}>
                <LoreBlock1 name={race.name} onClick={() => history.push('/race/' + race.name.toLowerCase().replace(/ /g, '-'))}>
                  <Flex flexDirection="row" alignItems="start" justifyContent="center">
                    <div css={css`margin-top: 20px;`}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{race.description}</ReactMarkdown>
                      <br />
                      <ul role="list">
                        <li>Geography:&nbsp;{race.geography}</li>
                      </ul>
                    </div>
                  </Flex>
                </LoreBlock1>
              </div>
            ))} */}
            <p>‍</p>
            <p>‍</p>
            <p>‍</p>
            <p>‍</p>
            <p>‍</p>
            <p>‍</p>
          </div>
        </div>
      </main>
    </>
  );
};

export default ItemTypes;
