// import { ItemCategoriesType, ItemsPage } from 'rune-backend-sdk/build/data/items.type'
// import { ItemsMainCategoriesType } from 'rune-backend-sdk/build/data/items.type'

// export const emptyItem = {
//   name: '',
//   icon: '',
//   value: '',
//   description: '',
//   attributes: [],
//   category: ItemCategoriesType.RUNE,
// }

// const getItems = (items, itemsPerPage, showCategories = null, showUnobtained = false): ItemsPage[] => {
//   const itemsGrid = [
//     // { items: [], mainCategory: ItemsMainCategoriesType.RUNES, page: 0 },
//     // { items: [], mainCategory: ItemsMainCategoriesType.WEAPONS, page: 1 },
//     // { items: [], mainCategory: ItemsMainCategoriesType.SHIELDS, page: 2 },
//     // { items: [], mainCategory: ItemsMainCategoriesType.ARMORS, page: 3 },
//     // { items: [], mainCategory: ItemsMainCategoriesType.ACCESSORIES, page: 4 },
//   ]

//   let page = 0

//   const categories = showCategories
//     ? showCategories
//     : [
//         ItemsMainCategoriesType.RUNES as ItemsMainCategoriesType,
//         ItemsMainCategoriesType.WEAPONS as ItemsMainCategoriesType,
//         ItemsMainCategoriesType.SHIELDS as ItemsMainCategoriesType,
//         ItemsMainCategoriesType.ARMORS as ItemsMainCategoriesType,
//         ItemsMainCategoriesType.ACCESSORIES as ItemsMainCategoriesType,
//       ]

//   for (const mainItemsCategory of categories) {
//     // // @ts-ignore
//     // const newPage = items[mainItemsCategory].slice(0, itemsPerPage).concat(
//     //   new Array(Math.max(40 - items[mainItemsCategory].length, 0)).fill(emptyItem),
//     // )
//     // itemsGrid.push({
//     //   items: newPage,
//     //   mainCategory: mainItemsCategory,
//     //   page: 0,
//     // })

//     if (!items[mainItemsCategory]) continue

//     const filteredItems = showUnobtained
//       ? items[mainItemsCategory]
//       : items[mainItemsCategory].filter((i) => parseFloat(i.value) > 0)

//     if (!filteredItems.length) {
//       itemsGrid[page] = {
//         items: new Array(itemsPerPage).fill(emptyItem),
//         mainCategory: mainItemsCategory as ItemsMainCategoriesType,
//         page,
//       }
//       page++
//     }

//     for (let i = 0, l = Math.ceil(filteredItems.length / itemsPerPage); i < l; i++) {
//       // @ts-ignore
//       const newPage = filteredItems.slice(i * itemsPerPage, i * itemsPerPage + itemsPerPage)

//       if (newPage.length === 0) continue

//       // .concat(
//       //   new Array(itemsPerPage - items[mainItemsCategory].slice(i * itemsPerPage, itemsPerPage).length).fill(emptyItem),
//       // )

//       itemsGrid[page] = {
//         items:
//           mainItemsCategory === ItemsMainCategoriesType.RUNES
//             ? newPage
//             : newPage.concat(new Array(itemsPerPage - newPage.length).fill(emptyItem)),
//         mainCategory: mainItemsCategory as ItemsMainCategoriesType,
//         page,
//       }

//       page++
//     }
//   }

//   return itemsGrid
// }

// export default getItems
