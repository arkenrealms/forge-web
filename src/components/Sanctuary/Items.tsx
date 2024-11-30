import React, { useState } from 'react';
import {
  Heading,
  Text,
  BaseLayout,
  AutoRenewIcon,
  Button,
  Card,
  CardBody,
  Skeleton,
  CheckmarkCircleIcon,
  Flex,
  Tag,
  PrizeIcon,
  OpenNewIcon,
  LinkExternal,
  Link,
  BlockIcon,
} from '~/ui';

const Items = function () {
  return (
    <>
      <div className="page-bg-top">
        <img
          src="/images/62242f6dacea24ab1bebc2a1_1d5cee0e.jpeg"
          loading="eager"
          sizes="100vw"
          srcSet="/images/62242f6dacea24ab1bebc2a1_1d5cee0e-p-500.jpeg 500w, /images/62242f6dacea24ab1bebc2a1_1d5cee0e-p-800.jpeg 800w, /images/62242f6dacea24ab1bebc2a1_1d5cee0e.jpeg 1067w"
          alt=""
          className="bg-art-top"
        />
      </div>
      <main className="content-wrapper wf-section">
        <div className="container hide-overflow w-container">
          <Flex flexDirection="column" alignItems="center" justifyContent="center">
            <div className="locationheader">
              <div className="locationheaderbg" />
              <h1 className="locationtitle">Crafted Items</h1>
            </div>
          </Flex>
          <div className="locationdescription w-richtext">
            <p>These are items that have been crafted onchain as NFTs using runes earned from playing our games.</p>
          </div>
        </div>
        <div className="div-block-24 frame padding-adjust">
          <h2 id="w-node-bde60e1f-0335-b179-271c-7d40fcbd5f61-3d100cc1" className="pagetitle itemcattitle">
            Crafted&nbsp;Items
          </h2>
          <div className="itemtypesection">
            <h3 className="heading-2 itemtypetitle">Swords</h3>
            <div className="w-dyn-list">
              <div role="list" className="collection-list w-dyn-items">
                <div role="listitem" className="w-dyn-item">
                  <a data-load-page="x" href="/item/fury" className="list-item collapse-sm w-inline-block">
                    <div className="div-block-19">
                      <img
                        src="https://assets.website-files.com/618ec26aa362f88cee86d122/621875752d2cb190e1313643_00002.png"
                        loading="lazy"
                        width={32}
                        alt=""
                        className="image-7"
                      />
                      <div className="no-image w-condition-invisible">
                        <div>
                          No <br />
                          image{' '}
                        </div>
                      </div>
                      <div className="list-link">Fury</div>
                    </div>
                  </a>
                </div>
                <div role="listitem" className="w-dyn-item">
                  <a data-load-page="x" href="/item/steel" className="list-item collapse-sm w-inline-block">
                    <div className="div-block-19">
                      <img
                        src="https://assets.website-files.com/618ec26aa362f88cee86d122/62187579d1c53271d873fbe8_00001.png"
                        loading="lazy"
                        width={32}
                        alt=""
                        className="image-7"
                      />
                      <div className="no-image w-condition-invisible">
                        <div>
                          No <br />
                          image{' '}
                        </div>
                      </div>
                      <div className="list-link">Steel</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="itemtypesection">
            <h3 className="heading-2 itemtypetitle">Maces</h3>
            <div className="w-dyn-list">
              <div role="list" className="collection-list w-dyn-items">
                <div role="listitem" className="w-dyn-item">
                  <a data-load-page="x" href="/item/elder" className="list-item w-inline-block">
                    <div className="div-block-19">
                      <img
                        src="https://assets.website-files.com/618ec26aa362f88cee86d122/6218755d557d3e50131d44e5_00016.png"
                        loading="lazy"
                        width={32}
                        alt=""
                        className="image-7"
                      />
                      <div className="no-image w-condition-invisible">
                        <div>
                          No <br />
                          image{' '}
                        </div>
                      </div>
                      <div className="list-link">Elder</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="itemtypesection">
            <h3 className="heading-2 itemtypetitle">Staves</h3>
            <div className="w-dyn-list">
              <div role="list" className="collection-list w-dyn-items">
                <div role="listitem" className="w-dyn-item">
                  <a data-load-page="x" href="/item/destiny" className="list-item w-inline-block">
                    <div className="div-block-19">
                      <img
                        src="https://assets.website-files.com/618ec26aa362f88cee86d122/62187566f5711d0717cdf7c8_00013.png"
                        loading="lazy"
                        width={32}
                        alt=""
                        className="image-7"
                      />
                      <div className="no-image w-condition-invisible">
                        <div>
                          No <br />
                          image{' '}
                        </div>
                      </div>
                      <div className="list-link">Destiny</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="itemtypesection">
            <h3 className="heading-2 itemtypetitle">Hammers</h3>
            <div className="w-dyn-list">
              <div className="empty-state w-dyn-empty">
                <div>No items found.</div>
              </div>
            </div>
          </div>
          <div className="itemtypesection">
            <h3 className="heading-2 itemtypetitle">Scythes</h3>
            <div className="w-dyn-list">
              <div role="list" className="collection-list w-dyn-items">
                <div role="listitem" className="w-dyn-item">
                  <a data-load-page="x" href="/item/burial" className="list-item w-inline-block">
                    <div className="div-block-19">
                      <img
                        src="https://assets.website-files.com/618ec26aa362f88cee86d122/6218753d0221971659ee404b_00037.png"
                        loading="lazy"
                        width={32}
                        alt=""
                        className="image-7"
                      />
                      <div className="no-image w-condition-invisible">
                        <div>
                          No <br />
                          image{' '}
                        </div>
                      </div>
                      <div className="list-link">Burial</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div id="w-node-_183d8a63-9bf9-968d-0091-0ec6020e113d-3d100cc1" className="itemtypesection">
            <h3 className="heading-2 itemtypetitle">GreatSwords</h3>
            <div className="w-dyn-list">
              <div role="list" className="collection-list w-dyn-items">
                <div role="listitem" className="w-dyn-item">
                  <a data-load-page="x" href="/item/guiding-light" className="list-item w-inline-block">
                    <div className="div-block-19">
                      <img
                        src="https://assets.website-files.com/618ec26aa362f88cee86d122/6218755a46d58200f680aa8d_00021.png"
                        loading="lazy"
                        width={32}
                        alt=""
                        className="image-7"
                      />
                      <div className="no-image w-condition-invisible">
                        <div>
                          No <br />
                          image{' '}
                        </div>
                      </div>
                      <div className="list-link">Guiding Light</div>
                    </div>
                  </a>
                </div>
                <div role="listitem" className="w-dyn-item">
                  <a data-load-page="x" href="/item/glory" className="list-item w-inline-block">
                    <div className="div-block-19">
                      <img
                        src="https://assets.website-files.com/618ec26aa362f88cee86d122/621875709384e31bb42d1c70_00010.png"
                        loading="lazy"
                        width={32}
                        alt=""
                        className="image-7"
                      />
                      <div className="no-image w-condition-invisible">
                        <div>
                          No <br />
                          image{' '}
                        </div>
                      </div>
                      <div className="list-link">Glory</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="itemtypesection">
            <h3 className="heading-2 itemtypetitle">GreatAxes</h3>
            <div className="w-dyn-list">
              <div className="empty-state-3 w-dyn-empty">
                <div>No items found.</div>
              </div>
            </div>
          </div>
          <div id="w-node-bde60e1f-0335-b179-271c-7d40fcbd5f87-3d100cc1" className="itemtypesection">
            <h3 className="heading-2 itemtypetitle">Claws</h3>
            <div className="w-dyn-list">
              <div role="list" className="collection-list w-dyn-items">
                <div role="listitem" className="w-dyn-item">
                  <a data-load-page="x" href="/item/wrath" className="list-item w-inline-block">
                    <div className="div-block-19">
                      <img
                        src="https://assets.website-files.com/618ec26aa362f88cee86d122/62187563a16bd5318d9b2666_00014.png"
                        loading="lazy"
                        width={32}
                        alt=""
                        className="image-7"
                      />
                      <div className="no-image w-condition-invisible">
                        <div>
                          No <br />
                          image{' '}
                        </div>
                      </div>
                      <div className="list-link">Wrath</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="itemtypesection">
            <h3 className="heading-2 itemtypetitle">Daggers</h3>
            <div className="w-dyn-list">
              <div role="list" className="collection-list w-dyn-items">
                <div role="listitem" className="w-dyn-item">
                  <a data-load-page="x" href="/item/mercy" className="list-item w-inline-block">
                    <div className="div-block-19">
                      <img
                        src="https://assets.website-files.com/618ec26aa362f88cee86d122/621875400221975f69ee4068_00035.png"
                        loading="lazy"
                        width={32}
                        alt=""
                        className="image-7"
                      />
                      <div className="no-image w-condition-invisible">
                        <div>
                          No <br />
                          image{' '}
                        </div>
                      </div>
                      <div className="list-link">Mercy</div>
                    </div>
                  </a>
                </div>
                <div role="listitem" className="w-dyn-item">
                  <a data-load-page="x" href="/item/genesis" className="list-item w-inline-block">
                    <div className="div-block-19">
                      <img
                        src="https://assets.website-files.com/618ec26aa362f88cee86d122/62187569158ffe00c3e648b6_00012.png"
                        loading="lazy"
                        width={32}
                        alt=""
                        className="image-7"
                      />
                      <div className="no-image w-condition-invisible">
                        <div>
                          No <br />
                          image{' '}
                        </div>
                      </div>
                      <div className="list-link">Genesis</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div id="w-node-ae95eabd-f61b-3299-7f07-ec1b0e206ef4-3d100cc1" className="itemtypesection">
            <h3 className="heading-2 itemtypetitle">Shields</h3>
            <div className="w-dyn-list">
              <div role="list" className="collection-list w-dyn-items">
                <div role="listitem" className="w-dyn-item">
                  <a data-load-page="x" href="/item/fortress" className="list-item w-inline-block">
                    <div className="div-block-19">
                      <img
                        src="https://assets.website-files.com/618ec26aa362f88cee86d122/62187561c4c2521a274c0bc7_00015.png"
                        loading="lazy"
                        width={32}
                        alt=""
                        className="image-7"
                      />
                      <div className="no-image w-condition-invisible">
                        <div>
                          No <br />
                          image{' '}
                        </div>
                      </div>
                      <div className="list-link">Fortress</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="itemtypesection">
            <h3 className="heading-2 itemtypetitle">Helms</h3>
            <div className="w-dyn-list">
              <div role="list" className="collection-list w-dyn-items">
                <div role="listitem" className="w-dyn-item">
                  <a data-load-page="x" href="/item/pledge" className="list-item w-inline-block">
                    <div className="div-block-19">
                      <img
                        src="https://assets.website-files.com/618ec26aa362f88cee86d122/61bbce7a00e42208e57b37aa_00019.png"
                        loading="lazy"
                        width={32}
                        alt=""
                        className="image-7"
                      />
                      <div className="no-image w-condition-invisible">
                        <div>
                          No <br />
                          image{' '}
                        </div>
                      </div>
                      <div className="list-link">Pledge</div>
                    </div>
                  </a>
                </div>
                <div role="listitem" className="w-dyn-item">
                  <a data-load-page="x" href="/item/haze" className="list-item w-inline-block">
                    <div className="div-block-19">
                      <img
                        src="https://assets.website-files.com/618ec26aa362f88cee86d122/6218757c14ebc9fcacaf3ff9_00030.png"
                        loading="lazy"
                        width={32}
                        alt=""
                        className="image-7"
                      />
                      <div className="no-image w-condition-invisible">
                        <div>
                          No <br />
                          image{' '}
                        </div>
                      </div>
                      <div className="list-link">Haze</div>
                    </div>
                  </a>
                </div>
                <div role="listitem" className="w-dyn-item">
                  <a data-load-page="x" href="/item/lorekeeper" className="list-item w-inline-block">
                    <div className="div-block-19">
                      <img
                        src="https://assets.website-files.com/618ec26aa362f88cee86d122/61bbce5fa45352f3d8e5d899_00003.png"
                        loading="lazy"
                        width={32}
                        alt=""
                        className="image-7"
                      />
                      <div className="no-image w-condition-invisible">
                        <div>
                          No <br />
                          image{' '}
                        </div>
                      </div>
                      <div className="list-link">Lorekeeper</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="itemtypesection">
            <h3 className="heading-2 itemtypetitle">Body Armor</h3>
            <div className="w-dyn-list">
              <div role="list" className="collection-list w-dyn-items">
                <div role="listitem" className="w-dyn-item">
                  <a data-load-page="x" href="/item/hellfire" className="list-item w-inline-block">
                    <div className="div-block-19">
                      <img
                        src="https://assets.website-files.com/618ec26aa362f88cee86d122/6218754746a22175a2a7ed2f_00031.png"
                        loading="lazy"
                        width={32}
                        alt=""
                        className="image-7"
                      />
                      <div className="no-image w-condition-invisible">
                        <div>
                          No <br />
                          image{' '}
                        </div>
                      </div>
                      <div className="list-link">Hellfire</div>
                    </div>
                  </a>
                </div>
                <div role="listitem" className="w-dyn-item">
                  <a data-load-page="x" href="/item/blur" className="list-item w-inline-block">
                    <div className="div-block-19">
                      <img
                        src="https://assets.website-files.com/618ec26aa362f88cee86d122/621875430221978203ee407d_00034.png"
                        loading="lazy"
                        width={32}
                        alt=""
                        className="image-7"
                      />
                      <div className="no-image w-condition-invisible">
                        <div>
                          No <br />
                          image{' '}
                        </div>
                      </div>
                      <div className="list-link">Blur</div>
                    </div>
                  </a>
                </div>
                <div role="listitem" className="w-dyn-item">
                  <a data-load-page="x" href="/item/titan" className="list-item w-inline-block">
                    <div className="div-block-19">
                      <img
                        src="https://assets.website-files.com/618ec26aa362f88cee86d122/61bbce612b3fd178729699bb_00006.png"
                        loading="lazy"
                        width={32}
                        alt=""
                        className="image-7"
                      />
                      <div className="no-image w-condition-invisible">
                        <div>
                          No <br />
                          image{' '}
                        </div>
                      </div>
                      <div className="list-link">Titan</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="itemtypesection">
            <h3 className="heading-2 itemtypetitle">Bracers</h3>
            <div className="w-dyn-list">
              <div role="list" className="collection-list w-dyn-items">
                <div role="listitem" className="w-dyn-item">
                  <a data-load-page="x" href="/item/zeal" className="list-item w-inline-block">
                    <div className="div-block-19">
                      <img
                        src="https://assets.website-files.com/618ec26aa362f88cee86d122/6218758350fefdf2c0011db0_00024.png"
                        loading="lazy"
                        width={32}
                        alt=""
                        className="image-7"
                      />
                      <div className="no-image w-condition-invisible">
                        <div>
                          No <br />
                          image{' '}
                        </div>
                      </div>
                      <div className="list-link">Zeal</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="itemtypesection">
            <h3 className="heading-2 itemtypetitle">Gloves</h3>
            <div className="w-dyn-list">
              <div role="list" className="collection-list w-dyn-items">
                <div role="listitem" className="w-dyn-item">
                  <a data-load-page="x" href="/item/pressure" className="list-item w-inline-block">
                    <div className="div-block-19">
                      <img
                        src="https://assets.website-files.com/618ec26aa362f88cee86d122/62187586cbbc1f320aa14c4b_00023.png"
                        loading="lazy"
                        width={32}
                        alt=""
                        className="image-7"
                      />
                      <div className="no-image w-condition-invisible">
                        <div>
                          No <br />
                          image{' '}
                        </div>
                      </div>
                      <div className="list-link">Pressure</div>
                    </div>
                  </a>
                </div>
                <div role="listitem" className="w-dyn-item">
                  <a data-load-page="x" href="/item/smoke" className="list-item w-inline-block">
                    <div className="div-block-19">
                      <img
                        src="https://assets.website-files.com/618ec26aa362f88cee86d122/61bbce63b8797d8a2f15f87d_00007.png"
                        loading="lazy"
                        width={32}
                        alt=""
                        className="image-7"
                      />
                      <div className="no-image w-condition-invisible">
                        <div>
                          No <br />
                          image{' '}
                        </div>
                      </div>
                      <div className="list-link">Smoke</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="itemtypesection">
            <h3 className="heading-2 itemtypetitle">Belts</h3>
            <div className="w-dyn-list">
              <div role="list" className="collection-list w-dyn-items">
                <div role="listitem" className="w-dyn-item">
                  <a data-load-page="x" href="/item/balance" className="list-item w-inline-block">
                    <div className="div-block-19">
                      <img
                        src="https://assets.website-files.com/618ec26aa362f88cee86d122/6218757f14ebc98aa1af42a1_00025.png"
                        loading="lazy"
                        width={32}
                        alt=""
                        className="image-7"
                      />
                      <div className="no-image w-condition-invisible">
                        <div>
                          No <br />
                          image{' '}
                        </div>
                      </div>
                      <div className="list-link">Balance</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="itemtypesection">
            <h3 className="heading-2 itemtypetitle">Leggings</h3>
            <div className="w-dyn-list">
              <div role="list" className="collection-list w-dyn-items">
                <div role="listitem" className="w-dyn-item">
                  <a data-load-page="x" href="/item/flow" className="list-item w-inline-block">
                    <div className="div-block-19">
                      <img
                        src="https://assets.website-files.com/618ec26aa362f88cee86d122/61c159d0d02413e7ffd48671_Untitled-31.png"
                        loading="lazy"
                        width={32}
                        alt=""
                        sizes="32px"
                        srcSet="https://assets.website-files.com/618ec26aa362f88cee86d122/61c159d0d02413e7ffd48671_Untitled-31-p-500.png 500w, https://assets.website-files.com/618ec26aa362f88cee86d122/61c159d0d02413e7ffd48671_Untitled-31.png 512w"
                        className="image-7"
                      />
                      <div className="no-image w-condition-invisible">
                        <div>
                          No <br />
                          image{' '}
                        </div>
                      </div>
                      <div className="list-link">Flow</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="itemtypesection">
            <h3 className="heading-2 itemtypetitle">Boots</h3>
            <div className="w-dyn-list">
              <div role="list" className="collection-list w-dyn-items">
                <div role="listitem" className="w-dyn-item">
                  <a data-load-page="x" href="/item/flash" className="list-item w-inline-block">
                    <div className="div-block-19">
                      <img
                        src="https://assets.website-files.com/618ec26aa362f88cee86d122/61bbce661f100b692a37b7a6_00005.png"
                        loading="lazy"
                        width={32}
                        alt=""
                        className="image-7"
                      />
                      <div className="no-image w-condition-invisible">
                        <div>
                          No <br />
                          image{' '}
                        </div>
                      </div>
                      <div className="list-link">Flash</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="itemtypesection">
            <h3 className="heading-2 itemtypetitle">Rings</h3>
            <div className="w-dyn-list">
              <div role="list" className="collection-list w-dyn-items">
                <div role="listitem" className="w-dyn-item">
                  <a data-load-page="x" href="/item/animus" className="list-item w-inline-block">
                    <div className="div-block-19">
                      <img
                        src="https://assets.website-files.com/618ec26aa362f88cee86d122/6218753b158ffe9fe1e64759_00112.png"
                        loading="lazy"
                        width={32}
                        alt=""
                        className="image-7"
                      />
                      <div className="no-image w-condition-invisible">
                        <div>
                          No <br />
                          image{' '}
                        </div>
                      </div>
                      <div className="list-link">Animus</div>
                    </div>
                  </a>
                </div>
                <div role="listitem" className="w-dyn-item">
                  <a data-load-page="x" href="/item/instinct" className="list-item w-inline-block">
                    <div className="div-block-19">
                      <img
                        src="https://assets.website-files.com/618ec26aa362f88cee86d122/61bbce7f2b3fd16b0396a7c3_00027.png"
                        loading="lazy"
                        width={32}
                        alt=""
                        className="image-7"
                      />
                      <div className="no-image w-condition-invisible">
                        <div>
                          No <br />
                          image{' '}
                        </div>
                      </div>
                      <div className="list-link">Instinct</div>
                    </div>
                  </a>
                </div>
                <div role="listitem" className="w-dyn-item">
                  <a data-load-page="x" href="/item/eternity" className="list-item w-inline-block">
                    <div className="div-block-19">
                      <img
                        src="https://assets.website-files.com/618ec26aa362f88cee86d122/61bbce6ba1dc2900f8d6970e_00026.png"
                        loading="lazy"
                        width={32}
                        alt=""
                        className="image-7"
                      />
                      <div className="no-image w-condition-invisible">
                        <div>
                          No <br />
                          image{' '}
                        </div>
                      </div>
                      <div className="list-link">Eternity</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="itemtypesection">
            <h3 className="heading-2 itemtypetitle">Amulets</h3>
            <div className="w-dyn-list">
              <div role="list" className="collection-list w-dyn-items">
                <div role="listitem" className="w-dyn-item">
                  <a data-load-page="x" href="/item/beacon" className="list-item w-inline-block">
                    <div className="div-block-19">
                      <img
                        src="https://assets.website-files.com/618ec26aa362f88cee86d122/61bbce7c36a9171421447e97_00028.png"
                        loading="lazy"
                        width={32}
                        alt=""
                        className="image-7"
                      />
                      <div className="no-image w-condition-invisible">
                        <div>
                          No <br />
                          image{' '}
                        </div>
                      </div>
                      <div className="list-link">Beacon</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="itemtypesection">
            <h3 className="heading-2 itemtypetitle">Trinkets</h3>
            <div className="w-dyn-list">
              <div className="empty-state-7 w-dyn-empty">
                <div>No items found.</div>
              </div>
            </div>
          </div>
        </div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <div className="container hide-overflow w-container">
          <Flex flexDirection="column" alignItems="center" justifyContent="center">
            <div className="locationheader">
              <div className="locationheaderbg" />
              <h1 className="locationtitle">Rewarded Items</h1>
            </div>
          </Flex>
          <div className="locationdescription w-richtext">
            <p>These are items that are rewarded for playing our games.</p>
            <p>‍</p>
            <p>Trinkets - Rune&nbsp;Evolution</p>
            <p>Guardian Eggs - Rune&nbsp;Evolution</p>
            <p>Rune Tokens - Rune&nbsp;Evolution</p>
          </div>
        </div>
        <div className="div-block-24 frame padding-adjust">
          <div className="itemtypesection">
            <h3 className="heading-2 itemtypetitle">Evolution</h3>
            <div className="w-dyn-list">
              <div role="list" className="collection-list w-dyn-items">
                <div role="listitem" className="w-dyn-item">
                  <a data-load-page="x" href="/item/black-drake-scale" className="list-item collapse-sm w-inline-block">
                    <div className="div-block-19">
                      <img
                        src="https://assets.website-files.com/618ec26aa362f88cee86d122/622c22aacacb45c99a6f91f5_01207.png"
                        loading="lazy"
                        width={32}
                        alt=""
                        className="image-7"
                      />
                      <div className="no-image w-condition-invisible">
                        <div>
                          No <br />
                          image{' '}
                        </div>
                      </div>
                      <div className="list-link">Black Drake Scale</div>
                    </div>
                  </a>
                </div>
                <div role="listitem" className="w-dyn-item">
                  <a data-load-page="x" href="/item/black-drake-talon" className="list-item collapse-sm w-inline-block">
                    <div className="div-block-19">
                      <img
                        src="https://assets.website-files.com/618ec26aa362f88cee86d122/622c22abf89c3a40adb547cb_01208.png"
                        loading="lazy"
                        width={32}
                        alt=""
                        className="image-7"
                      />
                      <div className="no-image w-condition-invisible">
                        <div>
                          No <br />
                          image{' '}
                        </div>
                      </div>
                      <div className="list-link">Black Drake Talon</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="itemtypesection">
            <h3 className="heading-2 itemtypetitle">Infinite</h3>
            <div className="w-dyn-list">
              <div className="empty-state-11 w-dyn-empty">
                <div>No items found.</div>
              </div>
            </div>
          </div>
          <div className="itemtypesection">
            <h3 className="heading-2 itemtypetitle">Sanctuary</h3>
            <div className="w-dyn-list">
              <div className="empty-state-11 w-dyn-empty">
                <div>No items found.</div>
              </div>
            </div>
          </div>
          <div className="itemtypesection">
            <h3 className="heading-2 itemtypetitle">Other</h3>
          </div>
        </div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <div>
          <div className="container hide-overflow w-container">
            <Flex flexDirection="column" alignItems="center" justifyContent="center">
              <div className="locationheader">
                <div className="locationheaderbg" />
                <h1 className="locationtitle">Airdropped Items</h1>
              </div>
            </Flex>
            <div className="locationdescription w-richtext">
              <p>There have been many airdrops in the history of Rune, and no end in sight.</p>
              <p>‍</p>
              <p>Dragonlight Amulet - CoinMarketCap</p>
              <p>Luminous Flywings - CoinMarketCap</p>
              <p>$RXS - Sunday Quiz, Haiku&nbsp;Contest, etc.</p>
            </div>
          </div>
          <div className="div-block-24 frame padding-adjust">
            <div className="itemtypesection">
              <h3 className="heading-2 itemtypetitle">CoinMarketCap</h3>
              <div className="w-dyn-list">
                <div role="list" className="collection-list w-dyn-items">
                  <div role="listitem" className="w-dyn-item">
                    <a data-load-page="x" href="/item/dragonlight" className="list-item collapse-sm w-inline-block">
                      <div className="div-block-19">
                        <img
                          src="https://assets.website-files.com/618ec26aa362f88cee86d122/6219aa36bc0e2e00d1cd0d16_00029.png"
                          loading="lazy"
                          width={32}
                          alt=""
                          className="image-7"
                        />
                        <div className="no-image w-condition-invisible">
                          <div>
                            No <br />
                            image{' '}
                          </div>
                        </div>
                        <div className="list-link">Dragonlight</div>
                      </div>
                    </a>
                  </div>
                  <div role="listitem" className="w-dyn-item">
                    <a
                      data-load-page="x"
                      href="/item/luminous-flywings"
                      className="list-item collapse-sm w-inline-block">
                      <div className="div-block-19">
                        <img
                          src="https://assets.website-files.com/618ec26aa362f88cee86d122/621875482b817edd559b7bf6_00032.png"
                          loading="lazy"
                          width={32}
                          alt=""
                          className="image-7"
                        />
                        <div className="no-image w-condition-invisible">
                          <div>
                            No <br />
                            image{' '}
                          </div>
                        </div>
                        <div className="list-link">Luminous Flywings</div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="itemtypesection">
              <h3 className="heading-2 itemtypetitle">Other</h3>
            </div>
          </div>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <div className="container hide-overflow w-container">
            <Flex flexDirection="column" alignItems="center" justifyContent="center">
              <div className="locationheader">
                <div className="locationheaderbg" />
                <h1 className="locationtitle">Fundraiser Items</h1>
              </div>
            </Flex>
            <div className="locationdescription w-richtext">
              <p>
                These are items that are purchased on the Arken Market, where all funds are used to go towards marketing
                and/or development.
              </p>
              <p>‍</p>
              <p>So far the only fundraiser items we've had are the Limited Edition Pets and Founder Cubes. </p>
              <ul role="list">
                <li>
                  Battle Pets - There was 5 pets with 4 rarities each (20 total). Each pet has attributes and a unique
                  skill only available with this pet.
                </li>
                <li>
                  Founder Cubes - There is a max of 1000 cubes. Each comes with benefits:&nbsp;Heart of the Oasis
                  Collector's Edition, Early Access to Arken games, Access to Founder's Tavern in the End of Time, Every
                  Rune in Heart of the Oasis (1 EL-ZOD), Golden Cube Skin - Angel Skin + Wings, Discord Badge + Private
                  Channel, Exclusive T-shirt
                </li>
              </ul>
              <p>‍</p>
              <p>In the future we plan to have fundraisers for:</p>
              <ul role="list">
                <li>
                  Homage NFTs - 50 items with 4 rarities each (200 total). These items will be inspired by,&nbsp;and in
                  the style of, Diablo 2.
                </li>
                <li>
                  NPC NFTs- 5 NPCs per act (30 total). These will grant you the power to become the NPC, receiving a
                  percentage of the in-game currency when Heart of the Oasis releases.
                </li>
                <li>
                  Land Title NFTs - TBD. Land titles will give you an open area to build your own city, arena, or even a
                  modded story arc within Heart of the Oasis (limitations).
                </li>
                <li>
                  Guild Token NFTs- TBD. Guild tokens will give you the ability to form your own guilds, each token
                  having randomly generated pros/cons.
                </li>
                <li>
                  DLC NFTs - TBD. DLC&nbsp;items will allow you to unlock specific areas or arcs within Arken: Heart of
                  the Oasis, that could otherwise be difficult to unlock during gameplay.{' '}
                </li>
              </ul>
            </div>
          </div>
          <div className="div-block-24 frame padding-adjust">
            <div className="itemtypesection">
              <h3 className="heading-2 itemtypetitle">Battle Pets</h3>
              <div className="w-dyn-list">
                <div role="list" className="collection-list w-dyn-items">
                  <div role="listitem" className="w-dyn-item">
                    <a
                      data-load-page="x"
                      href="/item/red-eyes-black-drake"
                      className="list-item collapse-sm w-inline-block">
                      <div className="div-block-19">
                        <img
                          src="https://assets.website-files.com/618ec26aa362f88cee86d122/6218758e14ebc997c8af4a28_03002.png"
                          loading="lazy"
                          width={32}
                          alt=""
                          className="image-7"
                        />
                        <div className="no-image w-condition-invisible">
                          <div>
                            No <br />
                            image{' '}
                          </div>
                        </div>
                        <div className="list-link">Red-Eyes Black Drake</div>
                      </div>
                    </a>
                  </div>
                  <div role="listitem" className="w-dyn-item">
                    <a
                      data-load-page="x"
                      href="/item/blue-eyes-white-drake"
                      className="list-item collapse-sm w-inline-block">
                      <div className="div-block-19">
                        <img
                          src="https://assets.website-files.com/618ec26aa362f88cee86d122/6218758d7015a31e56e21d2a_03001.png"
                          loading="lazy"
                          width={32}
                          alt=""
                          className="image-7"
                        />
                        <div className="no-image w-condition-invisible">
                          <div>
                            No <br />
                            image{' '}
                          </div>
                        </div>
                        <div className="list-link">Blue-Eyes White Drake</div>
                      </div>
                    </a>
                  </div>
                  <div role="listitem" className="w-dyn-item">
                    <a data-load-page="x" href="/item/golden-lion-cub" className="list-item collapse-sm w-inline-block">
                      <div className="div-block-19">
                        <img
                          src="https://assets.website-files.com/618ec26aa362f88cee86d122/621875897b5d616f31e96690_03000.png"
                          loading="lazy"
                          width={32}
                          alt=""
                          className="image-7"
                        />
                        <div className="no-image w-condition-invisible">
                          <div>
                            No <br />
                            image{' '}
                          </div>
                        </div>
                        <div className="list-link">Golden Lion Cub</div>
                      </div>
                    </a>
                  </div>
                  <div role="listitem" className="w-dyn-item">
                    <a data-load-page="x" href="/item/forest-turtle" className="list-item collapse-sm w-inline-block">
                      <div className="div-block-19">
                        <img
                          src="https://assets.website-files.com/618ec26aa362f88cee86d122/621878545d9a59822dd5366a_03007.png"
                          loading="lazy"
                          width={32}
                          alt=""
                          className="image-7"
                        />
                        <div className="no-image w-condition-invisible">
                          <div>
                            No <br />
                            image{' '}
                          </div>
                        </div>
                        <div className="list-link">Forest Turtle</div>
                      </div>
                    </a>
                  </div>
                  <div role="listitem" className="w-dyn-item">
                    <a data-load-page="x" href="/item/skeleton-drake" className="list-item collapse-sm w-inline-block">
                      <div className="div-block-19">
                        <img
                          src="https://assets.website-files.com/618ec26aa362f88cee86d122/621878532d2cb1124e32f0ea_03008.png"
                          loading="lazy"
                          width={32}
                          alt=""
                          className="image-7"
                        />
                        <div className="no-image w-condition-invisible">
                          <div>
                            No <br />
                            image{' '}
                          </div>
                        </div>
                        <div className="list-link">Skeleton Drake</div>
                      </div>
                    </a>
                  </div>
                  <div role="listitem" className="w-dyn-item">
                    <a data-load-page="x" href="/item/wyvern" className="list-item collapse-sm w-inline-block">
                      <div className="div-block-19">
                        <img
                          src="https://assets.website-files.com/618ec26aa362f88cee86d122/62187851d9e86a56191d6caa_03006.png"
                          loading="lazy"
                          width={32}
                          alt=""
                          className="image-7"
                        />
                        <div className="no-image w-condition-invisible">
                          <div>
                            No <br />
                            image{' '}
                          </div>
                        </div>
                        <div className="list-link">Wyvern</div>
                      </div>
                    </a>
                  </div>
                  <div role="listitem" className="w-dyn-item">
                    <a data-load-page="x" href="/item/hippogryph" className="list-item collapse-sm w-inline-block">
                      <div className="div-block-19">
                        <img
                          src="https://assets.website-files.com/618ec26aa362f88cee86d122/6218784fa16bd5c53f9d92c1_03005.png"
                          loading="lazy"
                          width={32}
                          alt=""
                          className="image-7"
                        />
                        <div className="no-image w-condition-invisible">
                          <div>
                            No <br />
                            image{' '}
                          </div>
                        </div>
                        <div className="list-link">Hippogryph</div>
                      </div>
                    </a>
                  </div>
                  <div role="listitem" className="w-dyn-item">
                    <a data-load-page="x" href="/item/fairy-drake" className="list-item collapse-sm w-inline-block">
                      <div className="div-block-19">
                        <img
                          src="https://assets.website-files.com/618ec26aa362f88cee86d122/6218784d167b820604397181_03003.png"
                          loading="lazy"
                          width={32}
                          alt=""
                          className="image-7"
                        />
                        <div className="no-image w-condition-invisible">
                          <div>
                            No <br />
                            image{' '}
                          </div>
                        </div>
                        <div className="list-link">Fairy Drake</div>
                      </div>
                    </a>
                  </div>
                  <div role="listitem" className="w-dyn-item">
                    <a data-load-page="x" href="/item/goblin-drake" className="list-item collapse-sm w-inline-block">
                      <div className="div-block-19">
                        <img
                          src="https://assets.website-files.com/618ec26aa362f88cee86d122/6218784b46d5827cdf830fdd_03004.png"
                          loading="lazy"
                          width={32}
                          alt=""
                          className="image-7"
                        />
                        <div className="no-image w-condition-invisible">
                          <div>
                            No <br />
                            image{' '}
                          </div>
                        </div>
                        <div className="list-link">Goblin Drake</div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="itemtypesection">
              <h3 className="heading-2 itemtypetitle">Founder Cubes</h3>
              <div className="w-dyn-list">
                <div className="empty-state-11 w-dyn-empty">
                  <div>No items found.</div>
                </div>
              </div>
            </div>
            <div className="itemtypesection">
              <h3 className="heading-2 itemtypetitle">Land</h3>
              <div className="w-dyn-list">
                <div className="empty-state-11 w-dyn-empty">
                  <div>No items found.</div>
                </div>
              </div>
            </div>
            <div className="itemtypesection">
              <h3 className="heading-2 itemtypetitle">NPC</h3>
              <div className="w-dyn-list">
                <div className="empty-state-11 w-dyn-empty">
                  <div>No items found.</div>
                </div>
              </div>
            </div>
            <div className="itemtypesection">
              <h3 className="heading-2 itemtypetitle">Homage</h3>
              <div className="w-dyn-list">
                <div className="empty-state-11 w-dyn-empty">
                  <div>No items found.</div>
                </div>
              </div>
            </div>
            <div className="itemtypesection">
              <h3 className="heading-2 itemtypetitle">Guild Token</h3>
              <div className="w-dyn-list">
                <div className="empty-state-11 w-dyn-empty">
                  <div>No items found.</div>
                </div>
              </div>
            </div>
            <div className="itemtypesection">
              <h3 className="heading-2 itemtypetitle">DLC</h3>
              <div className="w-dyn-list">
                <div className="empty-state-11 w-dyn-empty">
                  <div>No items found.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Items;
