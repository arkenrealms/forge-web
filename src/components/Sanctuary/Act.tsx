import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import useFetch from '~/hooks/useFetch';
import { Skeleton } from '~/ui';

const Act = function ({ id }) {
  const url = `https://envoy.arken.gg/acts.json`;
  const { data } = useFetch(url);

  const acts = data?.[url] || [];
  const act = acts.find((z) => z.id + '' === id);

  if (!act)
    return (
      <div style={{ padding: 10 }}>
        <Skeleton height="80px" mb="16px" mt="16px" ml="16px" mr="16px" />
      </div>
    );

  return (
    <main className="content-wrapper body-5 act wf-section">
      <div className="act-bg-top">
        <img src={act.image} loading="eager" alt="" className="bg-art-top bg-art-top-2" />
        <img src={act.image} loading="eager" alt="" className="bg-art-top w-condition-invisible" />
      </div>
      <div className="container act-container w-container">
        <h1 className="page-title act-title">{act.name}</h1>
        <div className="w-richtext">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{act.shortDescription}</ReactMarkdown>
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

export default Act;
