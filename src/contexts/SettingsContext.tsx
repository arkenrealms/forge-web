import React, { useState, useEffect, useCallback, useRef } from 'react'
import { getWeb3NoAccount } from '~/utils/web3'
import BigNumber from 'bignumber.js'
import useWeb3 from '~/hooks/useWeb3'
import useBrand from '~/hooks/useBrand'
import { useBarracks, useMasterchef } from '~/hooks/useContract'

const initState = {
  update: (key, value) => {},
  quality: 'bad',
  setQuality: (mode: string) => {},
  isCrypto: false,
  isAdvancedCrypto: false,
  isGamer: true,
  isAdvancedGamer: false,
  isAdvancedUser: false,
}

const SettingsContext = React.createContext(initState)

let init = false

let requestedAnimationFrame
let fpsInitialized = false

const updateQuality = (quality) => {
  window.localStorage.setItem('appQuality', quality)

  document.body.classList.remove(`good-quality`)
  document.body.classList.remove(`avg-quality`)
  document.body.classList.remove(`bad-quality`)
  document.body.classList.add(`${quality}-quality`)

  const toggleEl = document.querySelectorAll('[aria-label="Toggle menu"]')[0]
  if (toggleEl) {
    if (quality === 'bad') {
      // @ts-ignore
      toggleEl.children[0].style['animation-name'] = 'none'
    } else {
      // @ts-ignore
      toggleEl.children[0].style['animation-name'] = 'spin'
    }
  }
}

const SettingsContextProvider = ({ children }) => {
  const { brand } = useBrand()
  const [quality, _setQuality] = useState(initState.quality)
  const [isGamer, _setIsGamer] = useState(initState.isGamer)
  const [isCrypto, _setIsCrypto] = useState(brand === 'arken' ? true : initState.isCrypto)
  const [isAdvancedCrypto, _setIsAdvancedCrypto] = useState(brand === 'arken' ? true : initState.isAdvancedCrypto)
  const [isAdvancedGamer, _setIsAdvancedGamer] = useState(brand === 'arken' ? true : initState.isAdvancedGamer)
  const [isAdvancedUser, _setIsAdvancedUser] = useState(brand === 'arken' ? false : initState.isAdvancedUser)
  const { web3, address: account } = useWeb3()

  const setQuality = (grade) => {
    // _setQuality(grade)
    updateQuality(grade)
  }

  useEffect(() => {
    if (init || !window || !window.localStorage) return

    init = true

    if (window.localStorage.getItem('isCrypto')) _setIsCrypto(window.localStorage.getItem('isCrypto') === 'true')
    if (window.localStorage.getItem('isGamer')) _setIsGamer(window.localStorage.getItem('isGamer') === 'true')
    if (window.localStorage.getItem('isAdvancedCrypto'))
      _setIsAdvancedCrypto(window.localStorage.getItem('isAdvancedCrypto') === 'true')
    if (window.localStorage.getItem('isAdvancedGamer'))
      _setIsAdvancedGamer(window.localStorage.getItem('isAdvancedGamer') === 'true')
    if (window.localStorage.getItem('isAdvancedUser'))
      _setIsAdvancedUser(window.localStorage.getItem('isAdvancedUser') === 'true')

    if (document.body.classList.value?.includes('override-bad-quality')) {
      updateQuality('bad')
      // Dont benchmark
      return
    }

    updateQuality(window.localStorage.getItem('appQuality') || initState.quality)
  }, [web3, account])

  useEffect(() => {
    // if (fpsInitialized || !window || !window.localStorage || window.location.hostname === 'localhost') return
    fpsInitialized = true

    let fpsVals = []

    const onBenchmarkFinished = () => {
      //   [].slice.apply(document.images).filter(is_gif_image).map(freeze_gif)

      //   function is_gif_image(i) {
      //     return /^(?!data:).*\.gif/i.test(i.src)
      //   }

      //   function freeze_gif(i) {
      //     var c = document.createElement("canvas")
      //     var w = (c.width = i.width)
      //     var h = (c.height = i.height)
      //     c.getContext("2d").drawImage(i, 0, 0, w, h)
      //     try {
      //       i.src = c.toDataURL("image/gif") // if possible, retain all css aspects
      //     } catch (e) {
      //       // cross-domain -- mimic original with all its tag attributes
      //       for (var j = 0, a (a = i.attributes[j]) j++)
      //         c.setAttribute(a.name, a.value)
      //       i.parentNode.replaceChild(c, i)
      //     }
      //   }

      const avgFps = Math.round(fpsVals.reduce((sum, fps) => sum + fps, 0) / fpsVals.length)

      let grade = 'good'
      if (avgFps < 50 && avgFps > 40) {
        grade = 'avg'
      } else if (avgFps <= 40) {
        grade = 'bad'
      }

      console.info(`Performance: ${grade} (${avgFps} FPS)`)

      if (document.body.classList.value?.includes('override-bad-quality')) {
        grade = 'bad'
      }

      setQuality(grade)

      if (document.body.classList.value?.includes('override-bad-quality')) {
        updateQuality('bad')
        // Dont benchmark
        return
      }

      if (grade === 'good') {
        // It got a good grade so we can benchmark again
        setTimeout(() => {
          benchmark()
        }, 5 * 1000)
      } else {
        // Dont reattempt often or it'll slow them down
        setTimeout(() => {
          benchmark()
        }, 5 * 60 * 1000)
      }
    }

    const benchmark = () => {
      // console.log('Benchmarking')
      fpsVals = []

      const times = []
      let loop = 0

      const refreshLoop = () => {
        if (requestedAnimationFrame) cancelAnimationFrame(requestedAnimationFrame)

        requestedAnimationFrame = window.requestAnimationFrame(() => {
          loop++
          const now = performance.now()
          while (times.length > 0 && times[0] <= now - 1000) {
            times.shift()
          }
          times.push(now)

          if (loop > 60) fpsVals.push(times.length)

          if (loop > 180) {
            onBenchmarkFinished()
          } else {
            refreshLoop()
          }
        })
      }

      refreshLoop()
    }

    benchmark()
  }, [])

  const update = (key, value) => {
    window.localStorage.setItem(key, value)

    if (key === 'isCrypto') _setIsCrypto(value)
    if (key === 'isGamer') _setIsGamer(value)
    if (key === 'isAdvancedCrypto') _setIsAdvancedCrypto(value)
    if (key === 'isAdvancedGamer') _setIsAdvancedGamer(value)
    if (key === 'isAdvancedUser') _setIsAdvancedUser(value)
  }

  return (
    <SettingsContext.Provider
      value={{
        update,
        quality,
        setQuality,
        isCrypto,
        isAdvancedCrypto,
        isGamer,
        isAdvancedGamer,
        isAdvancedUser,
      }}>
      {children}
    </SettingsContext.Provider>
  )
}

export { SettingsContext, SettingsContextProvider }
