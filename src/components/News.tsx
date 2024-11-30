import React from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Card, Heading, CardBody, Button, Link } from '~/ui';
import useMatchBreakpoints from '~/hooks/useMatchBreakpoints';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
//import '~swiper/swiper.min.css'
//import '~swiper/modules/navigation/navigation.min.css' // Navigation module
//import '~swiper/modules/pagination/pagination.min.css' // Pagination module
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const zzz = styled.div``;

const newsItems = [
  {
    title: 'Arken DAO: Update',
    href: 'https://twitter.com/ArkenRealms/status/1573256632309809152',
    image: 'https://pbs.twimg.com/media/FdVUXkwagAEbGeO?format=jpg&name=large',
    date: 'September 23, 2022',
    description: `Our first proposal passed 100% for initiating the 4 phase plan towards a DAO. 37% of votable RXS participated.`,
  },
  {
    title: '✨ New Age of Game Items ✨',
    href: 'https://arkenrealms.medium.com/new-age-of-game-items-432e06a7cda5',
    image: 'https://i.imgur.com/6YVNA3Z.gif',
    date: 'September 19, 2022',
    description: `Every NFT item dropped in Arken games will have 100% unique AI-generated designs, adding to the functionality of our Evolving NFT concept. You can claim/detach/attach Guiding Light skins now!`,
  },
  {
    title: 'arken.gg v1.8.1',
    href: 'https://twitter.com/ArkenRealms/status/1569090862076018688',
    image: 'https://pbs.twimg.com/media/FcaHuK7agAAVOWx?format=jpg&name=large',
    date: 'September 11, 2022',
    description: `arken.gg v1.8.1`,
  },
  {
    title: 'Arken Realms DAO',
    href: 'https://arkenrealms.medium.com/rune-metaverse-dao-1a90f6e1cd18',
    image: 'https://pbs.twimg.com/media/Fb6Ez1YaUAEjhWV?format=jpg&name=small',
    date: 'September 5, 2022',
    description: `Is it time to start the first phase towards a Arken Realms DAO? Vote now! 🗳`,
  },
  {
    title: 'First AI-Powered Metaverse',
    href: 'https://arkenrealms.medium.com/the-first-ai-powered-metaverse-25a2f3ae6b3d',
    image: 'https://pbs.twimg.com/card_img/1566493698602717184/0vvYIH6a?format=jpg&name=900x900',
    date: 'September 4, 2022',
    description: `Arken Realms seeks to be the first AI-powered metaverse 🎮`,
  },
  {
    title: 'Introducing Arken Live',
    href: 'https://arken.gg/live',
    image: 'https://pbs.twimg.com/media/Fbi3gDDaMAAtxPR?format=jpg&name=large',
    date: 'September 2, 2022',
    description: `Keep up with what's happening in the Arken Realms in real time: game wins, trades, achievements and our Twitch live streams 🎮`,
  },
  {
    title: 'Evolution Isles Season 2',
    href: 'https://arken.gg/evolution',
    image: 'https://pbs.twimg.com/media/Fbmr7LOagAA5udT?format=jpg&name=large',
    date: 'August 28, 2022',
    description: `Use your crafted NFTs to win your way to glory in Evolution Isles season 2 🎮`,
  },
  {
    title: 'Evolution Isles Season 1',
    href: 'https://arken.gg/tournament',
    image: 'https://i.imgur.com/ba1Jc3E.png',
    date: 'July 29, 2022',
    description: `Win cash & epic NFTs in the first Evolution Isles season, after Rune Royale on Twitch 🎮`,
  },
  {
    title: 'Arken Realms 🤝 TofuNFT',
    href: 'https://tofunft.com/collection/rune-arcane-items/items',
    image: 'https://cdn.tofunft.com/covers/ih9xacsxiiyim2m.png/1440.png',
    date: 'April 26, 2022',
    description: `You can now trade Arken items on @tofuNFT! Check out the Arken collection here👇`,
  },
  {
    title: 'Infinite Arena Announcement',
    href: 'https://twitter.com/ArkenRealms/status/1508130146619777025',
    image: 'https://pbs.twimg.com/media/FO30DyKVkAIvGy8?format=jpg&name=large',
    date: 'March 28, 2022',
    description: `🔥Infinite Arena Earliest Access 📅 April 4 🔒 Exclusive access to Founder's Cube holders ➡️ Get your cube ready: arken.gg/cube`,
  },
  {
    title: "THE FOUNDER'S TAVERN IS NOW OPEN 🍻",
    href: 'https://twitter.com/ArkenRealms/status/1504316781799751680',
    image: 'https://pbs.twimg.com/media/FOBnpG1VQAMOuiN?format=jpg&name=large',
    date: 'March 18, 2022',
    description: `Raiders who owns a Founder's Cube may join in our Discord @ discord.arken.gg if you have a cube from arken.gg/cube`,
  },
  {
    title: 'Arken Nexus is here',
    href: 'https://arkenrealms.medium.com/rune-nexus-is-here-no-more-wikis-no-more-documents-c176519b8980',
    image: 'https://i.imgur.com/ADGllOt.png',
    date: 'March 16, 2022',
    description: `We wanted to bring the D&D books of old back into the RPG gaming experience, with nice designs and lore to immerse yourself in.`,
  },
  {
    title: 'Gear Up with Arken - Round 4',
    href: 'https://gleam.io/TwANb/gear-up-with-rune-round-4',
    image: 'https://pbs.twimg.com/media/FNDKv15VcAMIOAk?format=jpg&name=large',
    date: 'March 5, 2022',
    description: `We are giving away another Founder's Cube and Fully Equipped Character! ($650 value!). Be one of the first to play Infinite Arena by winning a Founder's Cube!`,
  },
  {
    title: 'Sanctuary Pre-Alpha Sneak Peek',
    href: 'https://t.co/w6ymcB6fcX',
    image: 'https://pbs.twimg.com/media/FKtrPCdVIAEmZL7?format=jpg&name=large',
    date: 'March 1, 2022',
    description: `Sneak peak for our upcoming #MMORPG Heart of the Oasis 👀 "At the end of all timelines lies this last bead of light."`,
  },
  {
    title: 'Rune Royale: Dawning',
    href: 'http://twitch.tv/ArkenRealms',
    image: 'https://pbs.twimg.com/media/FMkoMBAVcAIGXC3?format=jpg&name=large',
    date: 'Feb 27, 2022',
    description: `50,000 $RXS is at stake! That comes out to around $500. Come prove your might in the Mage Isles and take home the victory! 🏆`,
  },
  {
    title: 'Haiku Contest',
    href: 'https://twitter.com/ArkenRealms/status/1486397171851091975',
    image: 'https://pbs.twimg.com/media/FK9p4UPUcAIjcou?format=jpg&name=large',
    date: 'Feb 7, 2022',
    description: `Win a Founder's Cube. By providing a Haiku. Of Arken Realms.`,
  },
];

