import React from 'react'

export const useIsMounted = function useIsMounted() {
  const isMounted = React.useRef(false)

  React.useEffect(function setIsMounted() {
    isMounted.current = true

    return function cleanupSetIsMounted() {
      isMounted.current = false
    }
  }, [])

  return isMounted
}
