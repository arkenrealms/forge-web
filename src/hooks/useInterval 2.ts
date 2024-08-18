import { useState, useEffect, useRef, useCallback } from 'react'

export default function useInterval(callback: any, delay: any) {
  const savedCallback = useRef()
  const intervalId = useRef(null)
  const [currentDelay, setDelay] = useState(delay)

  const toggleRunning = useCallback(
    () => setDelay((currentDelay: any) => (currentDelay === null ? delay : null)),
    [delay]
  )

  // @ts-ignore
  const clear = useCallback(() => clearInterval(intervalId.current), [])

  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    function tick() {
      // @ts-ignore
      savedCallback.current()
    }

    if (intervalId.current) clear()

    if (currentDelay !== null) {
      // @ts-ignore
      intervalId.current = setInterval(tick, currentDelay)
    }

    return clear
  }, [currentDelay, clear])

  return [toggleRunning, !!currentDelay]
}
