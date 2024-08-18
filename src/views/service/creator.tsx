import React, { useState } from 'react';
import { decodeItem } from 'rune-backend-sdk/build/util/item-decoder';
import styled, { createGlobalStyle } from 'styled-components';
import Page from '~/components/layout/Page';
import { BaseLayout, Button, Card, CardBody, Heading } from '~/ui';

import { itemData } from 'rune-backend-sdk/build/data/items';
import { ItemCategoriesType, ItemsMainCategoriesType } from 'rune-backend-sdk/build/data/items.type';
import ItemInformation from '~/components/ItemInformation';

function pad(n, width, z = '0') {
  const nn = n + '';
  return nn.length >= width ? nn : new Array(width - nn.length + 1).join(z) + nn;
}

const getTokenIdFromItem = (data) => {
  const version = 3;

  let attrs = '';

  for (let i = 0; i < 8; i++) {
    const attribute = data.attributes[i];

    if (attribute && attribute?.id) {
      attrs += '2' + pad(attribute?.id || 0, 3) + pad(attribute?.value || 0, 3);
    } else {
      attrs += '0' + pad(attribute?.id || 0, 3) + pad(attribute?.value || 0, 3);
    }
  }

  attrs += '001';

  return `1${pad(version, 3)}${pad(data.id, 5)}${pad(data.type, 2)}${attrs}`;
};

