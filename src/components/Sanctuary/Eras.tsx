import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import useFetch from '~/hooks/useFetch';
import history from '~/routerHistory';
import LoreBlock1 from '~/components/LoreBlock1';
import { Skeleton } from '~/ui';
import eras from '@arken/node/data/generated/eras.json';

const Eras = function () {
  // const url = `https://envoy.arken.gg/eras.json`
  // const { data } = useFetch(url)

  // const eras = data?.[url] || []

  if (!eras?.length)
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
            <h1 className="locationtitle">Eras</h1>
          </div>
          <div className="locationdescription w-richtext">
            <p>There are 5 main eras in the development of Haerra.</p>
          </div>
          <LoreBlock1 name="Era 1 - Prehistory" onClick={() => history.push('/era/prehistory')}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {eras.find((c) => c.name === 'Prehistory').description}
            </ReactMarkdown>
          </LoreBlock1>
          <LoreBlock1 name="Era 2 - The Dawning" onClick={() => history.push('/era/the-dawning')}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {eras.find((c) => c.name === 'The Dawning').description}
            </ReactMarkdown>
          </LoreBlock1>
          <LoreBlock1 name="Era 3 - The Illumination" onClick={() => history.push('/era/the-illumination')}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {eras.find((c) => c.name === 'The Illumination').description}
            </ReactMarkdown>
          </LoreBlock1>
          <LoreBlock1 name="Era 4 - The Hysteria" onClick={() => history.push('/era/the-hysteria')}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {eras.find((c) => c.name === 'The Hysteria').description}
            </ReactMarkdown>
          </LoreBlock1>
          <LoreBlock1 name="Era 5 - The Reckoning" onClick={() => history.push('/era/the-reckoning')}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {eras.find((c) => c.name === 'The Reckoning').description}
            </ReactMarkdown>
          </LoreBlock1>
        </div>
      </main>
    </>
  );
};

export default Eras;
