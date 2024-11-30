import { Button } from '~/components/Button';
import React, { lazy, useState } from 'react';
import history from '~/routerHistory';
import AboutIcon from '../assets/images/icons/guardians.png';
import Home from '../views';
import useWeb3 from './useWeb3';

const Farms = lazy(() => import(/* webpackChunkName: "ViewsFarm" */ '~/views/farms'));
const Guide = lazy(() => import('../views/guide'));
const Clear = lazy(() => import('../views/clear'));
const RXS = lazy(() => import('../views/rxs'));
const First = lazy(() => import('../views/first'));
const ItemAttributes = lazy(() => import('../views/item-attributes'));
const Art = lazy(() => import('../views/art'));
const AI = lazy(() => import('../views/ai'));
const DAO = lazy(() => import('../views/dao'));
const MarketTrade = lazy(() => import('../views/trade'));
const Guilds = lazy(() => import('../views/guilds'));
const Cube = lazy(() => import('../views/cube'));
const Creature = lazy(() => import('../views/creature'));
const News = lazy(() => import('../views/news'));
const Interfaces = lazy(() => import('../views/interfaces'));
const InterfaceTemplates = lazy(() => import('../views/interface/templates'));
const InterfaceGroups = lazy(() => import('../views/interface/groups'));
const Bounties = lazy(() => import('../views/bounties'));
const Support = lazy(() => import('../views/support'));
const ClassDesigner = lazy(() => import('../views/class-designer'));
const Settings = lazy(() => import('../views/settings'));
const Special = lazy(() => import('../views/special'));
const Account = lazy(() => import('../views/account'));
const AccountInventory = lazy(() => import('../views/account/inventory'));
const AccountPublic = lazy(() => import('../views/account/public'));
const AccountQuests = lazy(() => import('../views/account/quests'));
const AccountAchievements = lazy(() => import('../views/account/achievements'));
const AccountRewards = lazy(() => import('../views/account/rewards'));
const AccountStats = lazy(() => import('../views/account/stats'));
const AccountCreation = lazy(() => import('../views/account/signup'));
const AccountLink = lazy(() => import('../views/account/link'));
const Creator = lazy(() => import('../views/service/creator'));
const Whitepaper = lazy(() => import('../views/whitepaper'));
const Token = lazy(() => import('../views/token'));
const Polls = lazy(() => import('../views/polls'));
const Risks = lazy(() => import('../views/risks'));
const Terms = lazy(() => import('../views/terms'));
const Guides = lazy(() => import('../views/guides'));
const InterfaceDesigner = lazy(() => import('../components/InterfaceDesigner'));
const Features = lazy(() => import('../views/features'));
const Tokenomics = lazy(() => import('../views/tokenomics'));
const Faq = lazy(() => import('../views/faq'));
const Docs = lazy(() => import('../views/docs'));
const Developers = lazy(() => import('../views/developers'));
const Community = lazy(() => import('../views/community'));
const About = lazy(() => import('../views/about'));
const Roadmap = lazy(() => import('../views/roadmap'));
const Sign = lazy(() => import('../views/sign'));
const MarketWatch = lazy(() => import('../views/market-watch'));
const Craft = lazy(() => import('../views/craft'));
const Characters = lazy(() => import('../views/characters'));
const Transmute = lazy(() => import('../views/transmute'));
const Stats = lazy(() => import('../views/stats'));
const User = lazy(() => import('../views/user'));
const Expert = lazy(() => import('../views/expert'));
const Mod = lazy(() => import('../views/mod'));
const Gambling = lazy(() => import('../views/gambling'));
const Replay = lazy(() => import('../views/replay'));
const Download = lazy(() => import('../views/download'));
const Verify = lazy(() => import('../views/verify'));
const Claims = lazy(() => import('../views/claims'));
const Distro = lazy(() => import('../views/distro'));
const Sitemap = lazy(() => import('../views/sitemap'));
// const Marketplace = lazy(() => import('../views/Marketplace'))
const Market = lazy(() => import('../views/market'));
const Updates = lazy(() => import('../views/updates'));
const Team = lazy(() => import('../views/team'));
const Register = lazy(() => import('../views/register'));
const Guild = lazy(() => import('../views/guild'));
const Press = lazy(() => import('../views/press'));
const Refer = lazy(() => import('../views/refer'));
const Catalog = lazy(() => import('../views/catalog'));
const CatalogItem = lazy(() => import('../views/catalog/item'));
const Lore = lazy(() => import('../views/lore'));
const Links = lazy(() => import('../views/links'));
const Vote = lazy(() => import('../views/vote'));
const Newsletter = lazy(() => import('../views/newsletter'));
const Shards = lazy(() => import('../views/shards'));
const Play = lazy(() => import('../views/games'));
const Subverses = lazy(() => import('../views/subverses'));
const Metaverse = lazy(() => import('../views/metaverse'));
const Infinite = lazy(() => import('../views/infinite'));
const InfiniteTutorial = lazy(() => import('../views/infinite/tutorial'));
const Evolution = lazy(() => import('../views/evolution'));
const EvolutionTutorial = lazy(() => import('../views/evolution/tutorial'));
const MemeIsles = lazy(() => import('../views/isles'));
const Raid = lazy(() => import('../views/raid'));
const RaidTutorial = lazy(() => import('../views/raid'));
const Sanctuary = lazy(() => import('../views/sanctuary'));
const Energies = lazy(() => import('../views/sanctuary/energies'));
const Areas = lazy(() => import('../views/sanctuary/areas'));
const NPCs = lazy(() => import('../views/sanctuary/npcs'));
const Eras = lazy(() => import('../views/sanctuary/eras'));
const Acts = lazy(() => import('../views/sanctuary/acts'));
const Bosses = lazy(() => import('../views/sanctuary/bosses'));
const Monsters = lazy(() => import('../views/sanctuary/monsters'));
const Races = lazy(() => import('../views/sanctuary/races'));
const Factions = lazy(() => import('../views/sanctuary/factions'));
const Area = lazy(() => import('../views/sanctuary/area'));
const GuideConvertBinanceCube = lazy(() => import('../views/guides/convert-binance-cube'));
const GuideChangeCharacterGuild = lazy(() => import('../views/guides/change-character-guild'));
const NPC = lazy(() => import('../views/sanctuary/npc'));
const Era = lazy(() => import('../views/sanctuary/era'));
const Act = lazy(() => import('../views/sanctuary/act'));
const Boss = lazy(() => import('../views/sanctuary/boss'));
const Monster = lazy(() => import('../views/sanctuary/monster'));
const Race = lazy(() => import('../views/sanctuary/race'));
const Faction = lazy(() => import('../views/sanctuary/faction'));
const Classes = lazy(() => import('../views/sanctuary/classes'));
const Classs = lazy(() => import('../views/sanctuary/class'));
const Items = lazy(() => import('../views/sanctuary/items'));
const ItemTypes = lazy(() => import('../views/sanctuary/item-types'));
const Skills = lazy(() => import('../views/sanctuary/skills'));
const Mechanics = lazy(() => import('../views/sanctuary/mechanics'));
const Runeforms = lazy(() => import('../views/sanctuary/runeforms'));
const SanctuaryTutorial = lazy(() => import('../views/sanctuary/tutorial'));
const Guardians = lazy(() => import('../views/guardians'));
const GuardiansTutorial = lazy(() => import('../views/guardians/tutorial'));
const Pools = lazy(() => import('../views/pools'));
const Leaderboard = lazy(() => import('../views/leaderboard'));
const Rune = lazy(() => import('../views/rune'));
const Tournament = lazy(() => import('../views/tournament'));
const Transparency = lazy(() => import('../views/transparency'));
const Live = lazy(() => import('../views/live'));
const Royale = lazy(() => import('../views/royale'));
const Swap = lazy(() => import('../views/swap'));
const SwapRemoveLiquidity = lazy(() => import('../views/swap/remove/_currencyIdA'));
const SwapAddLiquidity = lazy(() => import('../views/swap/add/_currencyIdA'));
const SwapPool = lazy(() => import('../views/swap/pool'));
const SwapPoolFinder = lazy(() => import('../views/swap/find'));
const Services = lazy(() => import('../views/services'));
const ServiceMetaverses = lazy(() => import('../views/service/metaverses'));
const ServiceReferrals = lazy(() => import('../views/service/referrals'));
const ServicePayments = lazy(() => import('../views/service/payments'));
const ServiceRealms = lazy(() => import('../views/service/realms'));
const ServiceRealm = lazy(() => import('../views/service/realm'));
const ServiceGames = lazy(() => import('../views/service/games'));
const ServiceGame = lazy(() => import('../views/service/game'));
const ServiceAccounts = lazy(() => import('../views/service/accounts'));
const ServiceProfiles = lazy(() => import('../views/service/profiles'));
const CryptoTransactions = lazy(() => import('../views/crypto/transactions'));