const petFuncs = {
  getPet0x1: function getPet0x1() {
    const res = itemData[ItemsMainCategoriesType.OTHER].find((i) => i.name === 'Golden Lion Cub') as any;

    res.branches[1].attributes[0].value = 3;
    res.branches[1].attributes[1].value = 10;
    res.branches[1].attributes[2].value = 80;
    res.branches[1].attributes[3].value = 10;
    res.branches[1].attributes[4].value = 5;
    res.branches[1].attributes[5].value = 5;
    res.branches[1].attributes[6].value = 12;

    res.attributes = res.branches[1].attributes;

    return res;
  },
  getPet0x2: function getPet0x2() {
    const res = itemData[ItemsMainCategoriesType.OTHER].find((i) => i.name === 'Golden Lion Cub') as any;

    res.branches[1].attributes[0].value = 4;
    res.branches[1].attributes[1].value = 7;
    res.branches[1].attributes[2].value = 60;
    res.branches[1].attributes[3].value = 7;
    res.branches[1].attributes[4].value = 4;
    res.branches[1].attributes[5].value = 4;
    res.branches[1].attributes[6].value = 12;

    res.attributes = res.branches[1].attributes;

    return res;
  },
  getPet0x3: function getPet0x3() {
    const res = itemData[ItemsMainCategoriesType.OTHER].find((i) => i.name === 'Golden Lion Cub') as any;

    res.branches[1].attributes[0].value = 5;
    res.branches[1].attributes[1].value = 5;
    res.branches[1].attributes[2].value = 40;
    res.branches[1].attributes[3].value = 5;
    res.branches[1].attributes[4].value = 3;
    res.branches[1].attributes[5].value = 3;
    res.branches[1].attributes[6].value = 12;

    res.attributes = res.branches[1].attributes;

    return res;
  },
  getPet0x4: function getPet0x4() {
    const res = itemData[ItemsMainCategoriesType.OTHER].find((i) => i.name === 'Golden Lion Cub') as any;

    res.branches[1].attributes[0].value = 6;
    res.branches[1].attributes[1].value = 3;
    res.branches[1].attributes[2].value = 20;
    res.branches[1].attributes[3].value = 3;
    res.branches[1].attributes[4].value = 2;
    res.branches[1].attributes[5].value = 2;
    res.branches[1].attributes[6].value = 12;

    res.attributes = res.branches[1].attributes;

    return res;
  },
  getPet1x1: function getPet1x1() {
    const res = itemData[ItemsMainCategoriesType.OTHER].find((i) => i.name === 'Blue-Eyes White Drake') as any;

    res.branches[1].attributes[0].value = 3;
    res.branches[1].attributes[1].value = 10;
    res.branches[1].attributes[2].value = 5;
    res.branches[1].attributes[3].value = 10;
    res.branches[1].attributes[4].value = 5;
    res.branches[1].attributes[5].value = 50;
    res.branches[1].attributes[6].value = 13;

    res.attributes = res.branches[1].attributes;

    return res;
  },
  getPet1x2: function getPet1x2() {
    const res = itemData[ItemsMainCategoriesType.OTHER].find((i) => i.name === 'Blue-Eyes White Drake') as any;

    res.branches[1].attributes[0].value = 4;
    res.branches[1].attributes[1].value = 7;
    res.branches[1].attributes[2].value = 4;
    res.branches[1].attributes[3].value = 7;
    res.branches[1].attributes[4].value = 4;
    res.branches[1].attributes[5].value = 40;
    res.branches[1].attributes[6].value = 13;

    res.attributes = res.branches[1].attributes;

    return res;
  },
  getPet1x3: function getPet1x3() {
    const res = itemData[ItemsMainCategoriesType.OTHER].find((i) => i.name === 'Blue-Eyes White Drake') as any;

    res.branches[1].attributes[0].value = 5;
    res.branches[1].attributes[1].value = 5;
    res.branches[1].attributes[2].value = 3;
    res.branches[1].attributes[3].value = 5;
    res.branches[1].attributes[4].value = 3;
    res.branches[1].attributes[5].value = 30;
    res.branches[1].attributes[6].value = 13;

    res.attributes = res.branches[1].attributes;

    return res;
  },
  getPet1x4: function getPet1x4() {
    const res = itemData[ItemsMainCategoriesType.OTHER].find((i) => i.name === 'Blue-Eyes White Drake') as any;

    res.branches[1].attributes[0].value = 6;
    res.branches[1].attributes[1].value = 3;
    res.branches[1].attributes[2].value = 2;
    res.branches[1].attributes[3].value = 3;
    res.branches[1].attributes[4].value = 2;
    res.branches[1].attributes[5].value = 20;
    res.branches[1].attributes[6].value = 13;

    res.attributes = res.branches[1].attributes;

    return res;
  },
  getPet2x1: function getPet2x1() {
    const res = itemData[ItemsMainCategoriesType.OTHER].find((i) => i.name === 'Red-Eyes Black Drake') as any;

    res.branches[1].attributes[0].value = 3;
    res.branches[1].attributes[1].value = 10;
    res.branches[1].attributes[2].value = 5;
    res.branches[1].attributes[3].value = 10;
    res.branches[1].attributes[4].value = 20;
    res.branches[1].attributes[5].value = 5;
    res.branches[1].attributes[6].value = 14;

    res.attributes = res.branches[1].attributes;

    return res;
  },
  getPet2x2: function getPet2x2() {
    const res = itemData[ItemsMainCategoriesType.OTHER].find((i) => i.name === 'Red-Eyes Black Drake') as any;

    res.branches[1].attributes[0].value = 4;
    res.branches[1].attributes[1].value = 7;
    res.branches[1].attributes[2].value = 4;
    res.branches[1].attributes[3].value = 7;
    res.branches[1].attributes[4].value = 16;
    res.branches[1].attributes[5].value = 4;
    res.branches[1].attributes[6].value = 14;

    res.attributes = res.branches[1].attributes;

    return res;
  },
  getPet2x3: function getPet2x3() {
    const res = itemData[ItemsMainCategoriesType.OTHER].find((i) => i.name === 'Red-Eyes Black Drake') as any;

    res.branches[1].attributes[0].value = 5;
    res.branches[1].attributes[1].value = 5;
    res.branches[1].attributes[2].value = 3;
    res.branches[1].attributes[3].value = 5;
    res.branches[1].attributes[4].value = 12;
    res.branches[1].attributes[5].value = 3;
    res.branches[1].attributes[6].value = 14;

    res.attributes = res.branches[1].attributes;

    return res;
  },
  getPet2x4: function getPet2x4() {
    const res = itemData[ItemsMainCategoriesType.OTHER].find((i) => i.name === 'Red-Eyes Black Drake') as any;

    res.branches[1].attributes[0].value = 6;
    res.branches[1].attributes[1].value = 3;
    res.branches[1].attributes[2].value = 2;
    res.branches[1].attributes[3].value = 3;
    res.branches[1].attributes[4].value = 8;
    res.branches[1].attributes[5].value = 2;
    res.branches[1].attributes[6].value = 14;

    res.attributes = res.branches[1].attributes;

    return res;
  },
  getPet3x1: function getPet3x1() {
    const res = itemData[ItemsMainCategoriesType.OTHER].find((i) => i.name === 'Fairy Drake') as any;

    res.branches[1].attributes[0].value = 3;
    res.branches[1].attributes[1].value = 10;
    res.branches[1].attributes[2].value = 20;
    res.branches[1].attributes[3].value = 5;
    res.branches[1].attributes[4].value = 5;
    res.branches[1].attributes[5].value = 5;
    res.branches[1].attributes[6].value = 15;

    res.attributes = res.branches[1].attributes;

    return res;
  },
  getPet3x2: function getPet3x2() {
    const res = itemData[ItemsMainCategoriesType.OTHER].find((i) => i.name === 'Fairy Drake') as any;

    res.branches[1].attributes[0].value = 4;
    res.branches[1].attributes[1].value = 7;
    res.branches[1].attributes[2].value = 16;
    res.branches[1].attributes[3].value = 4;
    res.branches[1].attributes[4].value = 4;
    res.branches[1].attributes[5].value = 4;
    res.branches[1].attributes[6].value = 15;

    res.attributes = res.branches[1].attributes;

    return res;
  },
  getPet3x3: function getPet3x3() {
    const res = itemData[ItemsMainCategoriesType.OTHER].find((i) => i.name === 'Fairy Drake') as any;

    res.branches[1].attributes[0].value = 5;
    res.branches[1].attributes[1].value = 5;
    res.branches[1].attributes[2].value = 12;
    res.branches[1].attributes[3].value = 3;
    res.branches[1].attributes[4].value = 3;
    res.branches[1].attributes[5].value = 3;
    res.branches[1].attributes[6].value = 15;

    res.attributes = res.branches[1].attributes;

    return res;
  },
  getPet3x4: function getPet3x4() {
    const res = itemData[ItemsMainCategoriesType.OTHER].find((i) => i.name === 'Fairy Drake') as any;

    res.branches[1].attributes[0].value = 6;
    res.branches[1].attributes[1].value = 3;
    res.branches[1].attributes[2].value = 8;
    res.branches[1].attributes[3].value = 2;
    res.branches[1].attributes[4].value = 2;
    res.branches[1].attributes[5].value = 2;
    res.branches[1].attributes[6].value = 15;

    res.attributes = res.branches[1].attributes;

    return res;
  },
  getPet4x1: function getPet4x1() {
    const res = itemData[ItemsMainCategoriesType.OTHER].find((i) => i.name === 'Goblin Drake') as any;

    res.branches[1].attributes[0].value = 3;
    res.branches[1].attributes[1].value = 10;
    res.branches[1].attributes[2].value = 20;
    res.branches[1].attributes[3].value = 5;
    res.branches[1].attributes[4].value = 5;
    res.branches[1].attributes[5].value = 5;
    res.branches[1].attributes[6].value = 16;

    res.attributes = res.branches[1].attributes;

    return res;
  },
  getPet4x2: function getPet4x2() {
    const res = itemData[ItemsMainCategoriesType.OTHER].find((i) => i.name === 'Goblin Drake') as any;

    res.branches[1].attributes[0].value = 4;
    res.branches[1].attributes[1].value = 7;
    res.branches[1].attributes[2].value = 16;
    res.branches[1].attributes[3].value = 4;
    res.branches[1].attributes[4].value = 4;
    res.branches[1].attributes[5].value = 4;
    res.branches[1].attributes[6].value = 16;

    res.attributes = res.branches[1].attributes;

    return res;
  },
  getPet4x3: function getPet4x3() {
    const res = itemData[ItemsMainCategoriesType.OTHER].find((i) => i.name === 'Goblin Drake') as any;

    res.branches[1].attributes[0].value = 5;
    res.branches[1].attributes[1].value = 5;
    res.branches[1].attributes[2].value = 12;
    res.branches[1].attributes[3].value = 3;
    res.branches[1].attributes[4].value = 3;
    res.branches[1].attributes[5].value = 3;
    res.branches[1].attributes[6].value = 16;

    res.attributes = res.branches[1].attributes;

    return res;
  },
  getPet4x4: function getPet4x4() {
    const res = itemData[ItemsMainCategoriesType.OTHER].find((i) => i.name === 'Goblin Drake') as any;

    res.branches[1].attributes[0].value = 6;
    res.branches[1].attributes[1].value = 3;
    res.branches[1].attributes[2].value = 8;
    res.branches[1].attributes[3].value = 2;
    res.branches[1].attributes[4].value = 2;
    res.branches[1].attributes[5].value = 2;
    res.branches[1].attributes[6].value = 16;

    res.attributes = res.branches[1].attributes;

    return res;
  },
  getPet5x1: function getPet5x1() {
    const res = itemData[ItemsMainCategoriesType.OTHER].find((i) => i.name === 'Hippogryph') as any;

    res.branches[1].attributes[0].value = 3;
    res.branches[1].attributes[1].value = 10;
    res.branches[1].attributes[2].value = 20;
    res.branches[1].attributes[3].value = 5;
    res.branches[1].attributes[4].value = 5;
    res.branches[1].attributes[5].value = 5;
    res.branches[1].attributes[6].value = 17;

    res.attributes = res.branches[1].attributes;

    return res;
  },
  getPet5x2: function getPet5x2() {
    const res = itemData[ItemsMainCategoriesType.OTHER].find((i) => i.name === 'Hippogryph') as any;

    res.branches[1].attributes[0].value = 4;
    res.branches[1].attributes[1].value = 7;
    res.branches[1].attributes[2].value = 16;
    res.branches[1].attributes[3].value = 4;
    res.branches[1].attributes[4].value = 4;
    res.branches[1].attributes[5].value = 4;
    res.branches[1].attributes[6].value = 17;

    res.attributes = res.branches[1].attributes;

    return res;
  },
  getPet5x3: function getPet5x3() {
    const res = itemData[ItemsMainCategoriesType.OTHER].find((i) => i.name === 'Hippogryph') as any;

    res.branches[1].attributes[0].value = 5;
    res.branches[1].attributes[1].value = 5;
    res.branches[1].attributes[2].value = 12;
    res.branches[1].attributes[3].value = 3;
    res.branches[1].attributes[4].value = 3;
    res.branches[1].attributes[5].value = 3;
    res.branches[1].attributes[6].value = 17;

    res.attributes = res.branches[1].attributes;

    return res;
  },
  getPet5x4: function getPet5x4() {
    const res = itemData[ItemsMainCategoriesType.OTHER].find((i) => i.name === 'Hippogryph') as any;

    res.branches[1].attributes[0].value = 6;
    res.branches[1].attributes[1].value = 3;
    res.branches[1].attributes[2].value = 8;
    res.branches[1].attributes[3].value = 2;
    res.branches[1].attributes[4].value = 2;
    res.branches[1].attributes[5].value = 2;
    res.branches[1].attributes[6].value = 17;

    res.attributes = res.branches[1].attributes;

    return res;
  },
  getPet6x1: function getPet6x1() {
    const res = itemData[ItemsMainCategoriesType.OTHER].find((i) => i.name === 'Wyvern') as any;

    res.branches[1].attributes[0].value = 3;
    res.branches[1].attributes[1].value = 10;
    res.branches[1].attributes[2].value = 20;
    res.branches[1].attributes[3].value = 5;
    res.branches[1].attributes[4].value = 5;
    res.branches[1].attributes[5].value = 5;
    res.branches[1].attributes[6].value = 18;

    res.attributes = res.branches[1].attributes;

    return res;
  },
  getPet6x2: function getPet6x2() {
    const res = itemData[ItemsMainCategoriesType.OTHER].find((i) => i.name === 'Wyvern') as any;

    res.branches[1].attributes[0].value = 4;
    res.branches[1].attributes[1].value = 7;
    res.branches[1].attributes[2].value = 16;
    res.branches[1].attributes[3].value = 4;
    res.branches[1].attributes[4].value = 4;
    res.branches[1].attributes[5].value = 4;
    res.branches[1].attributes[6].value = 18;

    res.attributes = res.branches[1].attributes;

    return res;
  },
  getPet6x3: function getPet6x3() {
    const res = itemData[ItemsMainCategoriesType.OTHER].find((i) => i.name === 'Wyvern') as any;

    res.branches[1].attributes[0].value = 5;
    res.branches[1].attributes[1].value = 5;
    res.branches[1].attributes[2].value = 12;
    res.branches[1].attributes[3].value = 3;
    res.branches[1].attributes[4].value = 3;
    res.branches[1].attributes[5].value = 3;
    res.branches[1].attributes[6].value = 18;

    res.attributes = res.branches[1].attributes;

    return res;
  },
  getPet6x4: function getPet6x4() {
    const res = itemData[ItemsMainCategoriesType.OTHER].find((i) => i.name === 'Wyvern') as any;

    res.branches[1].attributes[0].value = 6;
    res.branches[1].attributes[1].value = 3;
    res.branches[1].attributes[2].value = 8;
    res.branches[1].attributes[3].value = 2;
    res.branches[1].attributes[4].value = 2;
    res.branches[1].attributes[5].value = 2;
    res.branches[1].attributes[6].value = 18;

    res.attributes = res.branches[1].attributes;

    return res;
  },
  getPet7x1: function getPet7x1() {
    const res = itemData[ItemsMainCategoriesType.OTHER].find((i) => i.name === 'Forest Turtle') as any;

    res.branches[1].attributes[0].value = 3;
    res.branches[1].attributes[1].value = 10;
    res.branches[1].attributes[2].value = 20;
    res.branches[1].attributes[3].value = 5;
    res.branches[1].attributes[4].value = 5;
    res.branches[1].attributes[5].value = 5;
    res.branches[1].attributes[6].value = 19;

    res.attributes = res.branches[1].attributes;

    return res;
  },
  getPet7x2: function getPet7x2() {
    const res = itemData[ItemsMainCategoriesType.OTHER].find((i) => i.name === 'Forest Turtle') as any;

    res.branches[1].attributes[0].value = 4;
    res.branches[1].attributes[1].value = 7;
    res.branches[1].attributes[2].value = 16;
    res.branches[1].attributes[3].value = 4;
    res.branches[1].attributes[4].value = 4;
    res.branches[1].attributes[5].value = 4;
    res.branches[1].attributes[6].value = 19;

    res.attributes = res.branches[1].attributes;

    return res;
  },
  getPet7x3: function getPet7x3() {
    const res = itemData[ItemsMainCategoriesType.OTHER].find((i) => i.name === 'Forest Turtle') as any;

    res.branches[1].attributes[0].value = 5;
    res.branches[1].attributes[1].value = 5;
    res.branches[1].attributes[2].value = 12;
    res.branches[1].attributes[3].value = 3;
    res.branches[1].attributes[4].value = 3;
    res.branches[1].attributes[5].value = 3;
    res.branches[1].attributes[6].value = 19;

    res.attributes = res.branches[1].attributes;

    return res;
  },
  getPet7x4: function getPet7x4() {
    const res = itemData[ItemsMainCategoriesType.OTHER].find((i) => i.name === 'Forest Turtle') as any;

    res.branches[1].attributes[0].value = 6;
    res.branches[1].attributes[1].value = 3;
    res.branches[1].attributes[2].value = 8;
    res.branches[1].attributes[3].value = 2;
    res.branches[1].attributes[4].value = 2;
    res.branches[1].attributes[5].value = 2;
    res.branches[1].attributes[6].value = 19;

    res.attributes = res.branches[1].attributes;

    return res;
  },
};

