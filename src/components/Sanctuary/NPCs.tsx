import React, { useState } from 'react';
import history from '~/routerHistory';

const Zones = function () {
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
            <h1 className="locationtitle">Zones</h1>
          </div>
          <div className="locationdescription w-richtext">
            <p>The majority of NPCs in Arken: Heart of the Oasis are native to Haerra, but some are not.</p>
          </div>
          <div className="locationdescription w-richtext">
            <h2>Primary NPCs</h2>
          </div>
          <ul role="list">
            <li>
              <a
                data-load-page="/npc/zeno"
                onClick={(e) => {
                  e.preventDefault();
                  history.push('/npc/zeno');
                }}
                href="/npc/zeno"
                className="w-inline-block">
                <div>Zeno</div>
              </a>
            </li>
            <li>
              <a
                data-load-page="/npc/azorag"
                onClick={(e) => {
                  e.preventDefault();
                  history.push('/npc/azorag');
                }}
                href="/npc/azorag"
                className="w-inline-block">
                <div>Azorag</div>
              </a>
            </li>
            <li>
              <a
                data-load-page="/npc/eledon"
                onClick={(e) => {
                  e.preventDefault();
                  history.push('/npc/eledon');
                }}
                href="/npc/eledon"
                className="w-inline-block">
                <div>Eledon</div>
              </a>
            </li>
            <li>
              <a
                data-load-page="/npc/logos"
                onClick={(e) => {
                  e.preventDefault();
                  history.push('/npc/logos');
                }}
                href="/npc/logos"
                className="w-inline-block">
                <div>Logos</div>
              </a>
            </li>
            <li>
              <a
                data-load-page="/npc/deleran"
                onClick={(e) => {
                  e.preventDefault();
                  history.push('/npc/deleran');
                }}
                href="/npc/deleran"
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
                data-load-page="/npc/ghosharak"
                onClick={(e) => {
                  e.preventDefault();
                  history.push('/npc/ghosharak');
                }}
                href="/npc/ghosharak"
                className="w-inline-block">
                <div>Ghosharak</div>
              </a>
            </li>
            <li>
              <a
                data-load-page="/npc/miraqesh"
                onClick={(e) => {
                  e.preventDefault();
                  history.push('/npc/miraqesh');
                }}
                href="/npc/miraqesh"
                className="w-inline-block">
                <div>Miraqesh</div>
              </a>
            </li>
          </ul>
        </div>
      </main>
    </>
  );
};

export default Zones;
