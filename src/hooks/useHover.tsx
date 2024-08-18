import { useState, useCallback, useEffect } from 'react'

const getOffset = (
  e: MouseEvent | TouchEvent,
  element: Element | null
): [number, number, number, number, number, number] | undefined => {
  if (!element) return undefined

  let cursorX = 0
  let cursorY = 0

  if (typeof TouchEvent !== 'undefined' && e instanceof TouchEvent) {
    cursorX = e.targetTouches[0].pageX
    cursorY = e.targetTouches[0].pageY
  } else if (e instanceof MouseEvent) {
    cursorX = e.pageX
    cursorY = e.pageY
  } else {
    return
  }

  const rect = element.getBoundingClientRect()
  const offsetX = cursorX - rect.left
  const offsetY = cursorY - rect.top
  return [offsetX / rect.width, offsetY / rect.height, offsetX, offsetY, cursorX, cursorY]
}

export function useHover(ref: React.RefObject<Element>, disabled?: boolean) {
  const [value, setValue] = useState(false)
  const [x, setX] = useState(0)
  const handleMouseOver = useCallback(() => setValue(true), [])
  const handleMouseOut = useCallback(() => {
    setValue(false)
    setX(0)
  }, [])

  useEffect(() => {
    if (!value || disabled) return
    const node = ref.current
    if (!node) return

    const handleMove = (e: MouseEvent) => {
      const offset = getOffset(e, node)

      if (!offset) return
      setX(offset[0])
    }

    document.addEventListener('mousemove', handleMove)
    return () => document.removeEventListener('mousemove', handleMove)
  }, [disabled, handleMouseOut, handleMouseOver, ref, value])

  useEffect(() => {
    if (disabled) return
    const node = ref.current
    if (!node) return

    node.addEventListener('mouseover', handleMouseOver)
    node.addEventListener('mouseout', handleMouseOut)

    return () => {
      node.removeEventListener('mouseover', handleMouseOver)
      node.removeEventListener('mouseout', handleMouseOut)
    }
  }, [disabled, handleMouseOut, handleMouseOver, ref])

  useEffect(() => {
    setValue(false)
  }, [disabled])

  return [value, x] as const
}
