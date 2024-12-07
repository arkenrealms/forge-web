import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import useFetch from '~/hooks/useFetch';
import history from '~/routerHistory';
import { Skeleton, Card, Card3 } from '~/ui';
import acts from '@arken/node/data/generated/acts.json';

const Acts = function () {
  // const url = `https://s1.envoy.arken.asi.sh/acts.json`
  // const { data } = useFetch(url)

  // const acts = data?.[url] || []

  if (!acts?.length)
    return (
      <div style={{ padding: 10 }}>
        <Skeleton height="80px" mb="16px" mt="16px" ml="16px" mr="16px" />
      </div>
    );

  return (
    <Card3 style={{ marginTop: 10 }}>
      <Card>
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
              <h1 className="locationtitle">Acts</h1>
            </div>
            <div className="locationdescription w-richtext">
              <p>Heart of the Oasis is composed of 8 acts, each with branches that will be improved in DLC content.</p>
            </div>
            <div className="w-layout-grid page-layout" onClick={() => history.push('/act/1')}>
              <article className="section-right">
                <div className="boxframe-1 hmax">
                  <div className="character-details-content">
                    <div className="blocktitle-sm">Act 1</div>
                    <div className="character-details-block no-bb">
                      <div className="class-perk">
                        <div className="class-perk-name-2">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {acts.find((c) => c.name === 'Act 1').shortDescription}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
            <div className="w-layout-grid page-layout" onClick={() => history.push('/act/2')}>
              <article className="section-right">
                <div className="boxframe-1 hmax">
                  <div className="character-details-content">
                    <div className="blocktitle-sm">Act 2</div>
                    <div className="character-details-block no-bb">
                      <div className="class-perk">
                        <div className="class-perk-name-2">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {acts.find((c) => c.name === 'Act 2').shortDescription}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
            <div className="w-layout-grid page-layout" onClick={() => history.push('/act/3')}>
              <article className="section-right">
                <div className="boxframe-1 hmax">
                  <div className="character-details-content">
                    <div className="blocktitle-sm">Act 3</div>
                    <div className="character-details-block no-bb">
                      <div className="class-perk">
                        <div className="class-perk-name-2">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {acts.find((c) => c.name === 'Act 3').shortDescription}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
            <div className="w-layout-grid page-layout" onClick={() => history.push('/act/4')}>
              <article className="section-right">
                <div className="boxframe-1 hmax">
                  <div className="character-details-content">
                    <div className="blocktitle-sm">Act 4</div>
                    <div className="character-details-block no-bb">
                      <div className="class-perk">
                        <div className="class-perk-name-2">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {acts.find((c) => c.name === 'Act 4').shortDescription}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
            <div className="w-layout-grid page-layout" onClick={() => history.push('/act/5')}>
              <article className="section-right">
                <div className="boxframe-1 hmax">
                  <div className="character-details-content">
                    <div className="blocktitle-sm">Act 5</div>
                    <div className="character-details-block no-bb">
                      <div className="class-perk">
                        <div className="class-perk-name-2">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {acts.find((c) => c.name === 'Act 5').shortDescription}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
            <div className="w-layout-grid page-layout" onClick={() => history.push('/act/6')}>
              <article className="section-right">
                <div className="boxframe-1 hmax">
                  <div className="character-details-content">
                    <div className="blocktitle-sm">Act 6</div>
                    <div className="character-details-block no-bb">
                      <div className="class-perk">
                        <div className="class-perk-name-2">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {acts.find((c) => c.name === 'Act 6').shortDescription}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
            <div className="w-layout-grid page-layout" onClick={() => history.push('/act/7')}>
              <article className="section-right">
                <div className="boxframe-1 hmax">
                  <div className="character-details-content">
                    <div className="blocktitle-sm">Act 7</div>
                    <div className="character-details-block no-bb">
                      <div className="class-perk">
                        <div className="class-perk-name-2">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {acts.find((c) => c.name === 'Act 7').shortDescription}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
            <div className="w-layout-grid page-layout" onClick={() => history.push('/act/8')}>
              <article className="section-right">
                <div className="boxframe-1 hmax">
                  <div className="character-details-content">
                    <div className="blocktitle-sm">Act 8</div>
                    <div className="character-details-block no-bb">
                      <div className="class-perk">
                        <div className="class-perk-name-2">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {acts.find((c) => c.name === 'Act 8').shortDescription}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </main>
      </Card>
    </Card3>
  );
};

export default Acts;