for (let i = 0; i <= 7; i++) {
  for (let j = 1; j <= 4; j++) {
    const _tokenId = getTokenIdFromItem(petFuncs[`getPet${i}x${j}`]());
    // console.log(_tokenId)
  }
}

function getCraftingScroll() {
  const res = itemData[ItemsMainCategoriesType.OTHER].find((i) => i.name === 'Crafting Competition Winner') as any;

  res.attributes = res.branches[1].attributes;

  console.log(res);

  return res;
}

function getWeapon1() {
  const res = itemData[ItemsMainCategoriesType.OTHER].find((i) => i.name === 'Elder') as any;

  res.branches[1].attributes[0].value = 5;
  res.branches[1].attributes[1].value = 40;
  res.branches[1].attributes[2].value = 2;
  res.branches[1].attributes[3].value = 4;
  res.branches[1].attributes[4].value = 2;
  res.branches[1].attributes[5].value = 10;
  res.branches[1].attributes[6].value = 11;
  res.branches[1].attributes[7].value = 7;

  res.attributes = res.branches[1].attributes;

  console.log(res);

  return res;
}

function getWeapon2() {
  const res = itemData[ItemsMainCategoriesType.OTHER].find((i) => i.name === 'Wrath') as any;

  res.branches[1].attributes[0].value = 5;
  res.branches[1].attributes[1].value = 4;
  res.branches[1].attributes[2].value = 10;
  res.branches[1].attributes[3].value = 4;
  res.branches[1].attributes[4].value = 2;
  res.branches[1].attributes[5].value = 10;
  res.branches[1].attributes[6].value = 8;
  res.branches[1].attributes[7].value = 6;

  res.attributes = res.branches[1].attributes;

  console.log(res);

  return res;
}

