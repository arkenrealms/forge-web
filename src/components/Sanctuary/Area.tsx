import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import useFetch from '~/hooks/useFetch';
import { Skeleton } from '~/ui';
import Linker from '~/components/Linker';
import areas from '@arken/node/legacy/data/generated/areas.json';

const Area = function ({ id }) {
  // const url = `https://s1.envoy.arken.asi.sh/areas.json`
  // const { data } = useFetch(url)

  // const areas = data?.[url] || []
  const area = areas.find((z) => z.name.toLowerCase().replace(/ /g, '-') === id);

  if (!area)
    return (
      <div style={{ padding: 10 }}>
        <Skeleton height="80px" mb="16px" mt="16px" ml="16px" mr="16px" />
      </div>
    );

  return (
    <>
      <div className="w-embed">
        <style
          dangerouslySetInnerHTML={{
            __html:
              '\n      .frame {\n        border-width: 1px;\n        border-style: solid;\n        border-color: transparent;\n        border-image: url(/images/frame.png) 80 / 80px / 0 repeat;\n        background-color: rgba(0, 0, 0, 0.4);\n        border-radius: 0px;\n      }\n    ',
          }}
        />
      </div>
      <main className="content-wrapper wf-section">
        <div className="page-bg-top">
          <img src={area.image} loading="eager" alt="" className="bg-art-top" />
        </div>
        <div className="container _1col1row center-content w-condition-invisible w-container">
          <div className="locationheader">
            <div className="locationheaderbg" />
            <h1 className="locationtitle">{area.name}</h1>
          </div>
          {area.shortDescription ? (
            <div className="paragraph-5 frame w-richtext">
              <Linker id="area-1-1">{area.shortDescription}</Linker>
            </div>
          ) : null}
          <div>
            <div className="locationdescription w-richtext">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{area.lore1}</ReactMarkdown>
            </div>
          </div>
          <article className="section-left">
            <div>
              <div className="character-details-content">
                <div className="blocktitle-sm w-dyn-bind-empty" />
                <div className="character-details-block no-bb">
                  <div className="class-perk">
                    <div className="w-richtext">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{area.lore2}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
          <article className="section-right">
            <div>
              <div className="w-dyn-bind-empty w-richtext" />
            </div>
          </article>
        </div>
        <div className="container _2cols center-content w-condition-invisible w-container">
          <div className="locationheader">
            <div className="locationheaderbg" />
            <h1 className="locationtitle">{area.name}</h1>
          </div>
          {area.shortDescription ? (
            <div className="paragraph-5 frame w-richtext">
              <Linker id="area-1-2">{area.shortDescription}</Linker>
            </div>
          ) : null}
          <div className="w-layout-grid page-layout zone-layout-1">
            <article className="section-left">
              <div className="w-richtext">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{area.lore1}</ReactMarkdown>
              </div>
              <div className="w-richtext">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{area.lore2}</ReactMarkdown>
              </div>
              <div>
                <div className="character-details-content">
                  <div className="character-details-block no-bb" />
                </div>
              </div>
            </article>
            <div>
              <div className="w-richtext">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{area.lore3}</ReactMarkdown>
              </div>
              <div className="w-dyn-bind-empty w-richtext" />
            </div>
          </div>
        </div>
        <div className="container _2row1c2c center-content w-container">
          <div className="locationheader">
            <div className="locationheaderbg" />
            <h1 className="locationtitle">{area.name}</h1>
          </div>
          {area.shortDescription ? (
            <div className="paragraph-5 frame w-richtext">
              <Linker id="area-1-3">{area.shortDescription}</Linker>
            </div>
          ) : null}
          <div>
            <div className="locationdescription w-richtext">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{area.lore1}</ReactMarkdown>
            </div>
          </div>
          <div className="w-layout-grid page-layout zone-layout-2">
            <article className="section-left">
              <div>
                <div className="character-details-content">
                  <div className="blocktitle-sm w-dyn-bind-empty" />
                  <div className="character-details-block no-bb">
                    <div className="class-perk">
                      <div className="w-richtext">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{area.lore2}</ReactMarkdown>
                      </div>
                      <div className="w-dyn-bind-empty w-richtext" />
                    </div>
                  </div>
                </div>
              </div>
            </article>
            <article className="section-right">
              <div>
                <div className="w-richtext">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{area.lore3}</ReactMarkdown>
                </div>
              </div>
            </article>
          </div>
        </div>
        <div className="container _2row1c3c center-content w-condition-invisible w-container">
          <div className="locationheader">
            <div className="locationheaderbg" />
            <h1 className="locationtitle">{area.name}</h1>
          </div>
          {area.shortDescription ? (
            <div className="paragraph-5 frame w-richtext">
              <Linker id="area-1-4">{area.shortDescription}</Linker>
            </div>
          ) : null}
          <div>
            <div className="locationdescription w-richtext">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{area.lore1}</ReactMarkdown>
            </div>
          </div>
          <div className="w-layout-grid page-layout _3-col zone-layout-3">
            <div className="w-richtext">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{area.lore2}</ReactMarkdown>
            </div>
            <div className="w-richtext">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{area.lore3}</ReactMarkdown>
            </div>
            <div className="w-dyn-bind-empty w-richtext" />
          </div>
        </div>
        <div className="container center-content w-condition-invisible w-container">
          <div className="locationheader">
            <div className="locationheaderbg" />
            <h1 className="locationtitle">{area.name}</h1>
          </div>
          {area.shortDescription ? (
            <div className="paragraph-5 frame w-richtext">
              <Linker id="area-1-5">{area.shortDescription}</Linker>
            </div>
          ) : null}
          <div>
            <div className="locationdescription w-richtext">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{area.lore1}</ReactMarkdown>
            </div>
          </div>
          <div className="w-layout-grid page-layout zone-layout-4">
            <article className="section-left">
              <div>
                <div className="character-details-content">
                  <div className="blocktitle-sm w-dyn-bind-empty" />
                  <div className="character-details-block no-bb">
                    <div className="w-richtext">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{area.lore2}</ReactMarkdown>
                    </div>
                    <div className="w-richtext">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{area.lore3}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            </article>
            <article className="section-right">
              <div>
                <div className="w-dyn-bind-empty w-richtext" />
              </div>
            </article>
          </div>
        </div>
        <br />
        <br />
        <br />
        <br />
      </main>
    </>
  );
};

export default Area;
