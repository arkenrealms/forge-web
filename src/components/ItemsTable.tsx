import React from 'react'
import { itemData } from 'rune-backend-sdk/build/data/items'
import { ItemsMainCategoriesType } from 'rune-backend-sdk/build/data/items.type'

const items = {
  Wands: [itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'The Oculus')],
  Boots: [
    itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Flash'),
    itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Reave'),
  ],
  Rings: [
    itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Eternity'),
    itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Instinct'),
    itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Animus'),
    itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Stone of Jordan'),
  ],
  Trinkets: [
    itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Black Drake Scale'),
    itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Black Drake Talon'),
    itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === "General's Medallion"),
    itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Glow Fly Powder'),
    itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Luminous Flywings'),
    itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === "Scholar's Codex"),
  ],
  Amulets: [
    itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Beacon'),
    itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Dragonlight'),
  ],
  //itemData[ItemsMainCategoriesType.OTHER].filter((r) => r.type === 12 && r.isPublishable),
  Leggings: [
    itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Flow'),
    itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Flare'),
    itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Ignition'),
  ],
  Hammers: [],
  'Great Swords': [
    itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Guiding Light'),
    itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Glory'),
    itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Lionheart'),
  ],
  'Great Axes': [itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Hellreaver')],
  'Great Hammers': [],
  Gloves: [
    itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Pressure'),
    itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Smoke'),
  ],
  'Body Armors': [
    itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Hellfire'),
    itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Blur'),
    itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Titan'),
  ],
  Scythes: [itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Burial')],
  Claws: [itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Wrath')],
  Staves: [itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Destiny')],
  Maces: [itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Elder')],
  Belts: [itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Balance')],
  Bracers: [itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Zeal')],
  Shields: [itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Fortress')],
  Daggers: [
    itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Mercy'),
    itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Genesis'),
  ],
  Helms: [
    itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Pledge'),
    itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Lorekeeper'),
    itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Vampire Gaze'),
  ],
  Swords: [
    itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Exile'),
    itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Fury'),
    itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Steel'),
  ],
  Homage: [
    itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Stone of Jordan'),
    itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'The Oculus'),
    itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Vampire Gaze'),
  ],
  Misc: [
    itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === "Founder's Cube"),
    itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Rune Royale Ticket'),
    itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Worldstone Shard'),
    itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === "Zavox's Fortune"),
  ],
  'Battle Pets': [
    itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Red-Eyes Black Drake'),
    itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Blue-Eyes White Drake'),
    itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Golden Lion Cub'),
    itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Forest Turtle'),
    itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Skeleton Drake'),
    itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Wyvern'),
    itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Hippogryph'),
    itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Fairy Drake'),
    itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Goblin Drake'),
  ],
  Land: [],
  NPC: [],
  DLC: [],
  Mauls: [],
  Axes: [],
}

const sections = [
  'Swords',
  'Axes',
  'Hammers',
  'Maces',
  'Great Swords',
  'Great Axes',
  'Great Hammers',
  'Mauls',
  'Claws',
  'Staves',
  'Wands',
  'Scythes',
  'Daggers',
  'Shields',
  'Helms',
  'Body Armors',
  'Bracers',
  'Gloves',
  'Belts',
  'Leggings',
  'Boots',
  'Rings',
  'Amulets',
  'Trinkets',
  'Battle Pets',
  'Land',
  'NPC',
  'Homage',
  'DLC',
  'Misc',
]

const ItemsTable = function () {
  return (
    <div className="div-block-24 frame padding-adjust">
      <h2 id="w-node-bde60e1f-0335-b179-271c-7d40fcbd5f61-3d100cc1" className="pagetitle itemcattitle">
        Item Types
      </h2>
      {sections.map((section) => (
        <div className="itemtypesection">
          <h3 className="heading-2 itemtypetitle">{section}</h3>
          <div className="w-dyn-list">
            <div role="list" className="collection-list w-dyn-items">
              {!items[section].length ? (
                <div className="empty-state w-dyn-empty">
                  <div>No items found.</div>
                </div>
              ) : null}
              {items[section].map((item) => (
                <div key={section + item.id} role="listitem" className="w-dyn-item">
                  <a
                    href={'/item/' + item.name.replace(/ /gi, '-').replace("'", '').toLowerCase()}
                    className="list-item collapse-sm w-inline-block">
                    <div className="div-block-19">
                      <img src={item.icon} loading="lazy" width={32} alt="" className="image-7" />
                      <div className="no-image w-condition-invisible">
                        <div>
                          No <br />
                          image{' '}
                        </div>
                      </div>
                      <div className="list-link">{item.name}</div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ItemsTable