function getItem1() {
  const res = itemData[ItemsMainCategoriesType.OTHER].find((i) => i.name === "General's Medallion") as any;

  res.branches[1].attributes[0].value = 3;
  res.branches[1].attributes[1].value = 4;
  res.branches[1].attributes[2].value = 20;

  res.attributes = res.branches[1].attributes;

  console.log(res);

  return res;
}

function getItem2() {
  const res = itemData[ItemsMainCategoriesType.OTHER].find((i) => i.name === "General's Medallion") as any;

  res.branches[1].attributes[0].value = 4;
  res.branches[1].attributes[1].value = 3;
  res.branches[1].attributes[2].value = 15;

  res.attributes = res.branches[1].attributes;

  console.log(res);

  return res;
}

function getItem3() {
  const res = itemData[ItemsMainCategoriesType.OTHER].find((i) => i.name === "General's Medallion") as any;

  res.branches[1].attributes[0].value = 5;
  res.branches[1].attributes[1].value = 2;
  res.branches[1].attributes[2].value = 10;

  res.attributes = res.branches[1].attributes;

  console.log(res);

  return res;
}

function getItem4() {
  const res = itemData[ItemsMainCategoriesType.OTHER].find((i) => i.name === "Scholar's Codex") as any;

  res.branches[1].attributes[0].value = 3;
  res.branches[1].attributes[1].value = 4;
  res.branches[1].attributes[2].value = 20;

  res.attributes = res.branches[1].attributes;

  console.log(res);

  return res;
}

