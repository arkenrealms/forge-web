import Cookies from 'js-cookie'
import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import languageEN from '../i18n/en/translate'
import languageJP from '../i18n/jp/translate'
import languageCN from '../i18n/cn/translate'
import languageDE from '../i18n/de/translate'
import languageES from '../i18n/es/translate'
import languageFR from '../i18n/fr/translate'
import languageVI from '../i18n/vi/translate'
import languageSV from '../i18n/sv/translate'

export const whitelist = ['en'] // 'jp', 'cn', 'de', 'fr', 'vi', 'sv', 'es',

export const onRouteChange = (path) => {
  const code = Cookies.get('i18next')
  if (code && code !== i18n.options.fallbackLng[0]) {
    const existingLng = path.match(/^\/../gi)

    if (!existingLng || !whitelist.includes(existingLng[0].replace('/', ''))) {
      Cookies.set(`i18next`, code, { domain: window.location.hostname, secure: true, expires: 30 })
      const newUrl = '/' + code + (path === '/' ? '' : path.replace('/' + code, '/')) + window.location.search
      // window.location.replace(newUrl)
      console.log('i18n route replacement: ', newUrl)
      // @ts-ignore
      window.history.replaceState(null, window.document.title, newUrl)
    }
  }
}

export const updateLanguage = (lng) => {
  const existingLng = window.location.pathname.match(/^\/../gi)

  if (existingLng && window.location.pathname.slice(0, existingLng.length) === existingLng[0]) {
    return
  }

  if (existingLng && whitelist.includes(existingLng[0].replace('/', ''))) {
    Cookies.set(`i18next`, lng.code, { domain: window.location.hostname, secure: true, expires: 30 })
    const newUrl = window.location.pathname.replace(existingLng[0], '/' + lng.code)
    window.location.replace(newUrl)
    return
  }

  Cookies.set(`i18next`, lng.code, { domain: window.location.hostname, secure: true, expires: 30 })
  const newUrl =
    '/' + lng.code + (window.location.pathname === '/' ? '' : window.location.pathname) + window.location.search
  window.location.replace(newUrl)
}

i18n.on('languageChanged', function (lng) {
  // if the language we switched to is the default language we need to remove the /en from URL
  if (lng === i18n.options.fallbackLng[0]) {
    const existingLng = window.location.pathname.match(/^\/../gi)
    if (existingLng && existingLng[0].replace('/', '') === i18n.options.fallbackLng[0]) {
      Cookies.set(`i18next`, 'en', { domain: window.location.hostname, secure: true, expires: 30 })
      const newUrl = window.location.pathname
        .replace('/' + i18n.options.fallbackLng[0] + '/', '/')
        .replace('/' + i18n.options.fallbackLng[0], '/')
      // window.location.replace(newUrl)
      // @ts-ignore
      window.history.replaceState(null, window.document.title, newUrl)
    }
  }
})

const myDetector = {
  name: 'myDetector',

  lookup(options) {
    const langMap = {
      en: 'en',
      // 'da': 'da',
      de: 'de',
      'de-AT': 'de',
      'de-CH': 'de',
      'de-DE': 'de',
      'en-US': 'en',
      es: 'es',
      'es-419': 'es',
      'es-AR': 'es',
      'es-CL': 'es',
      'es-CO': 'es',
      'es-CR': 'es',
      'es-EC': 'es',
      'es-ES': 'es',
      'es-MX': 'es',
      'es-NI': 'es',
      'es-PA': 'es',
      'es-PE': 'es',
      'es-US': 'es',
      'es-VE': 'es',
      // 'et': 'et',
      // 'fa': 'fa',
      fr: 'fr',
      'fr-CA': 'fr',
      'fr-CH': 'fr',
      'fr-FR': 'fr',
      // 'id': 'id',
      // 'it': 'it',
      ja: 'jp',
      'ja-JP': 'jp',
      // 'ka': 'ka',
      // 'ml': 'ml',
      // 'nb': 'nb',
      // 'nl': 'nl',
      // 'nn': 'nn',
      // 'pt': 'pt',
      // 'pt-BR': 'pt',
      tr: 'tr',
      id: 'id',
      ph: 'ph',
      sv: 'sv',
      'sv-SE': 'sv',
      // 'tr': 'tr',
      zh: 'cn',
      'zh-CN': 'cn',
      'zh-HK': 'cn',
      'zh-TW': 'cn',
      'zh-YUE': 'ch',
      uk: 'en',
    }

    if (!whitelist.includes(window.navigator.language))
      // @ts-ignore
      return window.navigator?.userLanguage

    const code = langMap[window.navigator.language]
    if (code) {
      if (!Cookies.get('i18next')) {
        Cookies.set(`i18next`, code, {
          domain: window.location.hostname,
          secure: true,
          expires: 30,
        })

        if (code !== 'en') {
          const existingLng = window.location.pathname.match(/^\/../gi)

          if (existingLng) {
            // const newUrl = window.location.pathname.replace(existingLng[0], '/' + code)
            // console.log('zzz', window.location.pathname, newUrl, code)
            // // @ts-ignore
            // window.location.replace(newUrl)
          } else {
            const newUrl = '/' + code + window.location.pathname.replace('/' + i18n.options.fallbackLng[0], '/' + code)
            // console.log('zzz2', window.location.pathname, newUrl, code)
            // window.location.replace(newUrl)
            // @ts-ignore
            window.location.replace(newUrl)
          }
        }
      }
    }
    // @ts-ignore
    return window.navigator?.userLanguage || langMap[window.navigator.language]
  },

  cacheUserLanguage(lng, options) {
    console.log(lng, options)
    // options -> are passed in options
    // lng -> current language, will be called after init and on changeLanguage
    // store it
  },
}

const languageDetector = new LanguageDetector()
languageDetector.addDetector(myDetector)

// @ts-ignore
i18n
  .use(languageDetector)
  // .use(initReactI18next)
  .init({
    // @ts-ignore
    resources: {
      en: languageEN,
      // jp: languageJP,
      // cn: languageCN,
      // de: languageDE,
      // es: languageES,
      // fr: languageFR,
      // vi: languageVI,
      // sv: languageSV,
    },
    /* default language when load the website in browser */
    // lng: "en",
    /* When react i18next not finding any language to as default in borwser */
    fallbackLng: ['en'],
    /* debugger For Development environment */
    // optional expire and domain for set cookie
    cookieMinutes: 10,
    cookieDomain: window.location.hostname,
    // keys or params to lookup language from
    lookupQuerystring: 'lng',
    lookupCookie: 'i18next',
    lookupLocalStorage: 'i18nextLng',
    lookupSessionStorage: 'i18nextLng',
    lookupFromPathIndex: 0,
    lookupFromSubdomainIndex: 0,
    // cache user language on
    caches: ['cookie'],
    excludeCacheFor: ['cimode'], // languages to not persist (cookie, localStorage)
    cookieOptions: { path: '/', sameSite: 'strict' },
    debug: false,
    ns: ['translations'],
    defaultNS: 'translations',
    whitelist,
    keySeparator: ']',
    nsSeparator: '[',
    detection: {
      order: ['path', 'cookie', 'navigator', 'myDetector'],
      lookupFromPathIndex: 0,
      checkWhitelist: true,
    },
    interpolation: {
      escapeValue: false,
      formatSeparator: ',',
    },
    react: {
      wait: true,
      bindI18n: 'languageChanged loaded',
      bindStore: 'added removed',
      nsMode: 'default',
    },
  })

export default i18n
