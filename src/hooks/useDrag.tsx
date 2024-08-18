import { useState, useCallback, useEffect } from 'react'

const getOffset = (
  e: MouseEvent | TouchEvent,
  element: Element
): [number, number, number, number, number, number] | undefined => {
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

type MoveProps = {
  x: number
  y: number
  dx: number
  dy: number
  px: number
  py: number
  initX: number
  initY: number
  cursorX: number
  cursorY: number
}

type Props = {
  anchorRef: React.RefObject<Element>
  handleRef: React.RefObject<Element>
  onMove?: (state: MoveProps) => void
  onMoveStart?: (state: MoveProps) => void
  onMoveEnd?: (state: MoveProps) => void
  disabled?: boolean
}

export const useDrag = ({ anchorRef, handleRef, onMove, onMoveStart, onMoveEnd, disabled }: Props) => {
  const [isDragging, setDragging] = useState(false)
  const [initX, setInitX] = useState(0)
  const [initY, setInitY] = useState(0)

  useEffect(() => {
    if (disabled) {
      setDragging(false)
    }
  }, [disabled])

  const handleDragStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (disabled) return
      const node = anchorRef.current
      if (!node) return
      const offset = getOffset(e.nativeEvent, node)
      if (!offset) return
      const [px, py, x, y, cursorX, cursorY] = offset
      const dx = x
      const dy = y
      const args = {
        px,
        py,
        x,
        y,
        dx,
        dy,
        initX: cursorX,
        initY: cursorY,
        cursorX,
        cursorY,
      }
      onMoveStart?.(args)
      onMove?.(args)
      setInitX(cursorX)
      setInitY(cursorY)
      setDragging(true)
    },
    [disabled, onMove, handleRef]
  )

  useEffect(() => {
    if (!isDragging) return

    let prevX = 0
    let prevY = 0

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const node = anchorRef.current
      if (!node) return
      const offset = getOffset(e, node)
      if (!offset) return
      const [px, py, x, y, cursorX, cursorY] = offset
      const dx = prevX ? cursorX - prevX : 0
      const dy = prevY ? cursorY - prevY : 0

      const args = {
        px,
        py,
        x: initX - x,
        y: initY - y,
        dx,
        dy,
        initX,
        initY,
        cursorX,
        cursorY,
      }
      if (dx !== 0 || dy !== 0) {
        onMove?.(args)
      }
      prevX = cursorX
      prevY = cursorY
    }

    const handleDragEnd = () => {
      setDragging(false)
    }

    document.addEventListener('mousemove', handleMove)
    document.addEventListener('touchmove', handleMove)
    document.addEventListener('mouseup', handleDragEnd)
    document.addEventListener('touchend', handleDragEnd)

    return () => {
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('touchmove', handleMove)
      document.removeEventListener('mouseup', handleDragEnd)
      document.removeEventListener('touchend', handleDragEnd)
    }
  }, [isDragging])

  return [isDragging, handleDragStart] as const
}
