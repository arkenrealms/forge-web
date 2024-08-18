import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

const useReferral = () => {
  const [referer, setReferer] = useState(null)
  useEffect(() => {
    if (window.location.hash && window.location.hash.indexOf('u=') !== -1) {
      const ref = window.location.hash.replace('#u=', '').replace('%20', ' ').replace('%2520', ' ')
      Cookies.set(`referer`, ref, { domain: window.location.hostname, secure: true, expires: 7 })
      setReferer(ref)
    }
  }, [])

  return referer
}

export default useReferral
