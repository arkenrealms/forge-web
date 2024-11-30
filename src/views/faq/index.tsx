import React, { useEffect, useRef, useState, useContext } from 'react';
import styled from 'styled-components';
import { Link as RouterLink, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Tag, Flex, Card, Heading, CardBody, Link, BaseLayout, OpenNewIcon } from '~/ui';
import { Modal, useModal, InjectedModalProps } from '~/components/Modal';
import Page from '~/components/layout/Page';
import { PurchaseModal } from '~/components/PurchaseModal';
import PageWindow from '~/components/PageWindow';
import i18n from '~/config/i18n';

const Text = styled.div``;

const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;
  grid-gap: 75px;

  & > div {
    grid-column: span 4;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 12;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 4;
    }
  }
`;

const Header = styled.div`
  min-height: 28px;
  width: 100%;
  font-weight: bold;
  font-size: 18px;
  text-align: center;
  padding: 10px;
`;

const InfoBlock = styled.div`
  // padding: 24px;
  margin-top: 20px;
  text-align: left;
  font-size: 0.9rem;
`;

const HeaderTag = styled.div`
  margin-top: 10px;
  width: 100%;
`;

const Tag2 = styled(Tag)`
  zoom: 0.7;
`;

const MainCard = styled(Card)`
  position: relative;
  font-weight: bold;
  border-width: 15px;
  border-style: solid;
  border-color: transparent;
  border-image: url('/images/frame.png') 80 repeat;
  border-image-width: 80px;
  background-color: rgba(0, 0, 0, 0.4);
  background-image: none;
  padding: 0 10px;
  // transform: scale(0.8);
  text-shadow: 1px 1px 1px black;
  // box-shadow: 0 2px 0 0 rgb(0 0 0 / 80%), inset 0 -1px 0 0 rgb(0 0 0 / 10%), 0 0 66px 66px rgb(0 0 0 / 10%);
  text-align: center;
  color: #bb955e;
  text-shadow: 1px 1px 1px black;
  font-weight: bold;
`;

const Image = styled.img`
  border-radius: 7px;
`;

const ImageBlock = ({ url }) => <Image src={url} />;

const BottomMenu = styled.div`
  position: absolute;
  bottom: 10px;
  left: 0;
  width: 100%;
  text-align: center;