function getItem5() {
  const res = itemData[ItemsMainCategoriesType.OTHER].find((i) => i.name === "Scholar's Codex") as any;

  res.branches[1].attributes[0].value = 4;
  res.branches[1].attributes[1].value = 3;
  res.branches[1].attributes[2].value = 15;

  res.attributes = res.branches[1].attributes;

  console.log(res);

  return res;
}

function getItem6() {
  const res = itemData[ItemsMainCategoriesType.OTHER].find((i) => i.name === "Scholar's Codex") as any;

  res.branches[1].attributes[0].value = 5;
  res.branches[1].attributes[1].value = 2;
  res.branches[1].attributes[2].value = 10;

  res.attributes = res.branches[1].attributes;

  console.log(res);

  return res;
}

function getItem7() {
  const res = itemData[ItemsMainCategoriesType.OTHER].find((i) => i.name === "Scholar's Codex") as any;

  res.branches[1].attributes[0].value = 6;
  res.branches[1].attributes[1].value = 1;
  res.branches[1].attributes[2].value = 5;

  res.attributes = res.branches[1].attributes;

  console.log(res);

  return res;
}

function getItem8() {
  const res = itemData[ItemsMainCategoriesType.OTHER].find((i) => i.name === "General's Medallion") as any;

  res.branches[1].attributes[0].value = 6;
  res.branches[1].attributes[1].value = 1;
  res.branches[1].attributes[2].value = 5;

  res.attributes = res.branches[1].attributes;

  console.log(res);

  return res;
}

function getItemCompetitionCertificate() {
  const res = itemData[ItemsMainCategoriesType.OTHER].find((i) => i.name === 'Crafting Competition Certificate') as any;

  res.branches[1].attributes[0].value = 1;

  res.attributes = res.branches[1].attributes;

  console.log(res);

  return res;
}

function getItemTrinket() {
  const res = itemData[ItemsMainCategoriesType.OTHER].find((i) => i.name === 'Seed of Rebirth') as any;

  res.branches[1].attributes[0].value = 3;
  res.branches[1].attributes[1].value = 2;
  res.branches[1].attributes[2].value = 20;
  res.branches[1].attributes[3].value = 2;

  res.attributes = res.branches[1].attributes;

  // console.log(res)

  return res;
}

// { ...ItemAttributesByName[1].Rarity, min: 3, max: 6, map: ItemRarityNameById },
// { ...ItemAttributesByName[1].HarvestYield, min: 2, max: 5 },
// { ...ItemAttributesByName[1].RemoveFees, min: 20, max: 50 },
// { ...ItemAttributesByName[1].MagicFind, min: 10, max: 20 },
// { ...ItemAttributesByName[1].FindShard, min: 10, max: 10 },
function getDragonlight() {
  const res = JSON.parse(
    JSON.stringify(itemData[ItemsMainCategoriesType.OTHER].find((i) => i.name === 'Dragonlight') as any)
  );

  res.branches[1].attributes[0].value = 3;
  res.branches[1].attributes[1].value = 5;
  res.branches[1].attributes[2].value = 50;
  res.branches[1].attributes[3].value = 20;
  res.branches[1].attributes[4].value = 10;

  res.attributes = res.branches[1].attributes;

  // console.log(res)

  return res;
}

