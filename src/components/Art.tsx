import acts from 'rune-backend-sdk/build/data/generated/acts.json'
import areas from 'rune-backend-sdk/build/data/generated/areas.json'
import characterClasses from 'rune-backend-sdk/build/data/generated/characterClasses.json'
import characterFactions from 'rune-backend-sdk/build/data/generated/characterFactions.json'
import characterRaces from 'rune-backend-sdk/build/data/generated/characterRaces.json'
import eras from 'rune-backend-sdk/build/data/generated/eras.json'
import runeItems from 'rune-backend-sdk/build/data/generated/items.json'
import npcs from 'rune-backend-sdk/build/data/generated/npcs.json'
import planets from 'rune-backend-sdk/build/data/generated/planets.json'
import solarSystems from 'rune-backend-sdk/build/data/generated/solarSystems.json'
import { ProGallery } from 'pro-gallery'
import 'pro-gallery/dist/statics/main.css'
import React, { useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { createGlobalStyle } from 'styled-components'
import useMatchBreakpoints from '~/hooks/useMatchBreakpoints'
import { Skeleton } from '~/ui'

async function fixGalleryItems(items) {
  const promises = []

  for (const item of items) {
    const promise = new Promise(function (resolve, reject) {
      const img = new Image()

      img.onload = function () {
        // @ts-ignore
        item.metaData.width = this.width
        // @ts-ignore
        item.metaData.height = this.height

        resolve(item)
      }

      img.src = item.mediaUrl
    })

    promises.push(promise)
  }

  return Promise.all(promises)
}

function shuffle(array) {
  let currentIndex = array.length
  let randomIndex

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // And swap it with the current element.
    ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }

  return array
}

const GlobalStyles = createGlobalStyle`
body { 
  overflow-y: visible !important;
}
#app {
  height: 100% !important;
}
.react-draggable {
  position: unset !important;
  top: unset !important;
  left: unset !important;
}
.handle {
  display: none !important;
}
.handle + div {
  overflow-y: hidden;
}
#show-more-default-dom-id {
  border-color: #ddd;
  color: #ddd;
  zoom: 1.3;
}
`

const items = []

const ArtInner = () => {
  const { t } = useTranslation()
  const { isMd, isLg, isXl, isXxl, isXxxl } = useMatchBreakpoints()
  const isMobile = !isMd && !isLg && !isXl && !isXxl && !isXxxl
  const [galleryItems, setGalleryItems] = useState([])

  useLayoutEffect(
    function () {
      if (items.length) return

      console.log('REGEN GALLERY')

      const categories = [
        {
          name: 'areas',
          items: areas,
        },
        {
          name: 'eras',
          items: eras,
        },
        {
          name: 'acts',
          items: acts,
        },
        {
          name: 'characterRaces',
          items: characterRaces,
        },
        {
          name: 'characterFactions',
          items: characterFactions,
        },
        {
          name: 'characterClasses',
          items: characterClasses,
        },
        {
          name: 'npcs',
          items: npcs,
        },
        {
          name: 'solarSystems',
          items: solarSystems,
        },
        {
          name: 'planets',
          items: planets,
        },
        {
          name: 'items',
          items: runeItems,
        },
      ]

      for (const category of categories) {
        for (const item of category.items) {
          // @ts-ignore
          if (!item.isEnabled) continue
          // @ts-ignore
          const image = item.image || item.images?.[0]
          if (!image) continue
          if (items.find((i) => i.mediaUrl === image)) continue

          items.push({
            itemId: category.name + '-' + item.id,
            mediaUrl: image,
            metaData: {
              type: 'image',
              height: 350,
              width: 350,
              title: item.name,
              description: item.description,
              focalPoint: [0, 0],
              link: {
                // @ts-ignore
                url: item.link || '',
                target: '_blank',
              },
            },
          })
        }
      }

      shuffle(items)
      //   { // Image item:
      //           itemId: 'sample-id',
      //           mediaUrl: 'https://i.picsum.photos/id/674/200/300.jpg?hmac=kS3VQkm7AuZdYJGUABZGmnNj_3KtZ6Twgb5Qb9ITssY',
      //           metaData: {
      //                   type: 'image',
      //                   height: 200,
      //                   width: 100,
      //                   title: 'sample-title',
      //                   description: 'sample-description',
      //                   focalPoint: [0, 0],
      //                   link: {
      //                           url: 'http://example.com',
      //                           target: '_blank'
      //                   },
      //           }
      //   },
      //   { // Another Image item:
      //           itemId: 'differentItem',
      //           mediaUrl: 'https://i.picsum.photos/id/1003/1181/1772.jpg?hmac=oN9fHMXiqe9Zq2RM6XT-RVZkojgPnECWwyEF1RvvTZk',
      //           metaData: {
      //                   type: 'image',
      //                   height: 200,
      //                   width: 100,
      //                   title: 'sample-title',
      //                   description: 'sample-description',
      //                   focalPoint: [0, 0],
      //                   link: {
      //                           url: 'http://example.com',
      //                           target: '_blank'
      //                   },
      //           }
      //   },
      //   { // HTML item:
      //           itemId: 'htmlItem',
      //           html: "<div style='width: 300px; height: 200px; background:pink;'>I am a text block</div>",
      //           metadata: {
      //                   type: "text",
      //                   height: 200,
      //                   width: 300,
      //                   title: 'sample-title',
      //                   description: 'sample-description',
      //                   backgroundColor: 'pink'
      //           },

      //   },
      // ]

      async function run() {
        setGalleryItems(await fixGalleryItems(items.slice(0, 10)))
      }

      run()
    },
    [setGalleryItems]
  )

  // The size of the gallery container. The images will fit themselves in it
  const container = {
    width: window.innerWidth,
    height: window.innerHeight,
  }

  // The eventsListener will notify you anytime something has happened in the gallery.
  const eventsListener = async (eventName, eventData) => {
    // console.log({eventName, eventData})

    if (eventName === 'NEED_MORE_ITEMS') {
      // GALLERY_SCROLLED
      if (eventData + 10 > items.length) return
      setGalleryItems(await fixGalleryItems(items.slice(0, eventData + 10)))
      // console.log(8888, eventData, items)
    }
  }

  // The scrollingElement is usually the window, if you are scrolling inside another element, suplly it here
  const scrollingElement = window

  // The options of the gallery (from the playground current state)
  const options = {
    layoutParams: {
      structure: {
        galleryLayout: -1,
      },
      targetItemSize: {
        minimum: 500,
      },
      groups: {
        density: 1,
      },
      // "structure": {
      //     "galleryLayout": -1,
      //     // "enableStreching": false
      //     // "layoutOrientation": "VERTICAL"
      // }
    },
    behaviourParams: {
      gallery: {
        // "vertical": {
        //     "loadMore": {
        //         "enable": true
        //     }
        // },
        blockContextMenu: false,
      },
      item: {
        clickAction: 'LINK' as any,
      },
    },
  }
  // console.log(8888, 'zzz', galleryItems)
  return (
    <>
      <GlobalStyles />
      {!galleryItems.length ? <Skeleton height="80px" mb="16px" mt="16px" ml="16px" mr="16px" /> : null}
      {galleryItems.length ? (
        <ProGallery
          items={galleryItems}
          options={options}
          container={container}
          eventsListener={eventsListener}
          scrollingElement={scrollingElement}
        />
      ) : null}
    </>
  )
}

export default ArtInner
