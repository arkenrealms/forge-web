import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import useFetch from '~/hooks/useFetch';
import { Skeleton } from '~/ui';
import Linker from '~/components/Linker';
import eras from '@arken/node/data/generated/eras.json';

const Era = function ({ id }) {
  // const url = `https://s1.envoy.arken.asi.sh/eras.json`
  // const { data } = useFetch(url)

  // const eras = data?.[url] || []
  const era = eras.find((z) => z.name.toLowerCase().replace(' ', '-') === id);

  if (!era)
    return (
      <div style={{ padding: 10 }}>
        <Skeleton height="80px" mb="16px" mt="16px" ml="16px" mr="16px" />
      </div>
    );

  return (
    <main className="content-wrapper body-5 era wf-section">
      <div className="act-bg-top">
        <img src={era.image} loading="eager" alt="" className="bg-art-top bg-art-top-2" />
        <img src={era.image} loading="eager" alt="" className="bg-art-top w-condition-invisible" />
      </div>
      <div className="container act-container w-container">
        <h1 className="page-title act-title">{era.name}</h1>
        <div className="w-richtext">
          {/* <ReactMarkdown remarkPlugins={[remarkGfm]}>{era.description}</ReactMarkdown> */}
          <Linker id="era-1">{era.description}</Linker>
        </div>
        <div className="w-layout-grid act-layout-1">
          <div>
            <div className="w-dyn-bind-empty w-richtext" />
            <div className="w-dyn-bind-empty w-richtext" />
          </div>
          <div>
            <div className="w-dyn-bind-empty w-richtext" />
            <div className="w-dyn-bind-empty w-richtext" />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Era;
