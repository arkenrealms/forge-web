import { useState, useEffect } from 'react'

export const useEnv = () => {
  const [env, setEnv] = useState('production')

  useEffect(() => {
    if (!window || !window.location) return
    setEnv(window.location.hostname === 'localhost' ? 'development' : 'production')
  }, [])

  return { env, isDev: env === 'development', isProd: env === 'production' }
}

export default useEnv
