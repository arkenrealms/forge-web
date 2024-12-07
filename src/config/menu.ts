import { MenuEntry } from '~/components/Menu/types';

const arkenConfig: MenuEntry[] = [
  // {
  //   label: 'Home',
  //   icon: 'HomeIcon',
  //   href: '/',
  // },
  {
    label: 'About',
    icon: 'AccountIcon',
    href: '/about',
    items: [
      {
        label: 'Council',
        href: '/about/council',
      },
      {
        label: 'Tokenomics',
        href: '/about/tokenomics',
      },
      {
        label: 'Roadmap',
        href: '/about/roadmap',
      },
      {
        label: 'AI',
        href: '/about/ai',
      },
      // {
      //   label: 'FAQ',
      //   href: '/faq',
      // },
      {
        label: 'Stats',
        href: '/about/stats',
      },
      {
        label: 'Guilds',
        href: '/about/guilds',
      },
      {
        label: `Patch Notes`,
        href: '/about/updates',
      },
      {
        label: `Developer Portal`,
        href: '/about/developer',
      },
    ],
  },
  {
    label: 'Games',
    icon: 'CraftIcon',
    href: '/games',
    items: [
      {
        label: 'Evolution Isles',
        icon: 'EvolutionIcon',
        href: '/evolution',
      },
      {
        label: 'Infinite Arena',
        icon: 'InfiniteIcon',
        href: '/infinite',
      },
      {
        label: 'Heart of the Oasis',
        icon: 'SanctuaryIcon',
        href: '/oasis',
      },
    ],
  },
  {
    label: 'Realms',
    icon: 'MetaverseIcon',
    href: '/realms',
    initialOpenState: false,
    items: [
      {
        label: 'Fantasy Realm',
        href: '/realms/fantasy',
        items: [
          {
            label: 'Games',
            href: '/realms/fantasy/games',
            items: [
              {
                label: 'Evolution Isles',
                icon: 'EvolutionIcon',
                href: '/evolution',
              },
              {
                label: 'Infinite Arena',
                icon: 'EvolutionIcon',
                href: '/infinite',
              },
              {
                label: 'Heart of the Oasis',
                icon: 'EvolutionIcon',
                href: '/oasis',
              },
            ],
          },
        ],
      },
      {
        label: 'Meme Realm',
        href: '/realms/meme',
      },
    ],
  },
  {
    label: 'Evolution Isles',
    icon: 'EvolutionIcon',
    href: '/evolution',
    initialOpenState: false,
    items: [
      {
        label: 'Play Now',
        href: '/evolution/play',
      },
      {
        label: 'Tutorial',
        href: '/evolution/tutorial',
      },
      {
        label: 'Tournament',
        href: '/tournament',
      },
      {
        label: 'Leaderboard',
        // icon: 'InfoIcon',
        href: '/leaderboard',
      },
    ],
  },
  {
    label: 'Infinite Arena',
    icon: 'InfiniteIcon',
    href: '/infinite',
    initialOpenState: false,
    items: [
      {
        label: 'Preview',
        href: '/infinite/play',
      },
      {
        label: 'Tutorial',
        href: '/infinite/tutorial',
      },
    ],
  },
  {
    label: 'Heart of the Oasis',
    icon: 'SanctuaryIcon',
    href: '/oasis',
    initialOpenState: false,
    items: [
      {
        label: 'Preview',
        href: '/oasis/play',
      },
      {
        label: 'World',
        href: '/lore',
      },
      {
        label: 'Energies',
        href: '/energies',
      },
      {
        label: 'Areas',
        href: '/areas',
      },
      {
        label: 'NPCs',
        href: '/npcs',
      },
      {
        label: 'Eras',
        href: '/eras',
      },
      {
        label: 'Acts',
        href: '/acts',
      },
      // {
      //   label: 'Bosses',
      //   href: '/bosses',
      // },
      // {
      //   label: 'Monsters',
      //   href: '/monsters',
      // },
      // {
      //   label: 'Creatures',
      //   href: '/creatures',
      // },
      {
        label: 'Races',
        href: '/races',
      },
      {
        label: 'Classes',
        href: '/classes',
      },
      {
        label: 'Factions',
        href: '/factions',
      },
      {
        label: 'Items',
        href: '/items',
      },
      // {
      //   label: 'Pets',
      //   href: '/pets',
      // },
      // {
      //   label: 'Skills',
      //   href: '/skills',
      // },
      {
        label: 'Runeforms',
        href: '/runeforms',
      },
      // {
      //   label: 'Mechanics',
      //   href: '/mechanics',
      // },
    ],
  },
  // {
  //   label: `Runic Raids`,
  //   icon: 'RaidIcon',
  //   initialOpenState: false,
  //   items: [
  //     {
  //       label: 'Play Now',
  //       href: '/raid',
  //     },
  //     {
  //       label: 'Getting Started',
  //       href: '/guide',
  //     },
  //     {
  //       label: 'Farms',
  //       href: '/farms',
  //     },
  //     {
  //       label: 'Pools',
  //       href: '/pools',
  //     },
  //     {
  //       label: 'Characters',
  //       href: '/characters',
  //     },
  //   ],
  // },
  // {
  //   label: 'Games',
  //   icon: 'SunIcon',
  //   initialOpenState: true,
  //   items: [
  //     {
  //       label: 'Runic Raids',
  //       href: '/raids',
  //     },
  //     {
  //       label: 'Evolution Isles',
  //       href: '/evolution',
  //     },
  //     {
  //       label: 'Infinite Arena',
  //       href: '/infinite',
  //     },
  //     {
  //       label: 'Heart of the Oasis',
  //       href: '/oasis',
  //     },
  //     {
  //       label: 'Return to the Oasis',
  //       href: '/return',
  //     },
  //     {
  //       label: 'Meme Isles',
  //       href: '/isles',
  //     },
  //   ],
  // },
  {
    label: 'Trade',
    icon: 'TradeIcon',
    initialOpenState: true,
    items: [
      {
        label: 'Swap Currency',
        href: '/swap',
      },
      {
        label: 'Item Market',
        href: '/market',
      },
      {
        label: 'Item Explorer',
        href: '/catalog',
      },
      // {
      //   label: 'Add/Remove Liquidity',
      //   href: '/swap/pool',
      // },
    ],
  },
  {
    label: 'Craft',
    icon: 'CraftIcon',
    initialOpenState: false,
    items: [
      {
        label: 'Craft Items',
        href: '/craft',
      },
      {
        label: 'View Runes',
        href: '/runes',
      },
      {
        label: 'Transmute Items',
        href: '/transmute',
      },
      // {
      //   label: 'Leaderboard',
      //   href: '/leaderboard?tab=0&subtab=0',
      // },
    ],
  },
  {
    label: 'Account',
    icon: 'AccountIcon',
    initialOpenState: false,
    items: [
      {
        label: 'Inventory',
        href: '/account',
      },
      {
        label: 'Achievements',
        href: '/account/achievements',
      },
      {
        label: 'Quests',
        href: '/account/quests',
      },
      {
        label: 'Public Profile',
        href: '/account/public',
      },
    ],
  },
  // {
  //   label: 'My Profile',
  //   icon: 'TicketIcon',
  //   href: '/profile',
  // },
  // {
  //   label: 'Referrals',
  //   icon: 'GroupsIcon',
  //   href: '/refer',
  // },
  // {
  //   label: 'Runes',
  //   icon: 'NftIcon',
  //   items: [
  //     {
  //       label: 'EL',
  //       href: '/runes/el',
  //     },
  //     {
  //       label: 'ELD',
  //       href: '/runes/eld',
  //     },
  //     {
  //       label: 'TIR',
  //       href: '/runes/tir',
  //     },
  //     {
  //       label: 'NEF',
  //       href: '/runes/nef',
  //     },
  //     {
  //       label: 'ITH',
  //       href: '/runes/ith',
  //     },
  //     {
  //       label: 'TAL',
  //       href: '/runes/tal',
  //     },
  //     {
  //       label: 'RAL',
  //       href: '/runes/ral',
  //     },
  //     {
  //       label: 'ORT',
  //       href: '/runes/ort',
  //     },
  //     {
  //       label: 'THUL',
  //       href: '/runes/thul',
  //     },
  //     {
  //       label: 'AMN',
  //       href: '/runes/amn',
  //     },
  //     {
  //       label: 'SOL',
  //       href: '/runes/sol',
  //     },
  //     {
  //       label: 'SHAEL',
  //       href: '/runes/shael',
  //     },
  //     {
  //       label: 'DOL',
  //       href: '/runes/dol',
  //     },
  //     {
  //       label: 'HEL',
  //       href: '/runes/hel',
  //     },
  //     {
  //       label: 'IO',
  //       href: '/runes/io',
  //     },
  //     {
  //       label: 'LUM',
  //       href: '/runes/lum',
  //     },
  //     {
  //       label: 'KO',
  //       href: '/runes/ko',
  //     },
  //     {
  //       label: 'FAL',
  //       href: '/runes/fal',
  //     },
  //     {
  //       label: 'LEM',
  //       href: '/runes/lem',
  //     },
  //     {
  //       label: 'PUL',
  //       href: '/runes/pul',
  //     },
  //     {
  //       label: 'UM',
  //       href: '/runes/um',
  //     },
  //     {
  //       label: 'MAL',
  //       href: '/runes/mal',
  //     },
  //     {
  //       label: 'IST',
  //       href: '/runes/ist',
  //     },
  //     {
  //       label: 'GUL',
  //       href: '/runes/gul',
  //     },
  //     {
  //       label: 'VEX',
  //       href: '/runes/vex',
  //     },
  //     {
  //       label: 'OHM',
  //       href: '/runes/ohm',
  //     },
  //     {
  //       label: 'LO',
  //       href: '/runes/lo',
  //     },
  //     {
  //       label: 'SUR',
  //       href: '/runes/sur',
  //     },
  //     {
  //       label: 'BER',
  //       href: '/runes/ber',
  //     },
  //     {
  //       label: 'JAH',
  //       href: '/runes/jah',
  //     },
  //     {
  //       label: 'CHAM',
  //       href: '/runes/cham',
  //     },
  //     {
  //       label: 'ZOD',
  //       href: '/runes/zod',
  //     },
  //   ],
  // },
  // {
  //   label: 'Runeforms',
  //   icon: 'NftIcon',
  //   items: [
  //     {
  //       label: 'Steel',
  //       href: '/crafting/steel',
  //     },
  //     {
  //       label: 'Fury',
  //       href: '/crafting/fury',
  //     },
  //     {
  //       label: 'Lorekeeper',
  //       href: '/crafting/lorekeeper',
  //     },
  //   ],
  // },
  // {
  //   label: 'Marketplace',
  //   icon: 'NftIcon',
  //   href: '/marketplace',
  // },
  // {
  //   label: 'Links',
  //   icon: 'InfoIcon',
  //   items: [
  //     {
  //       label: 'Trade: Arken Swap',
  //       href: '/swap',
  //     },
  //     {
  //       label: 'Trade: PancakeSwap',
  //       href: 'https://exchange.pancakeswap.finance/#/swap?inputCurrency=0xa9776b590bfc2f956711b3419910a5ec1f63153e',
  //     },
  //     // {
  //     //   label: 'CoinGecko (TODO)',
  //     //   href: 'https://www.coingecko.com/en/coins/rune-farm',
  //     // },
  //     // {
  //     //   label: 'CoinMarketCap (TODO)',
  //     //   href: 'https://coinmarketcap.com/currencies/rune-farm/',
  //     // },
  //     {
  //       label: 'Chart: AstroTools',
  //       href: 'https://app.astrotools.io/pancake-pair-explorer/0xf9444c39bbdcc3673033609204f8da00d1ae3f52',
  //     },
  //     {
  //       label: 'Chart: Swapp',
  //       href: 'https://goswapp-bsc.web.app/0xa9776b590bfc2f956711b3419910a5ec1f63153e',
  //     },
  //     {
  //       label: 'Chart: Poo',
  //       href: 'https://poocoin.app/tokens/0xa9776b590bfc2f956711b3419910a5ec1f63153e',
  //     },
  //   ],
  // },
  {
    label: 'More',
    icon: 'MoreIcon',
    initialOpenState: false,
    items: [
      // {
      //   label: 'Governance',
      //   href: '/governance',
      // },
      // {
      //   label: 'Polls',
      //   href: '/polls',
      // },
      // {
      //   label: 'Bounties',
      //   href: '/bounties',
      // },
      // {
      //   label: 'Press',
      //   href: '/press',
      // },
      // {
      //   label: 'Docs',
      //   href: '/docs',
      // },
      // {
      //   label: 'Transparency',
      //   href: '/transparency',
      // },
      // {
      //   label: 'Risks',
      //   href: '/risks',
      // },
      // {
      //   label: 'Terms & Conditions',
      //   href: '/terms',
      // },
      // {
      //   label: 'Blog',
      //   href: 'https://ArkenRealms.medium.com',
      // },
      {
        label: 'Github',
        href: 'https://github.arken.gg',
      },
      {
        label: 'Discord',
        href: 'https://discord.arken.gg/',
      },
      {
        label: 'Twitch',
        href: 'https://twitch.arken.gg',
      },
    ],
  },
  // {
  //   label: `V${info.version}`,
  //   icon: 'SunIcon',
  //   href: '/',
  // },
];

