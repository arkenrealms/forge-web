import BigNumber from 'bignumber.js';

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

const config = {
  port: process.env.REACT_APP_PORT || 3004,
  remotes: {},
  serviceUri: process.env.REACT_APP_SERVICE_URI,
  isAuthorizationEnabled: process.env.REACT_APP_AUTHORIZATION_ENABLED === 'true',
  tokenKey: process.env.REACT_APP_TOKEN_KEY || 'Token',
  accountKey: process.env.REACT_APP_ACCOUNT_KEY || 'Account',
  loginAsAccountKey: process.env.REACT_APP_TOKEN_KEY || 'LoginAsAccount',
};

console.log('Config', config);
console.log('Environment variables', process.env);

export default config;
export const port = config.port;
export const remotes = config.remotes;
export const serviceUri = config.serviceUri;

const size = {
  mobileS: '320px',
  mobileM: '375px',
  mobileL: '425px',
  tablet: '768px',
  laptop: '1024px',
  laptopL: '1440px',
  desktop: '2560px',
};
export const device = {
  mobileS: `(min-width: ${size.mobileS})`,
  mobileM: `(min-width: ${size.mobileM})`,
  mobileL: `(min-width: ${size.mobileL})`,
  tablet: `(min-width: ${size.tablet})`,
  laptop: `(min-width: ${size.laptop})`,
  laptopL: `(min-width: ${size.laptopL})`,
  desktop: `(min-width: ${size.desktop})`,
  desktopL: `(min-width: ${size.desktop})`,
};
export const OLD_VERSION = 6;
export const PREV_FARM_SYMBOL = 'GUL';
export const CURRENT_FARM_SYMBOL = 'OHM';
export const CURRENT_FARM_PAUSED = false;
export const NEXT_FARM_SYMBOL = 'SUR';
export const CHEF_MAP = [
  'EL',
  'TIR',
  'NEF',
  'ITH',
  'TAL',
  'RAL',
  'ORT',
  'THUL',
  'AMN',
  'SOL',
  'SHAEL',
  'DOL',
  'HEL',
  'IO',
  'LUM',
  'KO',
  'FAL',
  'PUL',
  'UM',
  'MAL',
  'IST',
  'GUL',
  'VEX',
  'OHM',
  'LO',
];
export const allRuneList = [
  'el',
  'eld',
  'tir',
  'nef',
  'eth',
  'ith',
  'tal',
  'ral',
  'ort',
  'thul',
  'amn',
  'sol',
  'shael',
  'dol',
  'hel',
  'io',
  'lum',
  'ko',
  'fal',
  'lem',
  'pul',
  'um',
  'mal',
  'ist',
  'gul',
  'vex',
  'ohm',
  'lo',
  'sur',
  'ber',
  'jah',
  'cham',
  'zod',
];
export const safeRuneList = [
  'el',
  'eld',
  'tir',
  'nef',
  'ith',
  'tal',
  'ral',
  'ort',
  'thul',
  'amn',
  'sol',
  'shael',
  'dol',
  'hel',
  'io',
  'lum',
  'ko',
  'fal',
  'pul',
  'um',
  'mal',
  'ist',
  'gul',
  'lo',
  'zod',
];

export const REWARD_PER_BLOCK = new BigNumber(0.0025); // CHANGE
export const BLOCKS_PER_YEAR = new BigNumber(10512000);
export const BSC_BLOCK_TIME = 3;
export const REWARD_BUSD_POOL_PID = 86; // CHANGE
export const BASE_EXCHANGE_URL = 'https://arken.gg/swap';
export const BASE_ADD_LIQUIDITY_URL = `${BASE_EXCHANGE_URL}/#/add`;
export const BASE_LIQUIDITY_POOL_URL = `${BASE_EXCHANGE_URL}/#/pool`;
export const CURRENT_GAME_BRANCH_ID = 1;
