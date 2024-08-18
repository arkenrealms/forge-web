import React, { useState } from 'react';
import history from '~/routerHistory';

const Areas = function () {
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
            <h1 className="locationtitle">Areas</h1>
          </div>
          <div className="locationdescription w-richtext">
            <p>Areas within Arken: Heart of the Oasis are built as biomes, each with different features.</p>
            <p>‍</p>
          </div>
          <div className="locationdescription w-richtext">
            <h2>Main Regions</h2>
          </div>
          <ul role="list">
            <li>
              <a
                data-load-page="/area/elysium"
                onClick={(e) => {
                  e.preventDefault();
                  history.push('/area/elysium');
                }}
                href="/area/elysium"
                className="w-inline-block">
                <div>Elysium</div>
              </a>
            </li>
            <li>
              <a
                data-load-page="/area/valburn"
                onClick={(e) => {
                  e.preventDefault();
                  history.push('/area/valburn');
                }}
                href="/area/valburn"
                className="w-inline-block">
                <div>Valburn</div>
              </a>
            </li>
            <li>
              <a
                data-load-page="/area/qiddir"
                onClick={(e) => {
                  e.preventDefault();
                  history.push('/area/qiddir');
                }}
                href="/area/qiddir"
                className="w-inline-block">
                <div>Qiddir</div>
              </a>
            </li>
            <li>
              <a
                data-load-page="/area/ashyrah"
                onClick={(e) => {
                  e.preventDefault();
                  history.push('/area/ashyrah');
                }}
                href="/area/ashyrah"
                className="w-inline-block">
                <div>Ashyrah</div>
              </a>
            </li>
            <li>
              <a
                data-load-page="/area/fayhelm"
                onClick={(e) => {
                  e.preventDefault();
                  history.push('/area/fayhelm');
                }}
                href="/area/fayhelm"
                className="w-inline-block">
                <div>Fayhelm</div>
              </a>
            </li>
            <li>
              <a
                data-load-page="/area/forsaken-lands"
                onClick={(e) => {
                  e.preventDefault();
                  history.push('/area/forsaken-lands');
                }}
                href="/area/forsaken-lands"
                className="w-inline-block">
                <div>Forsaken Lands</div>
              </a>
            </li>
          </ul>
          <div className="locationdescription w-richtext">
            <p>‍</p>
            <h2>Cities</h2>
          </div>
          <ul role="list">
            <li>
              <a
                data-load-page="/area/dragonhollow"
                onClick={(e) => {
                  e.preventDefault();
                  history.push('/area/dragonhollow');
                }}
                href="/area/dragonhollow"
                className="w-inline-block">
                <div>Dragonhollow</div>
              </a>
            </li>
            <li>
              <a
                data-load-page="/area/irondell"
                onClick={(e) => {
                  e.preventDefault();
                  history.push('/area/irondell');
                }}
                href="/area/irondell"
                className="w-inline-block">
                <div>Irondell</div>
              </a>
            </li>
            <li>
              <a
                data-load-page="/area/linden"
                onClick={(e) => {
                  e.preventDefault();
                  history.push('/area/linden');
                }}
                href="/area/linden"
                className="w-inline-block">
                <div>Linden</div>
              </a>
            </li>
            <li>
              <a
                data-load-page="/area/westmarsh"
                onClick={(e) => {
                  e.preventDefault();
                  history.push('/area/westmarsh');
                }}
                href="/area/westmarsh"
                className="w-inline-block">
                <div>Westmarsh</div>
              </a>
            </li>
            <li>
              <a
                data-load-page="/area/toralir"
                onClick={(e) => {
                  e.preventDefault();
                  history.push('/area/toralir');
                }}
                href="/area/toralir"
                className="w-inline-block">
                <div>Toralir</div>
              </a>
            </li>
            <li>
              <a
                data-load-page="/area/archon-citadel"
                onClick={(e) => {
                  e.preventDefault();
                  history.push('/area/archon-citadel');
                }}
                href="/area/archon-citadel"
                className="w-inline-block">
                <div>Archon Citadel</div>
              </a>
            </li>
            <li>
              <a
                data-load-page="/area/der-uden"
                onClick={(e) => {
                  e.preventDefault();
                  history.push('/area/der-uden');
                }}
                href="/area/der-uden"
                className="w-inline-block">
                <div>Der'uden</div>
              </a>
            </li>
            <li>
              <a
                data-load-page="/area/faytree"
                onClick={(e) => {
                  e.preventDefault();
                  history.push('/area/faytree');
                }}
                href="/area/faytree"
                className="w-inline-block">
                <div>Faytree</div>
              </a>
            </li>
            <li>
              <a
                data-load-page="/area/free-city-of-vtello"
                onClick={(e) => {
                  e.preventDefault();
                  history.push('/area/free-city-of-vtello');
                }}
                href="/area/free-city-of-vtello"
                className="w-inline-block">
                <div>Free City of Vtello</div>
              </a>
            </li>
            <li>
              <a
                data-load-page="/area/hevane"
                onClick={(e) => {
                  e.preventDefault();
                  history.push('/area/hevane');
                }}
                href="/area/hevane"
                className="w-inline-block">
                <div>Hevane</div>
              </a>
            </li>
          </ul>
          <div className="locationdescription w-richtext">
            <p>‍</p>
            <h2>Other Areas</h2>
          </div>
          <ul role="list">
            <li>
              <a
                data-load-page="/area/arreat-summit"
                onClick={(e) => {
                  e.preventDefault();
                  history.push('/area/arreat-summit');
                }}
                href="/area/arreat-summit"
                className="w-inline-block">
                <div>Arreat Summit</div>
              </a>
            </li>
            <li>
              <a
                data-load-page="/area/end-of-time"
                onClick={(e) => {
                  e.preventDefault();
                  history.push('/area/end-of-time');
                }}
                href="/area/end-of-time"
                className="w-inline-block">
                <div>End of Time</div>
              </a>
            </li>
          </ul>
          <div className="locationdescription w-richtext">
            <p>‍</p>
            <h2>Biomes</h2>
            <ul role="list">
              <li>Alps</li>
              <li>Arctic</li>
              <li>Forest</li>
              <li>Bamboo Forest</li>
              <li>Bayou</li>
              <li>Bog</li>
              <li>Boreal Forest</li>
              <li>Brushland</li>
              <li>Canyon</li>
              <li>Chaparral</li>
              <li>Cherry Blossom Grove</li>
              <li>Coniferous Forest</li>
              <li>Crag</li>
              <li>Dead Forest</li>
              <li>Dead Swamp</li>
              <li>Deciduous Forest</li>
              <li>Dense Forest</li>
              <li>Eucalyptus Forest</li>
              <li>Fen</li>
              <li>Flower Field</li>
              <li>Frost Forest</li>
              <li>Fungi Forest</li>
              <li>Garden</li>
              <li>Grassland</li>
              <li>Grove</li>
              <li>Heathland</li>
              <li>Highland</li>
              <li>Jade Cliffs</li>
              <li>Land of Lakes</li>
              <li>Lavender Fields</li>
              <li>Lush Desert</li>
              <li>Lush Swamp</li>
              <li>Marsh</li>
              <li>Meadow</li>
              <li>Moor</li>
              <li>Mountain</li>
              <li>Mystic Grove</li>
              <li>Ominous Woods</li>
              <li>Origin Valley</li>
              <li>Outback</li>
              <li>Prairie</li>
              <li>Rainforest</li>
              <li>Redwood Forest</li>
              <li>Sacred Springs</li>
              <li>Seasonal Forest</li>
              <li>Shield</li>
              <li>Shrubland</li>
              <li>Sludgepit</li>
              <li>Snowy Coniferous Forest</li>
              <li>Steppe</li>
              <li>Temperate Rainforest</li>
              <li>Thicket</li>
              <li>Tropical Rainforest</li>
              <li>Tundra</li>
              <li>Wasteland</li>
              <li>Wetland</li>
              <li>Woodland</li>
              <li>Volcano</li>
              <li>Lava Fields</li>
              <li>Ocean</li>
              <li>Lake</li>
              <li>Bay</li>
              <li>River</li>
              <li>Arctic Water</li>
              <li>Glacier</li>
              <li>Underground</li>
            </ul>
            <p>‍</p>
            <h2>Biome Features</h2>
            <ul role="list">
              <li>Snowy</li>
              <li>Forest</li>
              <li>Jungle </li>
              <li>Swamp</li>
              <li>Plains</li>
              <li>Sandy</li>
              <li>Sparse</li>
              <li>Magical</li>
              <li>Wasteland</li>
              <li>Hills</li>
              <li>Lush</li>
              <li>Mountain</li>
              <li>Cold</li>
              <li>Spooky</li>
              <li>Dead</li>
              <li>Dry</li>
              <li>Coniferous</li>
              <li>Dense</li>
              <li>Hot</li>
              <li>Wet</li>
              <li>Savanna</li>
              <li>Water</li>
              <li>Mushroom</li>
              <li>Deciduous</li>
              <li>Rocky</li>
            </ul>
          </div>
        </div>
      </main>
    </>
  );
};

export default Areas;