const evoConfig: MenuEntry[] = [
  {
    label: 'Home',
    icon: 'HomeIcon',
    href: '/',
  },
  {
    label: 'Evolution',
    icon: 'EvolutionIcon',
    href: '/evolution',
    initialOpenState: true,
    items: [
      {
        label: 'Play Now',
        href: '/evolution',
      },
      {
        label: 'Tutorial',
        href: '/evolution/tutorial',
      },
      {
        label: 'Tournament',
        href: '/tournament',
      },
      {
        label: 'Leaderboard',
        // icon: 'InfoIcon',
        href: '/leaderboard',
      },
    ],
  },
  {
    label: 'Account',
    icon: 'AccountIcon',
    initialOpenState: false,
    items: [
      {
        label: 'Inventory',
        href: '/account',
      },
      {
        label: 'Achievements',
        href: '/account/achievements',
      },
      {
        label: 'Quests',
        href: '/account/quests',
      },
      {
        label: 'Public Profile',
        href: '/account/public',
      },
    ],
  },
  {
    label: 'More',
    icon: 'MoreIcon',
    initialOpenState: false,
    items: [
      {
        label: 'Settings',
        href: '/settings',
      },
      {
        label: 'Terms & Conditions',
        href: '/terms',
      },
      {
        label: 'Blog',
        href: 'https://ArkenRealms.medium.com',
      },
      {
        label: 'Github',
        href: 'https://github.arken.gg',
      },
      {
        label: 'Discord',
        href: 'https://discord.arken.gg/',
      },
      {
        label: 'Twitch',
        href: 'https://twitch.arken.gg',
      },
    ],
  },
];

