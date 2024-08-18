import React, { useEffect } from 'react'
import { useIsMounted } from './useIsMounted'

export const useUpdateEffect: typeof useEffect = function useUpdateEffect(effect, dependencies) {
  const isMounted = useIsMounted()
  const isInitialMount = React.useRef(true)

  React.useEffect(() => {
    let effectCleanupFunc = function noop() {} // eslint-disable-line @typescript-eslint/no-empty-function

    if (isInitialMount.current) {
      isInitialMount.current = false
    } else {
      effectCleanupFunc = effect() || effectCleanupFunc
    }
    return () => {
      effectCleanupFunc()
      if (!isMounted.current) {
        isInitialMount.current = true
      }
    }
  }, dependencies) // eslint-disable-line react-hooks/exhaustive-deps
}