`;

const Rules = () => {
  const { t } = useTranslation();
  const [showVision, setShowVision] = useState(false);
  const [onPresentPurchaseModal] = useModal(<PurchaseModal onSuccess={() => {}} />);

  return (
    <Page>
      <Card style={{ width: '100%', display: 'none' }}>
        <Heading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
          {t('FAQ')}
        </Heading>
        <hr />
        <CardBody>
          <p>‍</p>
          <p>
            <strong>Q. When did the token go live?</strong>
          </p>
          <p>The token went live on Binance Smart Chain (BSC) on March 30th 2021 at 21:15 UTC</p>
          <p>‍</p>
          <p>
            <strong>Q. Max supply?</strong>
          </p>
          <p>
            <strong>$RUNE</strong> is the old protocol token, and has a max supply of 22,529.999999. Burned: 3,230.
            Total circulating supply: 19,300. Originally 10,000 were minted, and the remaining 12,529.999999 were
            farmed. The farm was closed and <strong>$RUNE</strong> ownership was renounced, and is{' '}
            <a href="https://bscscan.com/address/0xaa3c49605e1b05aa70aaadd1aabc11d887e96b98#code">owned by the Void</a>,
            a contract which can only set the transfer fees (hardcoded to 1.2% max).
          </p>
          <p>‍</p>
          <p>
            <strong>$RXS</strong> is the new protocol token, and has a max supply of 192,999,312.886826. Burned:
            1,000,000. The RXS contract itself allows you to exchange 1 $RUNE for 10,000 $RXS. More than 60%&nbsp;has
            been converted. <strong>$RUNE</strong>&nbsp;is burned in the process. This means that there can only be
            RXS&nbsp;or RUNE&nbsp;available at once time, so there is no chance of inflation.
          </p>
          <p>‍</p>
          <p>‍</p>
          <p>
            <strong>Q. Why $RXS?</strong>
          </p>
          <p>There were a few major issues we looked to solve when switching to $RXS.</p>
          <p>
            1)&nbsp;We were often getting confused with Thorchain on tracking services like CoinMarketCap and CoinGecko.
            It was also a topic that came up from time to time, that Thorchain would always steal our token symbol on
            other exchanges, making listing and trading inhibitive.
          </p>
          <p>
            2)&nbsp;Low supply was nice in the beginning, but the price became difficult to manage when we got closer to
            $500, it started sounding expensive even though the market cap was relatively much lower than competitors
            (who have less product than us).
          </p>
          <p>
            3)&nbsp;We wanted something that would be cleaner to write while trading, and 0.01 RXS is a bit clearer than
            0.000001 RUNE
          </p>
          <p>‍</p>
          <p>
            <strong>Q. Fair launch?</strong>
          </p>
          <p>
            10,000 <strong>$RUNE</strong> minted:{' '}
            <a href="https://bscscan.com/token/0xa9776b590bfc2f956711b3419910a5ec1f63153e">
              https://bscscan.com/token/0xa9776b590bfc2f956711b3419910a5ec1f63153e
            </a>
            ​
          </p>
          <p>
            9,210.28 exchanged for 525.65 LPs{' '}
            <a href="https://bscscan.com/tx/0x992c0dd735bea17030f97240b8e53e6f3858ecfb84f9a38a72d75158625b0bfb">
              https://bscscan.com/tx/0x992c0dd735bea17030f97240b8e53e6f3858ecfb84f9a38a72d75158625b0bfb
            </a>{' '}
            525.65 LPs locked for 5 years:{' '}
            <a href="https://bscscan.com/tx/0xfc05fe95a93798613dacb4b87ef170f957f54e5e67c2cf5e78c548fe11f27dd2">
              https://bscscan.com/tx/0xfc05fe95a93798613dacb4b87ef170f957f54e5e67c2cf5e78c548fe11f27dd2
            </a>
            ​
          </p>
          <p>
            789.72 burned: <a href="https://t.me/Arken_En/1645">https://t.me/</a>​
            <a href="https://t.me/Arken_En/1645">Rune_EN/1645</a>​
          </p>
          <p>‍</p>
          <p>
            <strong>Q. Is the initial liquidity locked? </strong>
          </p>
          <p>
            The liquidity is locked for five years using DxLock. TX:{' '}
            <a href="https://bscscan.com/tx/0xfc05fe95a93798613dacb4b87ef170f957f54e5e67c2cf5e78c548fe11f27dd2">
              https://bscscan.com/tx/0xfc05fe95a93798613dacb4b87ef170f957f54e5e67c2cf5e78c548fe11f27dd2
            </a>
            ​
          </p>
          <p>
            LP contract:{' '}
            <a href="https://bscscan.com/token/0xf9444c39bbdcc3673033609204f8da00d1ae3f52">
              https://bscscan.com/token/0xf9444c39bbdcc3673033609204f8da00d1ae3f52
            </a>
            ​
          </p>
          <figure className="w-richtext-align-center w-richtext-figure-type-image">
            <div>
              <img
                style={{ maxWidth: 800 }}
                alt=""
                src="/images/620b23fb862a2b29fdfdebab_assets%252F-MUzrC4vIgWJmnwrmXrZ%252F-MX4HP7pvcGF4yIpbNCz%252F-MX4HTpXLOKzHxlqlSgI%252Fimage.png"
              />
            </div>
          </figure>
          <p>‍</p>
          <p>
            <strong>Q. What about the migrator code and timelock?</strong>
          </p>
          <p>
            No migrator function. There is a timelock on the $RXS contract, which is only for changing fees. Please see{' '}
            <a href="https://github.arken.gg/contracts/blob/master/src/RuneShards.sol">Github</a>.
          </p>
          <p>‍</p>
          <p>
            <strong>Q. Why Binance Smart Chain (BSC)?</strong>
          </p>
          <p>
            We initially launched on BSC due to the high gas fees on the Ethereum network. However, the Arken ecosystem
            is blockchain-agnostic. We are currently building a bridge to Polygon, with additional crosschain support
            coming.
          </p>
          <p>‍</p>
          <p>
            <strong>Q. Flashloan attacks?</strong>
          </p>
          <p>
            <strong>Rune</strong> cannot be flashloan attacked by any known method.
          </p>
          <p>
            1) We do not do funny calculations in our token contracts, like reflection or magic AMM pricing
            calculations.2) We do not use outside sources for prices.3) We do not depend upon other contracts or use
            other contracts for live calculations.4) We used 100% standard Masterchef calculations.5) We do not pair our
            liquidity with partners like most farms do, because if a partner is attacked then the attacker can exit
            through us.
          </p>
          <p>
            Rune was designed to be an isolated safe haven, with each token built within this ecosystem. If we take a
            risk with using a new mechanic, it would be with a new <strong>rune</strong>, which is a small part of the
            entire ecosystem (there is the <strong>$RXS</strong> protocol token, 33 BEP20 <strong>runes</strong>,
            thousands of NFTs, etc). That way we reduce our risk, but also have a playground to innovate.
          </p>
          <p>‍</p>
          <p>
            <strong>Q. Slippage?</strong>
          </p>
          <p>
            It depends on the current fee. If trading 2 <strong>runes</strong> then 2.2% or up to 3%. If trading 1{' '}
            <strong>rune</strong> and BNB/BUSD then 1.2%. For simplicity try 10%, but be aware you may get frontrun.
          </p>
          <p>Make sure to use round numbers.</p>
          <p>‍</p>
          <p>
            <strong>Q. I'm having trouble on mobile or hardware wallet.</strong>
          </p>
          <p>
            Try restarting your mobile app, check that you are connected to the BSC network, check you have some BNB,
            check it's the right wallet. Ledger is having trouble with the character creation process, and we're looking
            into it. Join our <a href="https://discord.arken.gg">Discord</a> for support-related queries.
          </p>
          <p>‍</p>
          <p>
            <strong>Q. What is the inventory page?</strong>
          </p>
          <p>
            The inventory page is where you can easily manage the <strong>runes</strong> and <strong>Runeforms</strong>{' '}
            (NFTs) in your account
          </p>
          <p>‍</p>
          <p>
            <strong>Q. What are characters used for?</strong>
          </p>
          <p>
            Choose a hero from one of 7 classes. Each class has unique skills and weapons. You equip your hero with
            powerful weapons and armor and take them into battle against other players, guilds, and AI.
          </p>
          <p>‍</p>
          <p>
            <strong>Q. What are guilds for?</strong>
          </p>
          <p>
            <strong>Guilds</strong> are for playing games with your friends or with new friends. Soon, anybody can
            create their own <strong>guild</strong> with their friends or people of shared values.{' '}
            <strong>The First Order</strong> is the first <strong>guild</strong>, the early adopters who will receive
            airdrop bonuses later this year. <strong>Guilds</strong> will have their own treasuries and vaults and
            members will be able to share items and rewards with other guild members.
          </p>
          <p>‍</p>
          <p>
            <strong>Q. Can I apply for the team?</strong>
          </p>
          <p>
            If you love what we're doing and want to be a part of it, join our{' '}
            <a href="https://discord.arken.gg">Discord</a> to get involved.
          </p>
          <p>‍</p>
          <p>
            <strong>Q. Will there be any rewards for early believers in The First One guild? :)</strong>
          </p>
          <p>
            You can bet when <strong>RXS</strong> makes it big time that we will be rewarding the original guild.
          </p>
          <p>‍</p>
          <p>
            <strong>Q. The vault has a lot of runes, what will you do with them?</strong>
          </p>
          <p>
            They will be used for locked liquidity, burned, contests, and some will be used for future rune mechanics.
            When <strong>EL</strong> was released, we provided <strong>EL</strong>-<strong>RUNE</strong> liquidity. When{' '}
            <strong>TIR</strong> is released, we'll provide the <strong>TIR-RUNE</strong> LPs. We'll keep doing that and
            we'll lock those LPs for 5 years using DxLock like we did for <strong>RUNE</strong>-BNB.
          </p>
          <p>‍</p>
          <p>
            <strong>Q. Won't the RXS market cap get diluted by runes?</strong>
          </p>
          <p>
            If there's no new investors coming in, then it could have that kind of affect. Some might choose to
            diversify between the <strong>runes</strong>. And <strong>EL</strong>-<strong>ZOD</strong> runes are a very
            key part of the success of <strong>$RXS</strong>. The more successful they are, the more successful{' '}
            <strong>$RXS</strong> will be in the long run.<strong> </strong>There will be a lot of cross-utility between{' '}
            <strong>runes</strong>, <strong>Runeforms</strong>, and even what happens with our partner collaborations.
          </p>
          <p>‍</p>
          <p>
            <strong>Q. There's so much to do, what do I do?</strong>
          </p>
          <p>There's lots of ways to play, and even more to discover. Some things you can do now include:</p>
          <ul role="list">
            <li>Create a hero (NFT) from one of seven different classes</li>
            <li>
              Play the <strong>Evolution Isles</strong> game and acquire crypto
            </li>
            <li>Collect all the different runes (crypto)</li>
            <li>
              Equip your hero with powerful weapons and armor called <strong>Runeforms</strong> (NFTs)
            </li>
            <li>
              Make new friends by joining a <strong>guild</strong>, or create a guild with friends
            </li>
            <li>
              Compete against other players and <strong>guilds</strong> to win leaderboard prizes
            </li>
            <li>
              Provide liquidity and <strong>raid</strong> farms to acquire runes
            </li>
            <li>
              Find secret <strong>Runeforms</strong>
            </li>
            <li>
              Speculate on the price of <strong>$RXS</strong>, the token that runs the ecosystem
            </li>
            <li>
              Use runes to craft and collect unique <strong>Runeforms</strong> and items
            </li>
            <li>Trade in the NFT Marketplace as a merchant</li>
            <li>Expand the Arken Realms by creating art, content, or features</li>
          </ul>
          <p>‍</p>
          <p>
            <strong>Q. What about vaults?</strong>
          </p>
          <p>
            There will be vaults in the future. The first vaults to be rolled out will likely be <strong>guild</strong>{' '}
            vaults.
          </p>
          <p>‍</p>
          <p>
            <strong>Q. What are runes used for?</strong>
          </p>
          <p>
            <strong>Runes</strong> are BEP20 digital tokens, there are 33 different tokens, each with a finite supply of
            250,000 or less. Within the Arken Realms they are magical stones with different use-cases. For example,
            different <strong>runes</strong> are needed to craft <strong>Runeforms</strong> (NFTs), powerful weapons and
            armor that are unique to your hero. Runes can be acquired competing against other players in games,
            providing liquidity, or through leaderboard competitions.
          </p>
          <p>‍</p>
          <p>
            <strong>Q. NFT Partnerships?</strong>
          </p>
          <p>We are always open to partnering with other projects.</p>
          <p>
            Projects can create exclusive NFT item(s) to be used in the Arken ecosystem, or take Arken NFTs to be used
            in their projects.
          </p>
          <p>
            Projects can submit requests via our NFT Partnership Form:{' '}
            <a href="https://forms.gle/JnufYQjqAvn6KBhb7">https://forms.gle/JnufYQjqAvn6KBhb7</a>​
          </p>
          <p>‍</p>
          <p>
            <strong>Q. Audit?</strong>
          </p>
          <p>
            Rune has been audited by CertiK and RD Auditors. It has been internally audited by half a dozen developers.{' '}
            <a href="https://arken.gg/risks/">See the Risks page</a> for more details.
          </p>
          <p>‍</p>
          <p>
            <strong>Q. TVL?</strong>
          </p>
          <p>
            You can see total value locked on the <a href="https://arken.gg/stats/">stats page</a>.
          </p>
          <p>‍</p>
          {/* <p>
            <strong>Q. Why does the deployer wallet have multiple RUNE tokens?</strong>
          </p>
          <p>
            We did a lot of testing before the final deployment. None of those had more than a few hundred RUNEs or more
            than $1 liquidity. Everybody was instructed NOT to buy them.
          </p>
          <p>‍</p> */}
          <p>
            <strong>Q. What happens to character fees and runeform runes used for crafting?</strong>
          </p>
          <p>
            Character fees and runeform runes used in crafting go to the Rune Vault. From there, they are burned at
            strategic times, used to pay for moderators, CMs, and development, and at a later date a certain portion
            will go back to token holders providing governance or liquidity.
          </p>
          <p>‍</p>
          <p>
            <strong>Q. What's the plan for Guild Tokens?</strong>
          </p>
          <p>
            Guild Tokens will be found randomly using specific Rune.Farm items. These tokens will have randomly
            generated rarity and attributes. Depending on your needs, you'll want specific attributes on your guild
            token.
            <br />
            <br />
            There will also be a fundraiser event where Arken will sell X amount of pre-generated Guild Tokens. All
            proceeds will be used towards marketing events.
            <br />
            <br />
            <strong>Possible Attributes:</strong>
            <br />
            +1-10% Farming Rewards
            <br />
            +1-100 Inventory Spaces
            <br />
            +1-50 Member Capacity
            <br />
            Craft Enigma (While Max Member Capacity)
            <br />
            Staking required: 10-100 EL + 10-100 TIR
            <br />
            Staking required: 1000-10000 RXS
            <br />
            These are still tentative.
          </p>
          <p>‍</p>
        </CardBody>
      </Card>
    </Page>
  );
};

export default Rules;