const infiniteConfig: MenuEntry[] = [
  {
    label: 'Home',
    icon: 'HomeIcon',
    href: '/',
  },
  {
    label: 'Infinite',
    icon: 'InfiniteIcon',
    href: '/',
    initialOpenState: true,
    items: [
      {
        label: 'Tutorial',
        href: '/infinite/tutorial',
      },
    ],
  },
  {
    label: 'Account',
    icon: 'AccountIcon',
    initialOpenState: false,
    items: [
      {
        label: 'Inventory',
        href: '/account',
      },
      {
        label: 'Achievements',
        href: '/account/achievements',
      },
      {
        label: 'Quests',
        href: '/account/quests',
      },
      {
        label: 'Public Profile',
        href: '/account/public',
      },
    ],
  },
  {
    label: 'More',
    icon: 'MoreIcon',
    initialOpenState: false,
    items: [
      {
        label: 'Settings',
        href: '/settings',
      },
      {
        label: 'Terms & Conditions',
        href: '/terms',
      },
      {
        label: 'Github',
        href: 'https://github.arken.gg',
      },
      {
        label: 'Discord',
        href: 'https://discord.arken.gg/',
      },
      {
        label: 'Twitch',
        href: 'https://twitch.arken.gg',
      },
    ],
  },
];

