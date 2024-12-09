import React, { useState } from 'react';
import { Flex, Card, Card3 } from '~/ui';

const Runeforms = function () {
  return (
    <Card3 style={{ marginTop: 10 }}>
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
          <Flex flexDirection="column" alignItems="center" justifyContent="center">
            <div className="locationheader">
              <div className="locationheaderbg" />
              <h1 className="locationtitle">Runeforms</h1>
            </div>
          </Flex>
          <div className="locationdescription w-richtext">
            <p>
              <strong>Runeforms</strong> are unique weapons and armor used to equip your hero. Each{' '}
              <strong>Runeform</strong> is different, with varying attributes suitable for a specific hero class or
              style of play. Equip your hero with <strong>Runeforms</strong> to make them powerful in battle, increase
              magic find, or improve farming and merchant abilities. <strong>Runeforms</strong> can be used between
              games in the Arken ecosystem, collected, shared, and traded in the{' '}
              <a href="https://arken.gg/market">
                <strong>Arken Market</strong>
              </a>
              . Soon you'll be able to lend your <strong>Runeforms</strong> to <strong>guild</strong> members or through
              the Market.
            </p>
            <p>‍</p>
            <p>
              To create a <strong>Runeform</strong>, you must <strong>craft</strong> them from a combination of small
              magical stones called <strong>runes</strong>. <strong>Runes</strong> can be collected as rewards in games,
              competing with other players, <strong>raiding</strong> farms, purchasing through the market, airdrops,
              boss battles, and other mechanics.{' '}
            </p>
            <p>‍</p>
            <p>
              To craft a <strong>Runeform</strong> you need to know the <strong>Runeform</strong> recipe, which is a
              specific combination of <strong>runes</strong>, used to mint the <strong>Runeform</strong>. Some{' '}
              <strong>recipes</strong> are <a href="https://arken.gg/craft">known</a>, some are secret. Once you know
              the <strong>recipe</strong> of a <strong>Runeform</strong> you need at least one of each{' '}
              <strong>rune</strong> required for crafting that <strong>Runeform</strong>. When you are ready to craft
              visit the{' '}
              <a href="https://arken.gg/transmute">
                <strong>Crafting Cube</strong>
              </a>{' '}
              and convert your <strong>runes</strong> into a <strong>Runeform</strong>.{' '}
            </p>
            <p>‍</p>
            <p>
              For example, to craft a <strong>Genesis Runeform</strong>, you need one of each <strong>SOLO</strong> +
              <strong>THAL</strong> +<strong>ASH</strong> +<strong>ORE</strong> in that order.
            </p>
            <p>‍</p>
            <p>
              <strong>Rolling / Min-maxing</strong>
            </p>
            <ul role="list">
              <li>
                <strong>Runeforms</strong> have a list of attributes, with random ranges.
              </li>
              <li>
                For example, Alice might roll +10% farm bonus when crafting STEEL, but Bob only crafted +5% farm bonus.
                Poor Bob.
              </li>
              <li>
                <strong>Runeforms</strong> in <strong>Runic Raids</strong> have farming related attributes. The same{' '}
                <strong>Runeform</strong> would have battle related attributes in <strong>Infinite Arena</strong> or{' '}
                <strong>Heart of the Oasis</strong>.
              </li>
              <li>
                You will get different attributes every time you craft a <strong>Runeform</strong>, making every{' '}
                <strong>Runeform</strong> unique and entirely different from the next.{' '}
              </li>
            </ul>
            <p>‍</p>
            <p>
              <strong>Disenchanting</strong>
            </p>
            <p>
              We all love crafting a Mythic, but in their quest for one some of our raiders have found themselves with
              quite the collection of weapons and armor that are just collecting dust, so what to do with them? Well,
              here at Rune we usually like to see things burn, but as those Runeforms are all rather special, the fire
              didn’t seem quite appropriate this time. So instead, we’ll just take them apart. The smart contracts have
              been written and tested, so once the stars align they shall activate. <br />
            </p>
            <p>
              Within them, they tell a tale of mystical disenchanting powers that turn Runeforms back into runes. But
              rather than the runes used to craft the Runeform, you’ll receive LENI runes instead. As this process
              requires some degree of sorcery, items of a higher perfection will yield more LENI runes than more common
              ones. LENI runes can then be used to upgrade your other items, or for crafting more Runeforms.
            </p>
            <p>‍</p>
            <p>
              <strong>Example Runeforms</strong>
            </p>
            <figure className="w-richtext-align-center w-richtext-figure-type-image">
              <div>
                <img src="/images/Screen%20Shot%202021-07-21%20at%2011.49.01%20AM.png" loading="lazy" alt="" />
              </div>
            </figure>
            <figure className="w-richtext-align-center w-richtext-figure-type-image">
              <div>
                <img src="/images/Screen%20Shot%202021-07-21%20at%2011.49.17%20AM.png" loading="lazy" alt="" />
              </div>
            </figure>
            <p>‍</p>
            <p>‍</p>
            <p>‍</p>
          </div>
          <div className="w-layout-grid page-layout">
            <article className="section-left">
              <div className="boxframe-1 hmax original-1">
                <div className="character-details-content">
                  <div className="blocktitle-sm">
                    <strong>Randomly Generated Pets</strong>
                  </div>
                  <div className="character-details-block no-bb">
                    <div className="class-perk">
                      <div className="class-perk-name-2">
                        <strong className="bold-text">
                          These NFT pets will be generated with random appearances and stats. The combinations are
                          nearly endless, with over 1 trillion possible variations. <br />
                          <br />
                          Guardians Unleashed will be build into our unique Rune protocol, which generates the
                          attributes of each NFT&nbsp;directly into the token ID, for further portability between chains
                          and games. <br />
                          <br />
                          Estimated launch for Guardians Unleashed is Q4, 2022 <br />
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-embed">
                  <style
                    dangerouslySetInnerHTML={{
                      __html:
                        '\n                .boxframe-1 {\n                  border-width: 1px;\n                  border-style: solid;\n                  border-color: transparent;\n                  border-image: url(/images/frame.png) 80 / 80px / 0 repeat;\n                  background-color: rgba(0, 0, 0, 0.4);\n                  border-radius: 0px;\n                }\n              ',
                    }}
                  />
                </div>
              </div>
            </article>
            <article className="section-right">
              <div className="boxframe-1 hmax">
                <div className="character-details-content">
                  <div className="blocktitle-sm">Transmuting</div>
                  <div className="character-details-block no-bb">
                    <div className="class-perk">
                      <div className="class-perk-name-2">
                        <strong className="bold-text">
                          After you are happy with your roll in the Crafting Cube you might want to upgrade it even more
                          by crafting it with a Worldstone Shard. This is also known as "slamming". <br />
                          <br />
                          You are sending your item through time and space by putting the Worldstone Shard and the
                          Runeform in the Cube once again and transmuting them, where it comes back to you in a
                          different form. <br />
                          <br />
                          This new item could be stronger, weaker, or even fractured. <br />
                          <br />
                          Fractured items cannot be Cubed again.{' '}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </main>
    </Card3>
  );
};

export default Runeforms;
