const config = {
  port: process.env.REACT_APP_PORT || 3004,
  remotes: {},
  serviceUri: process.env.REACT_APP_SERVICE_URI,
  isAuthorizationEnabled: process.env.REACT_APP_AUTHORIZATION_ENABLED === 'true',
  tokenKey: process.env.REACT_APP_TOKEN_KEY || 'Token',
  userKey: process.env.REACT_APP_USER_KEY || 'User',
  loginAsUserKey: process.env.REACT_APP_TOKEN_KEY || 'LoginAsUser',
}

console.log('Config', config)
console.log('Environment variables', process.env)

export default config
export const port = config.port
export const remotes = config.remotes
export const serviceUri = config.serviceUri

const size = {
  mobileS: '320px',
  mobileM: '375px',
  mobileL: '425px',
  tablet: '768px',
  laptop: '1024px',
  laptopL: '1440px',
  desktop: '2560px',
}
export const device = {
  mobileS: `(min-width: ${size.mobileS})`,
  mobileM: `(min-width: ${size.mobileM})`,
  mobileL: `(min-width: ${size.mobileL})`,
  tablet: `(min-width: ${size.tablet})`,
  laptop: `(min-width: ${size.laptop})`,
  laptopL: `(min-width: ${size.laptopL})`,
  desktop: `(min-width: ${size.desktop})`,
  desktopL: `(min-width: ${size.desktop})`,
}