const raidConfig: MenuEntry[] = [
  // {
  //   label: 'Home',
  //   icon: 'HomeIcon',
  //   href: '/',
  // },
  {
    label: 'Arken Legacy',
    icon: 'TradeIcon',
    initialOpenState: true,
    items: [
      {
        label: 'Swap',
        href: '/swap',
      },
      {
        label: 'Inventory',
        href: '/account',
      },
      {
        label: 'Raids',
        href: '/farms',
      },
      {
        label: 'Pools',
        href: '/pools',
      },
      {
        label: 'Bounties',
        href: '/bounties',
      },
      // {
      //   label: 'World Firsts',
      //   href: '/bounties',
      // },
      // {
      //   label: 'Item Market',
      //   href: '/market',
      // },
      // {
      //   label: 'Item Catalog',
      //   href: '/catalog',
      // },
      // {
      //   label: 'Add/Remove Liquidity',
      //   href: '/swap/pool',
      // },
    ],
  },
  // {
  //   label: 'Raid',
  //   icon: 'RaidIcon',
  //   href: '/',
  //   initialOpenState: true,
  //   items: [
  //     // {
  //     //   label: 'Play Now',
  //     //   href: '/raid',
  //     // },
  //     // {
  //     //   label: 'Getting Started',
  //     //   href: '/guide',
  //     // },
  //     {
  //       label: 'Farms',
  //       href: '/farms',
  //     },
  //     {
  //       label: 'Pools',
  //       href: '/pools',
  //     },
  //   ],
  // },
  // {
  //   label: 'Account',
  //   icon: 'AccountIcon',
  //   initialOpenState: false,
  //   items: [
  //     {
  //       label: 'Inventory',
  //       href: '/account',
  //     },
  //     // {
  //     //   label: 'Achievements',
  //     //   href: '/account/achievements',
  //     // },
  //     // {
  //     //   label: 'Quests',
  //     //   href: '/account/quests',
  //     // },
  //     // {
  //     //   label: 'Public Profile',
  //     //   href: '/account/public',
  //     // },
  //   ],
  // },
  {
    label: 'More',
    icon: 'MoreIcon',
    initialOpenState: false,
    items: [
      // {
      //   label: 'Settings',
      //   href: '/settings',
      // },
      // {
      //   label: 'Terms & Conditions',
      //   href: '/terms',
      // },
      {
        label: 'Github',
        href: 'https://github.arken.gg/',
      },
      {
        label: 'Discord',
        href: 'https://discord.arken.gg/',
      },
      {
        label: 'Twitch',
        href: 'https://twitch.arken.gg/',
      },
    ],
  },
];

