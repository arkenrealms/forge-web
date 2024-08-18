import React, { useEffect, useState } from 'react'

const useFetch = (url) => {
  const [status, setStatus] = useState('idle')
  const [data, setData] = useState(function () {
    // @ts-ignore
    if (window?.useFetchCache) return window.useFetchCache

    return {}
  })

  useEffect(() => {
    if (!url) return
    // if (status === 'fetching') return

    if (!window) return

    // @ts-ignore
    if (!window.useFetchCache) {
      // @ts-ignore
      window.useFetchCache = {}
    }

    const fetchData = async (_setData) => {
      try {
        // @ts-ignore
        if (window.useFetchCache[url]) {
          // @ts-ignore
          // _setData(window.useFetchCache)
          return
        }

        // setStatus('fetching')

        // @ts-ignore
        window.useFetchCache[url] = await (await fetch(url)).json()

        // @ts-ignore
        _setData({ ...window.useFetchCache })

        // setStatus('fetched')
      } catch (e) {
        console.log(e)
      }
    }

    fetchData(setData)
  }, [url, status, setData])

  async function reload(_url) {
    try {
      // @ts-ignore
      window.useFetchCache[_url] = await (await fetch(_url)).json()

      // @ts-ignore
      setData({ ...window.useFetchCache })
    } catch (e) {
      console.log(e)
    }
  }

  return { status, data, reload }
}

export default useFetch
