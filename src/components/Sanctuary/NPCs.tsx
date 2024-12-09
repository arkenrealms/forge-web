import React, { useState } from 'react';
import history from '~/routerHistory';
import { Skeleton, Card, Card3 } from '~/ui';
import { trpc } from '~/utils/trpc';
import * as Arken from '@arken/node';

const Zones = function () {
  const { data: npcs } = trpc.seer.core.getCharacters.useQuery({
    type: 'NPC',
  });

  return (
    <Card3 style={{ marginTop: 10 }}>
      <Card>
        <main className="content-wrapper wf-section">
          <div className="page-bg-top">
            <img
              src="/images/mage-isles-tsunami3.jpeg"
              loading="lazy"
              sizes="100vw"
              srcSet="/images/mage-isles-tsunami3-p-500.jpeg 500w, /images/mage-isles-tsunami3-p-800.jpeg 800w, /images/mage-isles-tsunami3.jpeg 1067w"
              alt=""
              className="bg-art-top"
            />
          </div>
          <div className="container hide-overflow w-container">
            <div className="locationheader">
              <div className="locationheaderbg" />
              <h1 className="locationtitle">NPCs</h1>
            </div>
            <div className="locationdescription w-richtext">
              <p>The majority of NPCs in Heart of the Oasis are native to Haerra, but some are not.</p>
            </div>
            <div className="locationdescription w-richtext">
              <h2>Primary NPCs</h2>
            </div>
            <ul role="list">
              <li>
                <a
                  data-load-page="/game/oasis/npcs/zeno"
                  onClick={(e) => {
                    e.preventDefault();
                    history.push('/game/oasis/npcs/zeno');
                  }}
                  href="/game/oasis/npcs/zeno"
                  className="w-inline-block">
                  <div>Zeno</div>
                </a>
              </li>
              <li>
                <a
                  data-load-page="/game/oasis/npcs/azorag"
                  onClick={(e) => {
                    e.preventDefault();
                    history.push('/game/oasis/npcs/azorag');
                  }}
                  href="/game/oasis/npcs/azorag"
                  className="w-inline-block">
                  <div>Azorag</div>
                </a>
              </li>
              <li>
                <a
                  data-load-page="/game/oasis/npcs/eledon"
                  onClick={(e) => {
                    e.preventDefault();
                    history.push('/game/oasis/npcs/eledon');
                  }}
                  href="/game/oasis/npcs/eledon"
                  className="w-inline-block">
                  <div>Eledon</div>
                </a>
              </li>
              <li>
                <a
                  data-load-page="/game/oasis/npcs/logos"
                  onClick={(e) => {
                    e.preventDefault();
                    history.push('/game/oasis/npcs/logos');
                  }}
                  href="/game/oasis/npcs/logos"
                  className="w-inline-block">
                  <div>Logos</div>
                </a>
              </li>
              <li>
                <a
                  data-load-page="/game/oasis/npcs/deleran"
                  onClick={(e) => {
                    e.preventDefault();
                    history.push('/game/oasis/npcs/deleran');
                  }}
                  href="/game/oasis/npcs/deleran"
                  className="w-inline-block">
                  <div>Deleran</div>
                </a>
              </li>
            </ul>
            <div className="locationdescription w-richtext">
              <p>‍</p>
              <h2>Other NPCs</h2>
            </div>
            <ul role="list">
              <li>
                <a
                  data-load-page="/game/oasis/npcs/ghosharak"
                  onClick={(e) => {
                    e.preventDefault();
                    history.push('/game/oasis/npcs/ghosharak');
                  }}
                  href="/game/oasis/npcs/ghosharak"
                  className="w-inline-block">
                  <div>Ghosharak</div>
                </a>
              </li>
              <li>
                <a
                  data-load-page="/game/oasis/npcs/miraqesh"
                  onClick={(e) => {
                    e.preventDefault();
                    history.push('/game/oasis/npcs/miraqesh');
                  }}
                  href="/game/oasis/npcs/miraqesh"
                  className="w-inline-block">
                  <div>Miraqesh</div>
                </a>
              </li>
            </ul>
          </div>
        </main>
      </Card>
    </Card3>
  );
};

export default Zones;