const sanctuaryConfig: MenuEntry[] = [
  {
    label: 'Home',
    icon: 'HomeIcon',
    href: '/',
  },
  {
    label: 'Sanctuary',
    icon: 'SanctuaryIcon',
    href: '/',
    initialOpenState: true,
    items: [
      {
        label: 'World',
        href: '/lore',
      },
      {
        label: 'Energies',
        href: '/energies',
      },
      {
        label: 'Areas',
        href: '/areas',
      },
      {
        label: 'NPCs',
        href: '/npcs',
      },
      {
        label: 'Eras',
        href: '/eras',
      },
      {
        label: 'Acts',
        href: '/acts',
      },
      // {
      //   label: 'Bosses',
      //   href: '/bosses',
      // },
      // {
      //   label: 'Monsters',
      //   href: '/monsters',
      // },
      // {
      //   label: 'Creatures',
      //   href: '/creatures',
      // },
      {
        label: 'Races',
        href: '/races',
      },
      {
        label: 'Classes',
        href: '/classes',
      },
      {
        label: 'Factions',
        href: '/factions',
      },
      {
        label: 'Items',
        href: '/items',
      },
      // {
      //   label: 'Pets',
      //   href: '/pets',
      // },
      // {
      //   label: 'Skills',
      //   href: '/skills',
      // },
      {
        label: 'Runeforms',
        href: '/runeforms',
      },
      // {
      //   label: 'Mechanics',
      //   href: '/mechanics',
      // },
    ],
  },
  // {
  //   label: 'Account',
  //   icon: 'AccountIcon',
  //   initialOpenState: false,
  //   items: [
  //     {
  //       label: 'Inventory',
  //       href: '/account',
  //     },
  //     {
  //       label: 'Achievements',
  //       href: '/account/achievements',
  //     },
  //     {
  //       label: 'Quests',
  //       href: '/account/quests',
  //     },
  //     {
  //       label: 'Public Profile',
  //       href: '/account/public',
  //     },
  //   ],
  // },
  {
    label: 'More',
    icon: 'MoreIcon',
    initialOpenState: false,
    items: [
      // {
      //   label: 'Settings',
      //   href: '/settings',
      // },
      // {
      //   label: 'Terms & Conditions',
      //   href: '/terms',
      // },
      {
        label: 'Github',
        href: 'https://github.arken.gg',
      },
      {
        label: 'Discord',
        href: 'https://discord.arken.gg/',
      },
      {
        label: 'Twitch',
        href: 'https://twitch.arken.gg',
      },
    ],
  },
];