const NewsItem = function ({ item }) {
  return (
    <div
      css={css`
        position: relative;
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        width: 100%;
        height: 100%;
      `}>
      <div
        css={css`
          position: absolute;
          top: 15px;
          right: 15px;
        `}>
        <Button scale="sm" as={Link} href={item.href}>
          Visit
        </Button>
      </div>
      <div
        css={css`
          border-radius: 6px 6px 0 0;
          height: 200px;
          width: 100%;
          background-image: url(${item.image});
          background-size: cover;
          background-position: 50% 50%;
          &:hover {
            cursor: url('/images/cursor3.png'), pointer;
          }
        `}
        onClick={() => {
          window.location.href = item.href;
        }}
      />
      <div
        css={css`
          padding: 10px;
        `}>
        <div
          css={css`
            height: 80px;
          `}>
          <h3 style={{ fontSize: '1.1rem' }}>{item.title}</h3>
          <h4 style={{ fontSize: '0.8rem' }}>{item.date}</h4>
        </div>
        <p>{item.description}</p>
      </div>
    </div>
  );
};

const News = () => {
  const { t } = useTranslation();
  const { isMd, isLg, isXl, isXxl, isXxxl } = useMatchBreakpoints();
  const isMobile = !isMd && !isLg && !isXl && !isXxl && !isXxxl;

  return (
    <Card style={{ maxWidth: 1200, minHeight: 300, margin: '0 auto 30px auto' }}>
      <Heading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15, marginBottom: 16 }}>
        {t('News')}
      </Heading>
      <hr />
      <br />
      <Swiper
        // install Swiper modules
        // direction={"vertical"}
        modules={[Navigation, Pagination, Scrollbar]}
        spaceBetween={30}
        slidesPerView={isMobile ? 1 : 3}
        navigation
        // mousewheel={{
        //   forceToAxis: true,
        // }}
        // pagination={{ clickable: true }}
        // scrollbar={{ draggable: true }}
        // onSwiper={(swiper) => console.log(swiper)}
        // onSlideChange={() => console.log('slide change')}
        style={{ maxWidth: 1200, margin: '0 auto 30px auto', padding: '0 20px' }}>
        {newsItems.map((item) => (
          <SwiperSlide style={{ maxWidth: 1200, margin: '0 auto', height: 'auto' }}>
            <NewsItem item={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </Card>
  );
};

export default News;
