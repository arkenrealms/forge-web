import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Skeleton } from '~/ui';
import useMatchBreakpoints from '~/hooks/useMatchBreakpoints';
import Linker from '~/components/Linker';
import npcs from '@arken/node/legacy/data/generated/npcs.json';

// Import Swiper styles
//import '~swiper/swiper.min.css'
//import '~swiper/modules/navigation/navigation.min.css' // Navigation module
//import '~swiper/modules/pagination/pagination.min.css' // Pagination module
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const NPC = function ({ id }) {
  // const url = `https://s1.envoy.arken.asi.sh/npcs.json`
  // const { data } = useFetch(url)
  const { isMd, isLg, isXl, isXxl, isXxxl } = useMatchBreakpoints();
  const isMobile = !isMd && !isLg && !isXl && !isXxl && !isXxxl;

  // const npcs = data?.[url] || []
  const npc = npcs.find((z) => z.name.toLowerCase().replace(' ', '-') === id);

  if (!npc)
    return (
      <div style={{ padding: 10 }}>
        <Skeleton height="80px" mb="16px" mt="16px" ml="16px" mr="16px" />
      </div>
    );

  return (
    <>
      <main className="content-wrapper wf-section">
        <div className="page-bg-top">
          <img src={npc.image || '/images/mage-isles-tsunami3.jpeg'} loading="eager" alt="" className="bg-art-top" />
        </div>
        <div className="container w-container">
          <h1>{npc.name}</h1>
          <div className="w-layout-grid page-2-cols">
            <div id="w-node-_14c5fa68-23f0-17df-6917-41acdd50e8d6-2d51dc0f">
              <div className="w-richtext">
                <p>
                  {/* <ReactMarkdown remarkPlugins={[remarkGfm]}>{npc.description}</ReactMarkdown> */}
                  <Linker id="npc-1">{npc.description}</Linker>
                </p>
              </div>
              <img src="" loading="eager" alt="" className="bg-art-10 w-dyn-bind-empty" />
            </div>
            <div id="w-node-_0a858e63-15a2-7571-da25-75d24f30f354-2d51dc0f">
              <div className="w-richtext">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{npc.quote1}</ReactMarkdown>
              </div>
            </div>
          </div>
          <div className="w-layout-grid page-2-cols">
            <div id="w-node-_86703ed3-2386-5139-77a6-bfd4a68e3cd4-2d51dc0f">
              <div className="w-richtext">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{npc.lore1}</ReactMarkdown>
              </div>
            </div>
            <div id="w-node-c0787daf-c078-e10d-22b9-e88816b1c3e4-2d51dc0f">
              <div className="w-richtext">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{npc.lore2}</ReactMarkdown>
              </div>
            </div>
            <div id="w-node-_4f71a33e-0bf3-fe73-a6e9-2e917ac5fb80-2d51dc0f">
              <div className="w-richtext">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{npc.lore3}</ReactMarkdown>
              </div>
            </div>
          </div>
          <br />
          <br />

          {/* <Swiper
            // install Swiper modules
            // direction={"vertical"}
            modules={[Navigation, Pagination, Scrollbar]}
            spaceBetween={5}
            slidesPerView={isMobile ? 1 : 4}
            navigation
            // simulateTouch={!touchCapable()}
            // pagination={{ clickable: true }}
            // scrollbar={{ draggable: true }}
            // onSwiper={(swiper) => console.log(swiper)}
            // onSlideChange={() => console.log('slide change')}
            style={{ maxWidth: 1200, margin: '0 auto 30px auto' }}
          >
            {npc.images?.map((image) => (
              <SwiperSlide key={image} style={{ height: '100%', position: 'relative' }}>
                <img src={image} />
              </SwiperSlide>
            ))}
          </Swiper> */}
        </div>
      </main>
    </>
  );
};

export default NPC;