const guardiansConfig: MenuEntry[] = [
  {
    label: 'Home',
    icon: 'HomeIcon',
    href: '/',
  },
  {
    label: 'Guardians',
    icon: 'GuardiansIcon',
    href: '/',
    initialOpenState: true,
    items: [
      {
        label: 'Preview',
        href: '/',
      },
    ],
  },
  {
    label: 'Account',
    icon: 'AccountIcon',
    initialOpenState: false,
    items: [
      {
        label: 'Inventory',
        href: '/account',
      },
      {
        label: 'Achievements',
        href: '/account/achievements',
      },
      {
        label: 'Quests',
        href: '/account/quests',
      },
      {
        label: 'Public Profile',
        href: '/account/public',
      },
    ],
  },
  {
    label: 'More',
    icon: 'MoreIcon',
    initialOpenState: false,
    items: [
      {
        label: 'Settings',
        href: '/settings',
      },
      {
        label: 'Terms & Conditions',
        href: '/terms',
      },
      {
        label: 'Github',
        href: 'https://github.arken.gg',
      },
      {
        label: 'Discord',
        href: 'https://discord.arken.gg/',
      },
      {
        label: 'Twitch',
        href: 'https://twitch.arken.gg',
      },
    ],
  },
];

const islesConfig: MenuEntry[] = [
  {
    label: 'Home',
    icon: 'HomeIcon',
    href: '/',
  },
  {
    label: 'Evolution',
    icon: 'EvolutionIcon',
    href: '/evolution',
    initialOpenState: true,
    items: [
      {
        label: 'Play Now',
        href: '/evolution',
      },
      {
        label: 'Tutorial',
        href: '/evolution/tutorial',
      },
      {
        label: 'Tournament',
        href: '/tournament',
      },
      {
        label: 'Leaderboard',
        // icon: 'InfoIcon',
        href: '/leaderboard',
      },
    ],
  },
  {
    label: 'Account',
    icon: 'AccountIcon',
    initialOpenState: false,
    items: [
      {
        label: 'Inventory',
        href: '/account',
      },
      {
        label: 'Achievements',
        href: '/account/achievements',
      },
      {
        label: 'Quests',
        href: '/account/quests',
      },
      {
        label: 'Public Profile',
        href: '/account/public',
      },
    ],
  },
  {
    label: 'More',
    icon: 'MoreIcon',
    initialOpenState: false,
    items: [
      {
        label: 'Settings',
        href: '/settings',
      },
      {
        label: 'Terms & Conditions',
        href: '/terms',
      },
      {
        label: 'Blog',
        href: 'https://ArkenRealms.medium.com',
      },
      {
        label: 'Github',
        href: 'https://github.arken.gg',
      },
      {
        label: 'Discord',
        href: 'https://discord.arken.gg/',
      },
      {
        label: 'Twitch',
        href: 'https://twitch.arken.gg',
      },
    ],
  },
];

