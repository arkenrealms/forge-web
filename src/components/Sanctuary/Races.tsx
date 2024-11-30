import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import useFetch from '~/hooks/useFetch';
import history from '~/routerHistory';
import LoreBlock1 from '~/components/LoreBlock1';
import { Flex, Skeleton } from '~/ui';
import races from '@arken/node/data/generated/characterRaces.json';

const Abc = styled.div``;

const Races = function () {
  // const url = `https://s1.envoy.arken.asi.sh/characterRaces.json`
  // const { data } = useFetch(url)

  // const races = data?.[url] || []

  if (!races.length)
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
            <h1 className="locationtitle">Races</h1>
          </div>
          <div className="locationdescription w-richtext">
            {/* <h1>Introduction</h1> */}
            <p>
              Heart of the Oasis will have playable races (how many is still to be determined), and various others to
              encounter within the universe.
            </p>
            <p>‍</p>
            {races.map((race) => (
              <div
                key={race.name}
                css={css`
                  margin-bottom: 30px;
                `}>
                <LoreBlock1
                  name={race.name}
                  onClick={() => history.push('/race/' + race.name.toLowerCase().replace(/ /g, '-'))}>
                  <Flex flexDirection="row" alignItems="start" justifyContent="center">
                    <img
                      id="w-node-df400f55-31e6-1136-797f-230aa8853a1f-a4dd0c1b"
                      loading="eager"
                      src={race.image}
                      alt=""
                      className="image-18"
                      css={css`
                        margin-bottom: 20px;
                        max-width: 200px;
                      `}
                    />
                    <div
                      css={css`
                        margin-top: 20px;
                      `}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{race.description}</ReactMarkdown>
                      <br />
                      <ul role="list">
                        <li>Geography:&nbsp;{race.geography}</li>
                      </ul>
                    </div>
                  </Flex>
                </LoreBlock1>
              </div>
            ))}
            <p>‍</p>
            <p>‍</p>
            <LoreBlock1 name="Alorium" onClick={() => history.push('/race/alorium')}>
              <p>
                Astralytes of incredible power, these select few servants of Eledon have mastered themselves, the
                principles of Eledon, and astra energy itself. Now they aid Eledon in the governance of his empire:
                overseeing the training of his soldiers and clergy, issuing judgement in trials and ensuring his laws
                are upheld.
              </p>
            </LoreBlock1>
            <p>‍</p>
            <p>‍</p>
            <LoreBlock1 name="Demorium" onClick={() => history.push('/race/demorium')}>
              <p>
                Demorium are the most vicious and powerful chaospawn in Azorag's realm. With an unfaltering thirst for
                chaos, these few individuals have been handpicked by Azorag to help him oversee his nation, lead his
                soldiers, and corrupt his foes through fear or lust.
              </p>
            </LoreBlock1>
            <p>‍</p>
            <p>‍</p>
            <LoreBlock1 name="Astralyte" onClick={() => history.push('/race/astralyte')}>
              <p>
                The celestial beings known as astralytes are servants of Eledon, and denote all those under his
                dominion. Although typically thought of as beautiful humanoids with white feathered wings, astralytes
                take a variety of forms, from humanoid to beast-like and many without any wings at all. All astralytes
                swear allegiance to Eledon, and few who dared to break that oath live to tell the tale.
              </p>
            </LoreBlock1>
            <p>‍</p>
            <p>‍</p>
            <LoreBlock1 name="Chaospawn" onClick={() => history.push('/race/chaospawn')}>
              <p>
                From horrifying to irresistibly beautiful, chaospawn adopt many forms depending on their origin. No
                matter their appearance, however, they all swear allegiance to Azorag and the consuming power of chaos.
                Some chaospawn are born--like the succubi--while others are created: tortured creatures of stitched skin
                and limb. Though few types of chaospawn share similar characteristics, they all have a common thirst for
                destruction and blood.
              </p>
            </LoreBlock1>
            <p>‍</p>
            <p>‍</p>
            <LoreBlock1 name="God" onClick={() => history.push('/race/god')}>
              <p>
                Beings of remarkable power, the gods mastered the energies, transcended into the cube, and survived the
                collapse of eleven universes. Now they influence the people of Haerra, gathering followers and
                orchestrating a release from their cubic prison. What this would mean for the people of Haerra: none
                truly understand--not even the gods.
              </p>
            </LoreBlock1>
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

export default Races;