function getGaze() {
  const res = JSON.parse(
    JSON.stringify(itemData[ItemsMainCategoriesType.OTHER].find((i) => i.name === 'Vampire Gaze') as any)
  );
  res.branches[3].attributes[0].value = 3;
  res.branches[3].attributes[1].value = 100;
  res.branches[3].attributes[2].value = 5;
  res.branches[3].attributes[4].value = 8;
  res.branches[3].attributes[5].value = 8;
  res.branches[3].attributes[6].value = 20;
  res.branches[3].attributes[7].value = 5;

  res.attributes = res.branches[3].attributes;

  return res;
}

function getEgg() {
  const res = JSON.parse(
    JSON.stringify(itemData[ItemsMainCategoriesType.OTHER].find((i) => i.name === 'Mysterious Rune') as any)
  );
  res.branches[3].attributes[0].value = 2;

  res.attributes = res.branches[3].attributes;

  return res;
}

function getCube() {
  const res = JSON.parse(
    JSON.stringify(itemData[ItemsMainCategoriesType.OTHER].find((i) => i.name === "Early Access Founder's Cube") as any)
  );

  res.attributes = res.branches[3].attributes;

  return res;
}

function getMercy() {
  const res = JSON.parse(
    JSON.stringify(itemData[ItemsMainCategoriesType.OTHER].find((i) => i.name === 'Mercy') as any)
  );
  res.branches[3].attributes[0].value = 7;
  res.branches[3].attributes[1].value = 15;
  res.branches[3].attributes[2].value = 1;
  res.branches[3].attributes[3].value = 0;
  res.branches[3].attributes[4].value = 15;
  res.branches[3].attributes[5].value = 3;
  res.branches[3].attributes[6].value = 24;
  res.branches[3].attributes[7].value = 6;

  res.attributes = res.branches[3].attributes;

  return res;
}

const latest = getMercy();

const presets = {
  latest,
};

const Container = styled.div``;

const ItemCard = styled(Card)`
  position: relative;
  overflow: hidden;
  font-weight: bold;

  border-width: 18px 6px;
  border-style: solid;
  border-color: transparent;
  border-image-source: url(/images/puzzle_bars.png);
  border-image-slice: 25% fill;
  border-image-width: 100px 100px;
  background: none;
  // transform: scale(0.8);
  text-shadow: 1px 1px 1px black;
  // box-shadow: 0 2px 0 0 rgb(0 0 0 / 80%), inset 0 -1px 0 0 rgb(0 0 0 / 10%), 0 0 66px 66px rgb(0 0 0 / 10%);
  filter: contrast(1.08);
  padding: 30px 80px;

  & > div {
    position: relative;
    z-index: 2;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
  }
`;

const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;

  & > div {
    grid-column: span 6;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 6;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 6;
    }
  }