const returnConfig: MenuEntry[] = [
  {
    label: 'Organization',
    icon: 'CompanyIcon',
    initialOpenState: false,
    items: [
      {
        label: 'Brands', // -> has api key // -> hasmany profiles // can be Admin, Mod, etc.
        href: '/service/brands',
      },
      {
        label: 'News', // Send Newsletter / Publish to Site
        href: '/service/news',
      },
    ],
  },
  {
    label: 'Play',
    icon: 'InfiniteIcon',
    initialOpenState: false,
    items: [
      {
        label: 'Games', // -> Game Info // -> linked to Product // show sessions and what realm+server it happened on / Manage Releases
        href: '/service/games',
      },
      {
        label: 'Realms', // -> hasmany Servers
        href: '/service/realms',
      },
      {
        label: 'Matchmaking',
        href: '/service/matchmaking',
      },
      {
        label: 'Trades', // linked to crypto Transaction, can be type offer
        href: '/service/trades',
      },
      {
        label: 'Environments', // production, staging, development, early-access -> json editor for settings fuck it
        href: '/service/environments',
      },
    ],
  },
  {
    label: 'Access',
    icon: 'TicketIcon',
    initialOpenState: false,
    items: [
      {
        label: 'Accounts', // -> has api key // -> hasmany profiles // can be Admin, Mod, etc.
        href: '/service/accounts',
      },
      {
        label: 'Profiles',
        href: '/service/profiles',
      },
      {
        label: 'Licenses',
        href: '/service/licenses',
      },
      {
        label: 'Launchers', // patch notes
        href: '/service/launchers',
      },
      {
        label: 'Legal',
        href: '/service/legal',
      },
    ],
  },
  {
    label: 'Content',
    icon: 'SanctuaryIcon',
    initialOpenState: false,
    items: [
      {
        label: 'Universes',
        href: '/service/game/universes',
      },
      {
        label: 'Galaxies',
        href: '/service/game/galaxies',
      },
      {
        label: 'Planets',
        href: '/service/game/planets',
      },
      {
        label: 'Stars',
        href: '/service/game/stars',
      },
      {
        label: 'Areas',
        href: '/service/game/areas',
      },
      {
        label: 'Cities',
        href: '/service/game/cities',
      },
      {
        label: 'Factions',
        href: '/service/game/factions',
      },
      {
        label: 'Eras',
        href: '/service/game/eras',
      },
      {
        label: 'NPCs', // is a Character
        href: '/service/game/npcs',
      },
      {
        label: 'Characters',
        href: '/service/game/characters',
      },
      {
        label: 'Lore',
        href: '/service/game/lore',
      },
      {
        label: 'Quests',
        href: '/service/game/quests',
      },
      {
        label: 'Achievements',
        href: '/service/game/achievements',
      },
      {
        label: 'Classes',
        href: '/service/game/classes',
      },
      {
        label: 'Skills',
        href: '/service/game/skills',
      },
      {
        label: 'Items', // Skin |
        href: '/service/game/items',
      },
    ],
  },
  {
    label: 'Crypto',
    icon: 'MetaverseIcon',
    initialOpenState: false,
    items: [
      {
        label: 'DAOs', // -> Proposals
        href: '/crypto/daos',
      },
      {
        label: 'NFTs', // -> Linked to GameItem
        href: '/crypto/nfts',
      },
      {
        label: 'Tokens', // -> linked to Currency
        href: '/crypto/tokens',
      },
      {
        label: 'Transactions', // -> linked to Trade
        href: '/crypto/transactions',
      },
      {
        label: 'Exchanges', // hasMany Transactions
        href: '/crypto/exchanges',
      },
      {
        label: 'Validators',
        href: '/crypto/validators',
      },
    ],
  },
  {
    label: 'Commerce',
    icon: 'CraftIcon',
    initialOpenState: false,
    items: [
      {
        label: 'Products', // hasmany reviews // has many dlc
        href: '/service/products',
      },
      {
        label: 'DLC',
        href: '/services/dlc',
      },
      {
        label: 'Orders',
        href: '/service/orders',
      },
      {
        label: 'Payments',
        href: '/service/payments',
      },
      {
        label: 'Currencies',
        href: '/service/currencies',
      },
    ],
  },
  {
    label: 'Engagement',
    icon: 'AccountIcon',
    initialOpenState: false,
    items: [
      {
        label: 'Seasons', // season passes
        href: '/service/seasons',
      },
      {
        label: 'Tournaments',
        href: '/service/tournaments',
      },
      {
        label: 'Raffles',
        href: '/service/raffles',
      },
      {
        label: 'Polls', // -> Linked to DAO proposal // -> has many votes (connected to profile)
        href: '/service/polls',
      },
      {
        label: 'Live', // Connect twitch / show whats happening
        href: '/service/live',
      },
    ],
  },
  {
    label: 'Social',
    icon: 'GroupsIcon',
    initialOpenState: false,
    items: [
      {
        label: 'Lobbies', // -> Discussions
        href: '/service/lobbies',
      },
      {
        label: 'Guilds',
        href: '/service/guilds',
      },
      {
        label: 'Bounties',
        href: '/service/bounties',
      },
      {
        label: 'Referrals',
        href: '/service/referrals',
      },
      {
        label: 'Connections', // twitter / facebook / etc
        href: '/service/social-connections',
      },
    ],
  },
  // {
  //   label: 'Monetization',
  //   icon: 'IfoIcon',
  //   initialOpenState: false,
  //   items: [
  //     {
  //       label: 'DLC',
  //       href: '/services/dlc',
  //     },
  //   ],
  // },
  {
    label: 'Storage',
    icon: 'PoolIcon',
    initialOpenState: false,
    items: [
      {
        label: 'Cloud Data',
        href: '/services/cloud',
      },
    ],
  },
  {
    label: 'Insights',
    icon: 'SunIcon',
    initialOpenState: false,
    items: [
      {
        label: 'Telemetry',
        href: '/service/telemetry',
      },
      // {
      //   label: 'Analytics',
      //   href: '/service/analytics',
      // },
      {
        label: 'Trends',
        href: '/service/trends',
      },
    ],
  },
  {
    label: 'Development',
    icon: 'MoonIcon',
    initialOpenState: false,
    items: [
      {
        label: 'APIs',
        href: '/service/apis',
      },
      {
        label: 'Open Source',
        href: 'https://github.arken.gg',
      },
      {
        label: 'Help',
        href: 'https://arken.gg/developer',
      },
    ],
  },
];

export default {
  arken: arkenConfig,
  evolution: evoConfig,
  infinite: infiniteConfig,
  sanctuary: sanctuaryConfig,
  raids: raidConfig,
  isles: islesConfig,
  rune: raidConfig,
  guardians: guardiansConfig,
  return: returnConfig,
};
