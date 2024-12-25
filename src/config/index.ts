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
  addressKey: process.env.REACT_APP_ADDRESS_KEY || 'Address',
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
export const PREV_FARM_SYMBOL = 'GON';
export const CURRENT_FARM_SYMBOL = 'OH';
export const CURRENT_FARM_PAUSED = false;
export const NEXT_FARM_SYMBOL = 'SEN';
export const CHEF_MAP = [
  'EX',
  'TYR',
  'NEN',
  'ISA',
  'TATO',
  'RO',
  'ORE',
  'THAL',
  'ASH',
  'SOLO',
  'SEN',
  'DA',
  'HAN',
  'ION',
  'LUX',
  'KA',
  'FUS',
  'PAI',
  'ULN',
  'MOR',
  'ISK',
  'GON',
  'VAL',
  'OH',
  'LOR',
];
export const allRuneList = [
  'ex',
  'elm',
  'tyr',
  'nen',
  'eva',
  'isa',
  'tato',
  'ro',
  'ore',
  'thal',
  'ash',
  'sen',
  'solo',
  'da',
  'han',
  'ion',
  'lux',
  'ka',
  'fus',
  'leni',
  'pai',
  'uln',
  'mor',
  'isk',
  'gon',
  'val',
  'oh',
  'lor',
  'su',
  'beru',
  'jua',
  'chin',
  'zeno',
];
export const safeRuneList = [
  'ex',
  'elm',
  'tyr',
  'nen',
  'isa',
  'tato',
  'ro',
  'ore',
  'thal',
  'ash',
  'solo',
  'sen',
  'da',
  'han',
  'ion',
  'lux',
  'ka',
  'fus',
  'pai',
  'uln',
  'mor',
  'isk',
  'gon',
  'lor',
  'zeno',
];

export const REWARD_PER_BLOCK = new BigNumber(0.0025); // CHANGE
export const BLOCKS_PER_YEAR = new BigNumber(10512000);
export const BSC_BLOCK_TIME = 3;
export const REWARD_BUSD_POOL_PID = 86; // CHANGE
export const BASE_EXCHANGE_URL = 'https://arken.gg/swap';
export const BASE_ADD_LIQUIDITY_URL = `${BASE_EXCHANGE_URL}/#/add`;
export const BASE_LIQUIDITY_POOL_URL = `${BASE_EXCHANGE_URL}/#/pool`;
export const CURRENT_GAME_BRANCH_ID = 1;