`;

presets.latest.tokenId = getTokenIdFromItem(presets.latest);

presets.latest = decodeItem(presets.latest.tokenId);
presets.latest.branch = 2;

const Creator = () => {
  const [id, setId] = useState(0);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [quantity, setQuantity] = useState('0');
  const [runeword, setRuneform] = useState('');
  const [type, setType] = useState('');
  const [desc, setDesc] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [attribute1Min, setAttribute1Min] = useState('');
  const [attribute1Max, setAttribute1Max] = useState('');
  const [attribute1Value, setAttribute1Value] = useState('');
  const [attribute1Name, setAttribute1Name] = useState('');
  const [attribute2Min, setAttribute2Min] = useState('');
  const [attribute2Max, setAttribute2Max] = useState('');
  const [attribute2Value, setAttribute2Value] = useState('');
  const [attribute2Name, setAttribute2Name] = useState('');
  const [attribute3Min, setAttribute3Min] = useState('');
  const [attribute3Max, setAttribute3Max] = useState('');
  const [attribute3Value, setAttribute3Value] = useState('');
  const [attribute3Name, setAttribute3Name] = useState('');
  const [itemJson, setItemJson] = useState('');
  const [itemBase, setItemBase] = useState({});

  const GlobalStyles = createGlobalStyle`
  input, textarea {
    text-transform: none;
  }
  `;

  const loadItem = (data) => {
    setItemBase(data);
    setId(data.id);
    setName(data.name);
    setIcon(data.icon);
    setQuantity(data.quantity);
    setRuneform(data.details['Rune Word']);
    setType(data.details['Type']);
    setDesc(data.branches[1].description);
    setTokenId(data.tokenId);

    if (data.attributes[0]) {
      setAttribute1Min(data.attributes[0].min);
      setAttribute1Max(data.attributes[0].max);
      setAttribute1Value(data.attributes[0].value);
      setAttribute1Name(data.attributes[0].name);
    }

    if (data.attributes[1]) {
      setAttribute2Min(data.attributes[1].min);
      setAttribute2Max(data.attributes[1].max);
      setAttribute2Value(data.attributes[1].value);
      setAttribute2Name(data.attributes[1].name);
    }

    if (data.attributes[2]) {
      setAttribute3Min(data.attributes[2].min);
      setAttribute3Max(data.attributes[2].max);
      setAttribute3Value(data.attributes[2].value);
      setAttribute3Name(data.attributes[2].name);
    }
  };

  const item = {
    branches: {
      1: {
        description: [desc],
        attributes: [],
      },
      2: {
        description: desc,
        attributes: [],
      },
      3: {
        description: desc,
        attributes: [],
      },
      4: {
        description: desc,
        attributes: [],
      },
    },
    attributes: [],
    isNew: true,
    isEquipable: true,
    isTradeable: true,
    isTransferable: true,
    isCraftable: false,
    isDisabled: false,
    details: {
      Type: type,
      'Rune Word': runeword,
    },
    recipe: {
      requirement: [
        { id: 4, quantity: 1 },
        { id: 2, quantity: 1 },
        { id: 3, quantity: 1 },
        { id: 1, quantity: 1 },
      ],
    },
    id,
    name,
    tokenId,
    category: ItemCategoriesType.WEAPON,
    icon,
    value: quantity,
    ...itemBase,
  };
  if (attribute1Name) {
    item.attributes.push({
      id: 1,
      min: attribute1Min,
      max: attribute1Max,
      value: attribute1Value,
      name: attribute1Name,
    });
  }
  if (attribute2Name) {
    item.attributes.push({
      id: 1,
      min: attribute2Min,
      max: attribute2Max,
      value: attribute2Value,
      name: attribute2Name,
    });
  }
  if (attribute3Name) {
    item.attributes.push({
      id: 1,
      min: attribute3Min,
      max: attribute3Max,
      value: attribute3Value,
      name: attribute3Name,
    });
  }

  return (
    <Page>
      <GlobalStyles />
      <Container>
        <Card>
          <CardBody>
            {/* <Button onClick={() => loadItem(presets.goose)}>Load Goose</Button>{' '}
            <Button onClick={() => loadItem(presets.fury)}>Load Fury</Button>{' '}
            <Button onClick={() => loadItem(presets.steel)}>Load Steel</Button>{' '}
            <Button onClick={() => loadItem(presets.lorekeeper)}>Load Lorekeeper</Button>{' '}
            <Button onClick={() => loadItem(presets.shard)}>Load Shard</Button> */}
            <Button onClick={() => loadItem(presets.latest)}>Latest</Button>
          </CardBody>
        </Card>
        <br />
        <Cards>
          <Card>
            <CardBody>
              <Heading size="xl" mb="24px">
                Creator
              </Heading>
              ID:
              <br />
              <input type="text" value={id} onChange={(e) => setId(parseInt(e.target.value))} />
              <br />
              Name:
              <br />
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
              <br />
              Type:
              <br />
              <input type="text" value={type} onChange={(e) => setType(e.target.value)} />
              <br />
              Description:
              <br />
              <input type="text" value={desc} onChange={(e) => setDesc(e.target.value)} />
              <br />
              Rune Word:
              <br />
              <input type="text" value={runeword} onChange={(e) => setRuneform(e.target.value)} />
              <br />
              Token ID:
              <br />
              <input type="text" value={tokenId} onChange={(e) => setTokenId(e.target.value)} />
              <br />
              Icon URL:
              <br />
              <input type="text" value={icon} onChange={(e) => setIcon(e.target.value)} />
              <br />
              <br />
              Attribute 1 Min:
              <br />
              <input type="text" value={attribute1Min} onChange={(e) => setAttribute1Min(e.target.value)} />
              <br />
              Attribute 1 Max:
              <br />
              <input type="text" value={attribute1Max} onChange={(e) => setAttribute1Max(e.target.value)} />
              <br />
              Attribute 1 Value:
              <br />
              <input type="text" value={attribute1Value} onChange={(e) => setAttribute1Value(e.target.value)} />
              <br />
              Attribute 1 Name:
              <br />
              <input type="text" value={attribute1Name} onChange={(e) => setAttribute1Name(e.target.value)} />
              <br />
              <br />
              Attribute 2 Min:
              <br />
              <input type="text" value={attribute2Min} onChange={(e) => setAttribute2Min(e.target.value)} />
              <br />
              Attribute 2 Max:
              <br />
              <input type="text" value={attribute2Max} onChange={(e) => setAttribute2Max(e.target.value)} />
              <br />
              Attribute 2 Value:
              <br />
              <input type="text" value={attribute2Value} onChange={(e) => setAttribute2Value(e.target.value)} />
              <br />
              Attribute 2 Name:
              <br />
              <input type="text" value={attribute2Name} onChange={(e) => setAttribute2Name(e.target.value)} />
              <br />
              <br />
              Attribute 3 Min:
              <br />
              <input type="text" value={attribute3Min} onChange={(e) => setAttribute3Min(e.target.value)} />
              <br />
              Attribute 3 Max:
              <br />
              <input type="text" value={attribute3Max} onChange={(e) => setAttribute3Max(e.target.value)} />
              <br />
              Attribute 3 Value:
              <br />
              <input type="text" value={attribute3Value} onChange={(e) => setAttribute3Value(e.target.value)} />
              <br />
              Attribute 3 Name:
              <br />
              <input type="text" value={attribute3Name} onChange={(e) => setAttribute3Name(e.target.value)} />
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <ItemInformation
                price={0}
                item={itemJson ? JSON.parse(itemJson) : item}
                defaultBranch={presets.latest.branch || 0}
              />
            </CardBody>
          </Card>
        </Cards>
        <br />
        <Card>
          <CardBody>
            <h2>Data:</h2>
            <br />
            <textarea
              onChange={(e) => loadItem(JSON.parse(e.target.value))}
              rows={10}
              style={{ width: '100%' }}
              value={JSON.stringify(item, undefined, 2)}></textarea>
          </CardBody>
        </Card>
        <br />
        <Card>
          <CardBody>
            <h2>Examples:</h2>
            <br />
            <div onClick={() => setAttribute1Name(`+{min}-{max}% Farming Yield`)}>{`+{min}-{max}% Farming Yield`}</div>
            <div onClick={() => setAttribute1Name(`+{min}-{max}% Harvest Fee`)}>{`+{min}-{max}% Harvest Fee`}</div>
            <div onClick={() => setAttribute1Name(`+{min}-{max}% Harvest Burn`)}>{`+{min}-{max}% Harvest Burn`}</div>
            <div
              onClick={() => setAttribute1Name(`+{min}-{max}% Harvest Locked`)}>{`+{min}-{max}% Harvest Locked`}</div>
            <div
              onClick={() =>
                setAttribute1Name(`+{min}-{max}% Harvest Buy &amp; Lock LP`)
              }>{`+{min}-{max}% Harvest Buy &amp; Lock LP`}</div>
            <div
              onClick={() =>
                setAttribute1Name(`+{min}-{max}% Deposit Buy &amp; Lock LP`)
              }>{`+{min}-{max}% Deposit Buy &amp; Lock LP`}</div>
            <div onClick={() => setAttribute1Name(`+{min}-{max}H Harvest Delay`)}>{`+{min}-{max}H Harvest Delay`}</div>
            <div onClick={() => setAttribute1Name(`+{min}-{max}% Magic Find`)}>{`+{min}-{max}% Magic Find`}</div>
            <div
              onClick={() =>
                setAttribute1Name(`{min}-{max}% Early Release Fee`)
              }>{`{min}-{max}% Early Release Fee`}</div>
            <div
              onClick={() => setAttribute1Name(`Chance to Freeze Fees (1-24H)`)}>{`Chance to Freeze Fees (1-24H)`}</div>
            <div onClick={() => setAttribute1Name(`Chance of No Harvest`)}>{`Chance of No Harvest`}</div>
            <div
              onClick={() =>
                setAttribute1Name(`Chance to Add Harvest Delay (1-24H)`)
              }>{`Chance to Add Harvest Delay (1-24H)`}</div>
            <div
              onClick={() => setAttribute1Name(`Chance to Unlock Hidden Pool`)}>{`Chance to Unlock Hidden Pool`}</div>
            <div onClick={() => setAttribute1Name(`Chance To Fracture Item`)}>{`Chance To Fracture Item`}</div>
            <div
              onClick={() =>
                setAttribute1Name(`Chance to Find Worldstone Shard`)
              }>{`Chance to Find Worldstone Shard`}</div>
            <div
              onClick={() => setAttribute1Name(`Chance of Finding Guild Token`)}>{`Chance of Finding Guild Token`}</div>
            <div onClick={() => setAttribute1Name(`Waived Transfer Fees`)}>{`Waived Transfer Fees`}</div>
            <div onClick={() => setAttribute1Name(`Random Rune Exchange`)}>{`Random Rune Exchange`}</div>
            <div
              onClick={() => setAttribute1Name(`Worldstone Shard Upon Harvest`)}>{`Worldstone Shard Upon Harvest`}</div>
            <div
              onClick={() =>
                setAttribute1Name(`Unable to use a certain runeword for a set time`)
              }>{`Unable to use a certain runeword for a set time`}</div>
            <div
              onClick={() =>
                setAttribute1Name(`Chance to Create Random Runeform`)
              }>{`Chance to Create Random Runeform`}</div>
            <div>
              -1% Harvest Fee to Random Raider: 1% of your harvest is given randomly to somebody else farming in your
              pool. Instead of it going to vault, you could get some extra random yield. Maybe even double your stack if
              it&apos;s a whale.
            </div>
            <div>+1 Fire Wall (Mage required): Fire Wall will harvest, burn 3% of yield, but abodivsh all fees.</div>
            <div>
              +1 Whirlwind (Warrior required): Whirldwind will harvest, exchange 3% of yielded rune for random runes.
            </div>
            <div>+1 Sanctuary Aura (Paladin required): Stake 100 RXS for 3 months. Abodivsh all fees.</div>
            <div>+1 Wolf Strike (assassin required): 50% chance to yield +10% or yield 0%</div>
            <div>+1 Deep Impact: 50% chance to yield 3 days, or lose everything</div>
            <div>
              +1 Sacrifice (necromancer): You lose 0.001% of your staked tokens per block, but gain 1% more harvest per
              block.
            </div>
          </CardBody>
        </Card>
      </Container>
    </Page>
  );
};

export default Creator;
