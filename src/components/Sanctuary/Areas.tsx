import React, { useState } from 'react';
import history from '~/routerHistory';
import { Skeleton, Card, Card3 } from '~/ui';

const Areas = function () {
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
              <h1 className="locationtitle">Areas</h1>
            </div>
            <div className="locationdescription w-richtext">
              <p>Areas within Heart of the Oasis are built as biomes, each with different features.</p>
              <p>‍</p>
            </div>
            <div className="locationdescription w-richtext">
              <h2>Main Regions</h2>
            </div>
            <ul role="list">
              <li>
                <a
                  data-load-page="/games/oasis/areas/elysium"
                  onClick={(e) => {
                    e.preventDefault();
                    history.push('/games/oasis/areas/elysium');
                  }}
                  href="/games/oasis/areas/elysium"
                  className="w-inline-block">
                  <div>Elysium</div>
                </a>
              </li>
              <li>
                <a
                  data-load-page="/games/oasis/areas/valburn"
                  onClick={(e) => {
                    e.preventDefault();
                    history.push('/games/oasis/areas/valburn');
                  }}
                  href="/games/oasis/areas/valburn"
                  className="w-inline-block">
                  <div>Valburn</div>
                </a>
              </li>
              <li>
                <a
                  data-load-page="/games/oasis/areas/qiddir"
                  onClick={(e) => {
                    e.preventDefault();
                    history.push('/games/oasis/areas/qiddir');
                  }}
                  href="/games/oasis/areas/qiddir"
                  className="w-inline-block">
                  <div>Qiddir</div>
                </a>
              </li>
              <li>
                <a
                  data-load-page="/games/oasis/areas/ashyrah"
                  onClick={(e) => {
                    e.preventDefault();
                    history.push('/games/oasis/areas/ashyrah');
                  }}
                  href="/games/oasis/areas/ashyrah"
                  className="w-inline-block">
                  <div>Ashyrah</div>
                </a>
              </li>
              <li>
                <a
                  data-load-page="/games/oasis/areas/fayhelm"
                  onClick={(e) => {
                    e.preventDefault();
                    history.push('/games/oasis/areas/fayhelm');
                  }}
                  href="/games/oasis/areas/fayhelm"
                  className="w-inline-block">
                  <div>Fayhelm</div>
                </a>
              </li>
              <li>
                <a
                  data-load-page="/games/oasis/areas/forsaken-lands"
                  onClick={(e) => {
                    e.preventDefault();
                    history.push('/games/oasis/areas/forsaken-lands');
                  }}
                  href="/games/oasis/areas/forsaken-lands"
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
                  data-load-page="/games/oasis/areas/dragonhollow"
                  onClick={(e) => {
                    e.preventDefault();
                    history.push('/games/oasis/areas/dragonhollow');
                  }}
                  href="/games/oasis/areas/dragonhollow"
                  className="w-inline-block">
                  <div>Dragonhollow</div>
                </a>
              </li>
              <li>
                <a
                  data-load-page="/games/oasis/areas/irondell"
                  onClick={(e) => {
                    e.preventDefault();
                    history.push('/games/oasis/areas/irondell');
                  }}
                  href="/games/oasis/areas/irondell"
                  className="w-inline-block">
                  <div>Irondell</div>
                </a>
              </li>
              <li>
                <a
                  data-load-page="/games/oasis/areas/linden"
                  onClick={(e) => {
                    e.preventDefault();
                    history.push('/games/oasis/areas/linden');
                  }}
                  href="/games/oasis/areas/linden"
                  className="w-inline-block">
                  <div>Linden</div>
                </a>
              </li>
              <li>
                <a
                  data-load-page="/games/oasis/areas/westmarsh"
                  onClick={(e) => {
                    e.preventDefault();
                    history.push('/games/oasis/areas/westmarsh');
                  }}
                  href="/games/oasis/areas/westmarsh"
                  className="w-inline-block">
                  <div>Westmarsh</div>
                </a>
              </li>
              <li>
                <a
                  data-load-page="/games/oasis/areas/toralir"
                  onClick={(e) => {
                    e.preventDefault();
                    history.push('/games/oasis/areas/toralir');
                  }}
                  href="/games/oasis/areas/toralir"
                  className="w-inline-block">
                  <div>Toralir</div>
                </a>
              </li>
              <li>
                <a
                  data-load-page="/games/oasis/areas/archon-citadel"
                  onClick={(e) => {
                    e.preventDefault();
                    history.push('/games/oasis/areas/archon-citadel');
                  }}
                  href="/games/oasis/areas/archon-citadel"
                  className="w-inline-block">
                  <div>Archon Citadel</div>
                </a>
              </li>
              <li>
                <a
                  data-load-page="/games/oasis/areas/der-uden"
                  onClick={(e) => {
                    e.preventDefault();
                    history.push('/games/oasis/areas/der-uden');
                  }}
                  href="/games/oasis/areas/der-uden"
                  className="w-inline-block">
                  <div>Der'uden</div>
                </a>
              </li>
              <li>
                <a
                  data-load-page="/games/oasis/areas/faytree"
                  onClick={(e) => {
                    e.preventDefault();
                    history.push('/games/oasis/areas/faytree');
                  }}
                  href="/games/oasis/areas/faytree"
                  className="w-inline-block">
                  <div>Faytree</div>
                </a>
              </li>
              <li>
                <a
                  data-load-page="/games/oasis/areas/free-city-of-vtello"
                  onClick={(e) => {
                    e.preventDefault();
                    history.push('/games/oasis/areas/free-city-of-vtello');
                  }}
                  href="/games/oasis/areas/free-city-of-vtello"
                  className="w-inline-block">
                  <div>Free City of Vtello</div>
                </a>
              </li>
              <li>
                <a
                  data-load-page="/games/oasis/areas/hevane"
                  onClick={(e) => {
                    e.preventDefault();
                    history.push('/games/oasis/areas/hevane');
                  }}
                  href="/games/oasis/areas/hevane"
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
                  data-load-page="/games/oasis/areas/arreat-summit"
                  onClick={(e) => {
                    e.preventDefault();
                    history.push('/games/oasis/areas/arreat-summit');
                  }}
                  href="/games/oasis/areas/arreat-summit"
                  className="w-inline-block">
                  <div>Arreat Summit</div>
                </a>
              </li>
              <li>
                <a
                  data-load-page="/games/oasis/areas/end-of-time"
                  onClick={(e) => {
                    e.preventDefault();
                    history.push('/games/oasis/areas/end-of-time');
                  }}
                  href="/games/oasis/areas/end-of-time"
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
      </Card>
    </Card3>
  );
};

export default Areas;
