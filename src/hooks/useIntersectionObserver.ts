import { useEffect, useState } from 'react'

const useIntersectionObserver = (reference) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleIntersect = (entries, observer) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true)
        observer.unobserve(entries[0].target)
        observer.disconnect()
      }
    }

    const observer = new IntersectionObserver(handleIntersect)

    if (reference?.current) {
      observer.observe(reference.current)
    }

    // If unmounting, then disconnect
    return () => observer.disconnect()
  }, [reference])

  return isVisible
}

export default useIntersectionObserver