const AirdropCmc1Rules = lazy(() => import('../views/airdrop/cmc1/rules'));
const AirdropCmc1Winners = lazy(() => import('../views/airdrop/cmc1/winners'));
const AirdropCmc2Winners = lazy(() => import('../views/airdrop/cmc2/winners'));

const useWindows = () => {
  const { address } = useWeb3();
  const [pendingPageUpdate, setPendingPageUpdate] = useState(undefined);
  const [currentRouteIndex, setCurrentRouteIndex] = useState(1001);

  const [pageState, setPageState] = useState([
    {
      path: '/',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Home',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined, //900,
      component: Home,
      showable: false,
    },
    // {

    //   path: '/desktop',
    //   icon: AboutIcon,
    //   exact: true,
    //   strict: false,
    //   persist: false,
    //   props: {
    // title: 'Desktop',
    //     routeIndex: 1000,
    //     open: false,
    //     minimized: false,
    //     active: false,
    // windowSize: { width: '100%', height: '100%' },
    // windowPosition: { x: 0, y: 0 },
    //     location: {
    //       search: null,
    //     },
    //   },
    //   navPosition: undefined,
    //   component: Desktop,
    //   x: 0,
    //   y: 0,
    //   showable: true,
    // },
    {
      path: '/jp',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Home',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined, //900,
      component: Home,
      showable: false,
    },
    {
      path: '/cn',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Home',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined, //900,
      component: Home,
      showable: false,
    },
    {
      path: '/de',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Home',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined, //900,
      component: Home,
      showable: false,
    },
    {
      path: '/es',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Home',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined, //900,
      component: Home,
      showable: false,
    },
    {
      path: '/fr',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Home',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined, //900,
      component: Home,
      showable: false,
    },
    {
      path: '/vi',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Home',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined, //900,
      component: Home,
      showable: false,
    },
    {
      path: '/sv',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Home',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined, //900,
      component: Home,
      showable: false,
    },
    {
      path: '/whitepaper',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Whitepaper',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Whitepaper,
      showable: true,
    },
    {
      path: '/stats',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Stats',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Stats,
      showable: true,
    },
    {
      path: '/rxs',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: '$RXS',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: RXS,
      showable: true,
    },
    {
      path: '/item-attributes',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Item Attributes',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: ItemAttributes,
      showable: true,
    },
    {
      path: '/first',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'First',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: First,
      showable: true,
    },
    {
      path: '/features',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Features',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Features,
      showable: true,
    },
    {
      path: '/runes',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Runes',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Rune,
      showable: true,
    },
    {
      path: '/runes/:id',
      icon: AboutIcon,
      exact: false,
      strict: false,
      persist: false,
      props: {
        title: 'Runes',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Rune,
      showable: false,
    },
    {
      path: '/guild/:id',
      icon: AboutIcon,
      exact: false,
      strict: false,
      persist: false,
      props: {
        title: 'Guild',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Guild,
      showable: false,
    },
    {
      path: '/user/:id/account',
      icon: AboutIcon,
      exact: false,
      strict: false,
      persist: false,
      props: {
        title: 'User Account',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Account,
      showable: false,
    },
    {
      path: '/user/:id/achievements',
      icon: AboutIcon,
      exact: false,
      strict: false,
      persist: false,
      props: {
        title: 'User Achievements',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: AccountAchievements,
      showable: false,
    },
    {
      path: '/user/:id/quests',
      icon: AboutIcon,
      exact: false,
      strict: false,
      persist: false,
      props: {
        title: 'User Quests',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: AccountQuests,
      showable: false,
    },
    {
      path: '/user/:id/inventory',
      icon: AboutIcon,
      exact: false,
      strict: false,
      persist: false,
      props: {
        title: 'User Inventory',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: AccountInventory,
      showable: false,
    },
    {
      path: '/user/:id/rewards',
      icon: AboutIcon,
      exact: false,
      strict: false,
      persist: false,
      props: {
        title: 'User Rewards',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: AccountRewards,
      showable: false,
    },
    {
      path: '/user/:id/stats',
      icon: AboutIcon,
      exact: false,
      strict: false,
      persist: false,
      props: {
        title: 'User Stats',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: AccountStats,
      showable: false,
    },
    {
      path: '/user/:id',
      icon: AboutIcon,
      exact: false,
      strict: false,
      persist: false,
      props: {
        title: 'User',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: User,
      showable: false,
    },
    {
      path: '/token/:id',
      icon: AboutIcon,
      exact: false,
      strict: false,
      persist: false,
      props: {
        title: 'Token',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Token,
      showable: false,
    },
    {
      path: '/catalog',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Catalog',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Catalog,
      showable: true,
    },
    {
      path: '/item/:id',
      icon: AboutIcon,
      exact: false,
      strict: false,
      persist: false,
      props: {
        title: 'Item',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: CatalogItem,
      showable: false,
    },
    {
      path: '/raid',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Raid',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined, //401,
      component: Raid,
      showable: true,
    },
    {
      path: '/isles',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Meme Isles',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined, //500,
      component: MemeIsles,
      showable: true,
    },
    {
      path: '/evolution',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Evolution',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined, //500,
      component: Evolution,
      showable: true,
    },
    {
      path: '/services',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Services',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined, //500,
      component: Services,
      showable: false,
    },
    {
      path: '/crypto/transactions',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Transactions',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined, //500,
      component: CryptoTransactions,
      showable: false,
    },
    {
      path: '/service/realms',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Realms',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined, //500,
      component: ServiceRealms,
      showable: false,
    },
    {
      path: '/service/realm/:id',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Realm',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined, //500,
      component: ServiceRealm,
      showable: false,
    },
    {
      path: '/service/games',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Games',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined, //500,
      component: ServiceGames,
      showable: false,
    },
    {
      path: '/service/game/:id',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Game',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined, //500,
      component: ServiceGame,
      showable: false,
    },
    {
      path: '/service/game/eras',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Game Eras',
        interfaceKey: 'game-eras',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined, //500,
      component: InterfaceDesigner,
      showable: false,
    },
    {
      path: '/service/metaverses',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Metaverses',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined, //500,
      component: ServiceMetaverses,
      showable: false,
    },
    {
      path: '/service/referrals',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Referrals',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined, //500,
      component: ServiceReferrals,
      showable: false,
    },
    {
      path: '/service/payments',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Payments',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined, //500,
      component: ServicePayments,
      showable: false,
    },
    {
      path: '/service/accounts',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Accounts',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined, //500,
      component: ServiceAccounts,
      showable: false,
    },
    {
      path: '/service/profiles',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Profiles',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined, //500,
      component: ServiceProfiles,
      showable: false,
    },
    {
      path: '/sanctuary',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Sanctuary',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined, //400,
      component: Sanctuary,
      toolbarNav: (subnav, setSubnav) => (
        <>
          {/* <Button scale="sm" variant="text" className={subnav === 'sanctuary-getting-started' ? 'active' : ''} onClick={() => setSubnav('sanctuary-getting-started')}>
            Getting Started
          </Button> */}
          <Button scale="sm" variant="text" onClick={() => setSubnav('sanctuary-lore')}>
            Lore
          </Button>
          <Button scale="sm" variant="text" onClick={() => history.push('/areas')}>
            Areas
          </Button>
          <Button scale="sm" variant="text" onClick={() => history.push('/npcs')}>
            NPCs
          </Button>
          <Button scale="sm" variant="text" onClick={() => history.push('/eras')}>
            Eras
          </Button>
          <Button scale="sm" variant="text" onClick={() => history.push('/races')}>
            Races
          </Button>
          <Button scale="sm" variant="text" onClick={() => history.push('/factions')}>
            Factions
          </Button>
          <Button scale="sm" variant="text" onClick={() => history.push('/classes')}>
            Classes
          </Button>
          <Button scale="sm" variant="text" onClick={() => history.push('/energies')}>
            Energies
          </Button>
          <Button scale="sm" variant="text" onClick={() => setSubnav('items')}>
            Items
          </Button>
        </>
      ),
      showable: true,
    },
    {
      path: '/characters',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Characters',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Characters,
      showable: true,
    },
    {
      path: '/clear',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Clear',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Clear,
      showable: true,
    },
    {
      path: '/ai',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'AI',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: AI,
      showable: true,
    },
    {
      path: '/dao',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'DAO',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: 0.9,
      component: DAO,
      showable: true,
    },
    {
      path: '/news',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'News',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: News,
      showable: true,
    },
    {
      path: '/art',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Art',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Art,
      showable: true,
    },
    {
      path: '/settings',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Settings',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Settings,
      showable: true,
    },
    {
      path: '/special',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Special',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Special,
      showable: true,
    },
    {
      path: '/guides',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Guides',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Guides,
      showable: true,
    },
    {
      path: '/guide/convert-binance-cube',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Convert Binance Cube',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: GuideConvertBinanceCube,
      showable: true,
    },
    {
      path: '/guide/change-character-guild',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Change Character Guild',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: GuideChangeCharacterGuild,
      showable: true,
    },
    {
      path: '/live',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Live',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: 1,
      component: Live,
      showable: true,
    },
    {
      path: '/royale',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Royale',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Royale,
      showable: true,
    },
    {
      path: '/account/signup',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Sign Up',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: AccountCreation,
      showable: true,
    },
    {
      path: '/account/link',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Link Account',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: AccountLink,
      showable: false,
    },
    {
      path: '/account',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Account',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Account,
      showable: true,
    },
    {
      path: '/account/inventory',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Inventory',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: 100,
      component: AccountInventory,
      showable: true,
    },
    {
      path: '/account/public',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Public Profile',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: 201,
      component: AccountPublic,
      showable: false,
    },
    {
      path: '/account/quests',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Quests',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: AccountQuests,
      showable: true,
    },
    {
      path: '/account/achievements',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Achievements',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: AccountAchievements,
      showable: true,
    },
    {
      path: '/account/rewards',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Rewards',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: AccountRewards,
      showable: true,
    },
    {
      path: '/account/stats',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Stats',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: AccountStats,
      showable: true,
    },
    {
      path: '/bounties',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Bounties',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Bounties,
      showable: false,
    },
    {
      path: '/cube',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: "Founder's Cube",
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Cube,
      showable: false,
    },
    {
      path: '/craft',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Craft',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: 201,
      component: Craft,
      showable: true,
    },
    {
      path: '/games',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Play',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: 700,
      component: Play,
      showable: true,
    },
    {
      path: '/subverses',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Play',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Subverses,
      showable: true,
    },
    {
      path: '/market',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Market',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: 300,
      component: Market,
      showable: true,
    },
    {
      path: '/lore',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Lore',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: 200,
      toolbarNav: (subnav, setSubnav) => (
        <>
          <Button scale="sm" variant="text" onClick={() => setSubnav('sanctuary-lore')}>
            Lore
          </Button>
          <Button scale="sm" variant="text" onClick={() => history.push('/areas')}>
            Areas
          </Button>
          <Button scale="sm" variant="text" onClick={() => history.push('/npcs')}>
            NPCs
          </Button>
          <Button scale="sm" variant="text" onClick={() => history.push('/eras')}>
            Eras
          </Button>
          <Button scale="sm" variant="text" onClick={() => history.push('/races')}>
            Races
          </Button>
          <Button scale="sm" variant="text" onClick={() => history.push('/factions')}>
            Factions
          </Button>
          <Button scale="sm" variant="text" onClick={() => history.push('/classes')}>
            Classes
          </Button>
          <Button scale="sm" variant="text" onClick={() => history.push('/energies')}>
            Energies
          </Button>
          <Button scale="sm" variant="text" onClick={() => setSubnav('items')}>
            Items
          </Button>
        </>
      ),
      component: Lore,
      showable: true,
    },
    // // {

    // //   path: '/nexus',
    // //   icon: AboutIcon,
    // //   exact: true,
    // //   strict: false,
    // //   persist: false,
    // //   props: {
    // // title: 'Lore',
    // //     routeIndex: 1000,
    // //     open: false,
    // //     minimized: false,
    // //     active: false,
    // // windowSize: { width: '100%', height: '100%' },
    // // windowPosition: { x: 0, y: 0 },
    // //     location: {
    // //       search: null,
    // //     },
    // //   },
    // //   navPosition: 200,
    // //   component: Nexus,
    // //   x: 0,
    // //   y: 0,
    // //   showable: true,
    // // },
    {
      path: '/energies',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Energies',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      toolbarNav: (subnav, setSubnav) => (
        <>
          <Button scale="sm" variant="text" onClick={() => history.push('/lore')}>
            Lore
          </Button>
        </>
      ),
      navPosition: undefined,
      component: Energies,
      showable: true,
    },
    {
      path: '/areas',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Areas',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      toolbarNav: (subnav, setSubnav) => (
        <>
          <Button scale="sm" variant="text" onClick={() => history.push('/lore')}>
            Lore
          </Button>
        </>
      ),
      navPosition: undefined,
      component: Areas,
      showable: true,
    },
    {
      path: '/area/:id',
      icon: AboutIcon,
      exact: false,
      strict: false,
      persist: false,
      props: {
        title: 'Area',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      toolbarNav: (subnav, setSubnav) => (
        <>
          <Button scale="sm" variant="text" onClick={() => history.push('/lore')}>
            Lore
          </Button>
          <Button scale="sm" variant="text" onClick={() => history.push('/areas')}>
            Areas
          </Button>
        </>
      ),
      navPosition: undefined,
      component: Area,
      showable: false,
    },
    {
      path: '/creature/:id',
      icon: AboutIcon,
      exact: false,
      strict: false,
      persist: false,
      props: {
        title: 'Creature',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      toolbarNav: (subnav, setSubnav) => (
        <>
          <Button scale="sm" variant="text" onClick={() => history.push('/lore')}>
            Lore
          </Button>
          <Button scale="sm" variant="text" onClick={() => history.push('/creatures')}>
            Creatures
          </Button>
        </>
      ),
      navPosition: undefined,
      component: Creature,
      showable: false,
    },
    {
      path: '/npcs',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'NPCs',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      toolbarNav: (subnav, setSubnav) => (
        <>
          <Button scale="sm" variant="text" onClick={() => history.push('/lore')}>
            Lore
          </Button>
        </>
      ),
      navPosition: undefined,
      component: NPCs,
      showable: true,
    },
    {
      path: '/npc/:id',
      icon: AboutIcon,
      exact: false,
      strict: false,
      persist: false,
      props: {
        title: 'NPC',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      toolbarNav: (subnav, setSubnav) => (
        <>
          <Button scale="sm" variant="text" onClick={() => history.push('/lore')}>
            Lore
          </Button>
          <Button scale="sm" variant="text" onClick={() => history.push('/npcs')}>
            NPCs
          </Button>
        </>
      ),
      navPosition: undefined,
      component: NPC,
      showable: false,
    },
    {
      path: '/eras',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Eras',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      toolbarNav: (subnav, setSubnav) => (
        <>
          <Button scale="sm" variant="text" onClick={() => history.push('/lore')}>
            Lore
          </Button>
        </>
      ),
      navPosition: undefined,
      component: Eras,
      showable: true,
    },
    {
      path: '/era/:id',
      icon: AboutIcon,
      exact: false,
      strict: false,
      persist: false,
      props: {
        title: 'Era',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      toolbarNav: (subnav, setSubnav) => (
        <>
          <Button scale="sm" variant="text" onClick={() => history.push('/lore')}>
            Lore
          </Button>
          <Button scale="sm" variant="text" onClick={() => history.push('/eras')}>
            Eras
          </Button>
        </>
      ),
      navPosition: undefined,
      component: Era,
      showable: false,
    },
    {
      path: '/acts',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Acts',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      toolbarNav: (subnav, setSubnav) => (
        <>
          <Button scale="sm" variant="text" onClick={() => history.push('/lore')}>
            Lore
          </Button>
        </>
      ),
      navPosition: undefined,
      component: Acts,
      showable: true,
    },
    {
      path: '/act/:id',
      icon: AboutIcon,
      exact: false,
      strict: false,
      persist: false,
      props: {
        title: 'Act',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      toolbarNav: (subnav, setSubnav) => (
        <>
          <Button scale="sm" variant="text" onClick={() => history.push('/lore')}>
            Lore
          </Button>
          <Button scale="sm" variant="text" onClick={() => history.push('/acts')}>
            Acts
          </Button>
        </>
      ),
      navPosition: undefined,
      component: Act,
      showable: false,
    },
    {
      path: '/bosses',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Bosses',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      toolbarNav: (subnav, setSubnav) => (
        <>
          <Button scale="sm" variant="text" onClick={() => history.push('/lore')}>
            Lore
          </Button>
        </>
      ),
      navPosition: undefined,
      component: Bosses,
      showable: true,
    },
    {
      path: '/boss/:id',
      icon: AboutIcon,
      exact: false,
      strict: false,
      persist: false,
      props: {
        title: 'Boss',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      toolbarNav: (subnav, setSubnav) => (
        <>
          <Button scale="sm" variant="text" onClick={() => history.push('/lore')}>
            Lore
          </Button>
          <Button scale="sm" variant="text" onClick={() => history.push('/bosses')}>
            Bosses
          </Button>
        </>
      ),
      navPosition: undefined,
      component: Boss,
      showable: false,
    },
    {
      path: '/monsters',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Monsters',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      toolbarNav: (subnav, setSubnav) => (
        <>
          <Button scale="sm" variant="text" onClick={() => history.push('/lore')}>
            Lore
          </Button>
        </>
      ),
      navPosition: undefined,
      component: Monsters,
      showable: true,
    },
    {
      path: '/monster/:id',
      icon: AboutIcon,
      exact: false,
      strict: false,
      persist: false,
      props: {
        title: 'Monster',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      toolbarNav: (subnav, setSubnav) => (
        <>
          <Button scale="sm" variant="text" onClick={() => history.push('/lore')}>
            Lore
          </Button>
          <Button scale="sm" variant="text" onClick={() => history.push('/monsters')}>
            Monsters
          </Button>
        </>
      ),
      navPosition: undefined,
      component: Monster,
      showable: false,
    },
    {
      path: '/races',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Races',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      toolbarNav: (subnav, setSubnav) => (
        <>
          <Button scale="sm" variant="text" onClick={() => history.push('/lore')}>
            Lore
          </Button>
        </>
      ),
      navPosition: undefined,
      component: Races,
      showable: true,
    },
    {
      path: '/race/:id',
      icon: AboutIcon,
      exact: false,
      strict: false,
      persist: false,
      props: {
        title: 'Race',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      toolbarNav: (subnav, setSubnav) => (
        <>
          <Button scale="sm" variant="text" onClick={() => history.push('/lore')}>
            Lore
          </Button>
          <Button scale="sm" variant="text" onClick={() => history.push('/races')}>
            Races
          </Button>
        </>
      ),
      navPosition: undefined,
      component: Race,
      showable: false,
    },
    {
      path: '/factions',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Factions',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      toolbarNav: (subnav, setSubnav) => (
        <>
          <Button scale="sm" variant="text" onClick={() => history.push('/lore')}>
            Lore
          </Button>
        </>
      ),
      navPosition: undefined,
      component: Factions,
      showable: true,
    },
    {
      path: '/faction/:id',
      icon: AboutIcon,
      exact: false,
      strict: false,
      persist: false,
      props: {
        title: 'Faction',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      toolbarNav: (subnav, setSubnav) => (
        <>
          <Button scale="sm" variant="text" onClick={() => history.push('/lore')}>
            Lore
          </Button>
          <Button scale="sm" variant="text" onClick={() => history.push('/factions')}>
            Factions
          </Button>
        </>
      ),
      navPosition: undefined,
      component: Faction,
      showable: false,
    },
    {
      path: '/classes',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Classes',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      toolbarNav: (subnav, setSubnav) => (
        <>
          <Button scale="sm" variant="text" onClick={() => history.push('/lore')}>
            Lore
          </Button>
        </>
      ),
      navPosition: undefined,
      component: Classes,
      showable: true,
    },
    {
      path: '/class/:id',
      icon: AboutIcon,
      exact: false,
      strict: false,
      persist: false,
      props: {
        title: 'Class',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      toolbarNav: (subnav, setSubnav) => (
        <>
          <Button scale="sm" variant="text" onClick={() => history.push('/lore')}>
            Lore
          </Button>
          <Button scale="sm" variant="text" onClick={() => history.push('/classes')}>
            Classes
          </Button>
        </>
      ),
      navPosition: undefined,
      component: Classs,
      showable: false,
    },
    {
      path: '/items',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Items',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      toolbarNav: (subnav, setSubnav) => (
        <>
          <Button scale="sm" variant="text" onClick={() => history.push('/lore')}>
            Lore
          </Button>
        </>
      ),
      navPosition: undefined,
      component: Items,
      showable: true,
    },
    {
      path: '/item-types',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Item Types',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      toolbarNav: (subnav, setSubnav) => (
        <>
          <Button scale="sm" variant="text" onClick={() => history.push('/lore')}>
            Lore
          </Button>
        </>
      ),
      navPosition: undefined,
      component: ItemTypes,
      showable: true,
    },
    {
      path: '/skills',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Skills',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      toolbarNav: (subnav, setSubnav) => (
        <>
          <Button scale="sm" variant="text" onClick={() => history.push('/lore')}>
            Lore
          </Button>
        </>
      ),
      navPosition: undefined,
      component: Skills,
      showable: true,
    },
    {
      path: '/mechanics',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Mechanics',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      toolbarNav: (subnav, setSubnav) => (
        <>
          <Button scale="sm" variant="text" onClick={() => history.push('/lore')}>
            Lore
          </Button>
        </>
      ),
      navPosition: undefined,
      component: Mechanics,
      showable: true,
    },
    {
      path: '/runewords',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Runeforms',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      toolbarNav: (subnav, setSubnav) => (
        <>
          <Button scale="sm" variant="text" onClick={() => history.push('/lore')}>
            Lore
          </Button>
        </>
      ),
      navPosition: undefined,
      component: Runeforms,
      showable: true,
    },
    {
      path: '/links',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Links',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: 100,
      component: Links,
      showable: false,
    },
    {
      path: '/interfaces',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Interfaces',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: 100,
      component: Interfaces,
      showable: false,
    },
    {
      path: '/interface/templates',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Interface Templates',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: 100,
      component: InterfaceTemplates,
      showable: false,
    },
    {
      path: '/interface/groups',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Interface Groups',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: 100,
      component: InterfaceGroups,
      showable: false,
    },
    {
      path: '/vote',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Vote',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: 100,
      component: Vote,
      showable: false,
    },
    {
      path: '/expert',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Expert',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Expert,
      showable: true,
    },
    {
      path: '/guide',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Guide',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Guide,
      showable: true,
    },
    {
      path: '/leaderboard',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Leaderboard',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: 2,
      component: Leaderboard,
      showable: true,
    },
    {
      path: '/creator',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Creator',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Creator,
      showable: true,
    },
    {
      path: '/guilds',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Guilds',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Guilds,
      showable: true,
    },
    {
      path: '/gambling',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Gambling',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Gambling,
      showable: true,
    },
    {
      path: '/shards',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Shards',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Shards,
      showable: true,
    },
    {
      path: '/farms',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Farms',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Farms,
      showable: true,
    },
    {
      path: '/updates',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Updates',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Updates,
      showable: true,
    },
    {
      path: '/team',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Team',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Team,
      showable: true,
    },
    {
      path: '/register',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Register',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Register,
      showable: true,
    },
    {
      path: '/press',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Press',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Press,
      showable: true,
    },
    {
      path: '/class-designer',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'class-designer',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: ClassDesigner,
      showable: true,
    },
    {
      path: '/claims',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'claims',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Claims,
      showable: true,
    },
    {
      path: '/sitemap',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: '',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: -1000,
      component: Sitemap,
      showable: true,
    },
    {
      path: '/distro',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'distro',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Distro,
      showable: true,
    },
    {
      path: '/metaverse',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'metaverse',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Metaverse,
      showable: true,
    },
    {
      path: '/infinite',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Infinite',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined, // 600,
      component: Infinite,
      showable: true,
    },
    {
      path: '/infinite/tutorial',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Infinite Tutorial',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: InfiniteTutorial,
      showable: false,
    },
    {
      path: '/raid/tutorial',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Raid Tutorial',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      toolbarNav: (subnav, setSubnav) => (
        <>
          <Button scale="sm" variant="text" onClick={() => history.push('/raid')}>
            Raid
          </Button>
        </>
      ),
      navPosition: undefined,
      component: RaidTutorial,
      showable: false,
    },
    {
      path: '/evolution/tutorial',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Evolution Tutorial',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      toolbarNav: (subnav, setSubnav) => (
        <>
          <Button scale="sm" variant="text" onClick={() => history.push('/evolution')}>
            Evolution
          </Button>
        </>
      ),
      navPosition: undefined,
      component: EvolutionTutorial,
      showable: false,
    },
    {
      path: '/guardians',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Guardians',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Guardians,
      showable: true,
    },
    {
      path: '/guardians/tutorial',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Guardians Tutorial',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: GuardiansTutorial,
      showable: true,
    },
    {
      path: '/farms/:id',
      icon: AboutIcon,
      exact: false,
      strict: false,
      persist: false,
      props: {
        title: 'Farm',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Farms,
      showable: false,
    },
    {
      path: '/marketwatch',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Marketwatch',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: MarketWatch,
      showable: true,
    },
    {
      path: '/trade/:id',
      icon: AboutIcon,
      exact: false,
      strict: false,
      persist: false,
      props: {
        title: 'Trade',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      toolbarNav: (subnav, setSubnav) => (
        <>
          <Button scale="sm" variant="text" onClick={() => history.push('/market')}>
            Market
          </Button>
        </>
      ),
      navPosition: undefined,
      component: MarketTrade,
      showable: false,
    },
    {
      path: '/mod',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: '',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: -2000,
      component: Mod,
      showable: true,
    },
    {
      path: '/sign',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Sign',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Sign,
      showable: true,
    },
    {
      path: '/pools',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Pools',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Pools,
      showable: true,
    },
    {
      path: '/pools/:id',
      icon: AboutIcon,
      exact: false,
      strict: false,
      persist: false,
      props: {
        title: 'Pool',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Pools,
      showable: false,
    },
    {
      path: '/developer',
      icon: AboutIcon,
      exact: false,
      strict: false,
      persist: false,
      props: {
        title: 'Developer Portal',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Developers,
      showable: true,
    },
    {
      path: '/community',
      icon: AboutIcon,
      exact: false,
      strict: false,
      persist: false,
      props: {
        title: 'Community',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Community,
      showable: true,
    },
    {
      path: '/docs',
      icon: AboutIcon,
      exact: false,
      strict: false,
      persist: false,
      props: {
        title: 'Docs',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Docs,
      showable: true,
    },
    {
      path: '/faq',
      icon: AboutIcon,
      exact: false,
      strict: false,
      persist: false,
      props: {
        title: 'FAQ',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Faq,
      showable: true,
    },
    {
      path: '/tokenomics',
      icon: AboutIcon,
      exact: false,
      strict: false,
      persist: false,
      props: {
        title: 'Tokenomics',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Tokenomics,
      showable: true,
    },
    {
      path: '/about',
      icon: AboutIcon,
      exact: false,
      strict: false,
      persist: false,
      props: {
        title: 'About',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: About,
      showable: true,
    },
    {
      path: '/roadmap',
      icon: AboutIcon,
      exact: false,
      strict: false,
      persist: false,
      props: {
        title: 'Roadmap',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Roadmap,
      showable: true,
    },
    {
      path: '/transmute/:id',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Transmute',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Transmute,
      showable: false,
    },
    {
      path: '/transmute',
      icon: AboutIcon,
      exact: false,
      strict: false,
      persist: false,
      props: {
        title: 'Transmute',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Transmute,
      showable: true,
    },
    {
      path: '/verify',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Verify',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Verify,
      showable: true,
    },
    {
      path: '/newsletter',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Newsletter',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Newsletter,
      showable: true,
    },
    {
      path: '/refer',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Refer',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Refer,
      showable: true,
    },
    {
      path: '/risks',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Risks',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Risks,
      showable: true,
    },
    {
      path: '/transparency',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Transparency',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Transparency,
      showable: true,
    },
    {
      path: '/tournament',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Tournament',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Tournament,
      showable: true,
    },
    {
      path: '/terms',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Terms',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Terms,
      showable: true,
    },
    {
      path: '/polls',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Polls',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Polls,
      showable: true,
    },
    {
      path: '/changelog',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Changelog',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Updates,
      showable: true,
    },
    {
      path: '/download/:id/:platform',
      icon: AboutIcon,
      exact: false,
      strict: false,
      persist: false,
      props: {
        title: 'Download',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Download,
      showable: false,
    },
    {
      path: '/download/:id',
      icon: AboutIcon,
      exact: false,
      strict: false,
      persist: false,
      props: {
        title: 'Download',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Download,
      showable: false,
    },
    {
      path: '/support',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Support',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Support,
      showable: false,
    },
    {
      path: '/evolution/replay/:realmKey/:roundId',
      icon: AboutIcon,
      exact: false,
      strict: false,
      persist: false,
      props: {
        title: 'Replay',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Replay,
      showable: false,
    },
    {
      path: '/airdrop/cmc/1/rules',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Airdrop',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: AirdropCmc1Rules,
      showable: true,
    },
    {
      path: '/airdrop/cmc/1/winners',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Airdrop',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: AirdropCmc1Winners,
      showable: true,
    },
    {
      path: '/airdrop/cmc/2/winners',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Airdrop',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: AirdropCmc2Winners,
      showable: true,
    },
    {
      path: '/swap',
      icon: AboutIcon,
      exact: true,
      strict: true,
      persist: false,
      props: {
        title: 'Swap',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: Swap,
      showable: true,
    },
    {
      path: '/swap/find',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Find',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: SwapPoolFinder,
      showable: true,
    },
    {
      path: '/swap/pool',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Pool',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: SwapPool,
      showable: true,
    },
    {
      path: '/swap/add/:currencyIdA',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Add Liquidity',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: SwapAddLiquidity,
      showable: false,
    },
    {
      path: '/swap/add/:currencyIdA/:currencyIdB',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Add Liquidity',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: SwapAddLiquidity,
      showable: false,
    },
    {
      path: '/swap/remove/:currencyIdA/:currencyIdB',
      icon: AboutIcon,
      exact: true,
      strict: false,
      persist: false,
      props: {
        title: 'Remove Liquidity',
        routeIndex: 1000,
        open: false,
        minimized: false,
        active: false,
        windowSize: { width: '100%', height: '100%' },
        windowPosition: { x: 0, y: 0 },
        location: {
          search: null,
        },
      },
      navPosition: undefined,
      component: SwapRemoveLiquidity,
      showable: false,
    },
    // // {

    // //   path: '*',
    // //   icon: AboutIcon,
    // //   exact: true,
    // //   strict: false,
    // //   persist: false,
    // //   props: {
    // // title: 'Not Found',
    // //     routeIndex: 1000,
    // //     open: false,
    // //     minimized: false,
    // //     active: false,
    // // windowSize: { width: '100%', height: '100%' },
    // // windowPosition: { x: 0, y: 0 },
    // //     location: {
    // //       search: null,
    // //     },
    // //   },
    // //   navPosition: undefined,
    // //   component: NotFound,
    // //   x: 0,
    // //   y: 0,
    // //   showable: false,
    // // },
  ]);

  const [pageSort, setPageSort] = useState({
    items: [], //Object.keys(pageState).filter((v) => pageState[v].open || pageState[v].shown),
  });

  const onChangePage = (page, p = undefined, data = {}) => {
    // setPendingPageUpdate({
    //   path: p ? p : pageState[page].path,
    //   page,
    //   data: { open: true, focused: true, minimized: false, ...data },
    // });
  };

  return {
    pendingPageUpdate,
    setPendingPageUpdate,
    pageState,
    setPageState,
    pageSort,
    setPageSort,
    onChangePage,
    currentRouteIndex,
    setCurrentRouteIndex,
  };
};

export default useWindows;
