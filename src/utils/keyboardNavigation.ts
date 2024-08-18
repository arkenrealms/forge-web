type PositionType = {
  x: number
  y: number
}

const getMatrixPositionFromIndex = (index: number, columns: number): PositionType => {
  const rowIndex = Math.floor(index / columns)
  const columnIndex = index % columns
  return { x: rowIndex, y: columnIndex }
}

const getIndexFromMaxtrixPosition = (matrixPosition: PositionType, columns: number): number => {
  return matrixPosition.x * columns + matrixPosition.y
}

const goUp = (position: PositionType) => ({
  x: Math.max(position.x - 1, 0),
  y: position.y,
})
const goDown = (position: PositionType, rows: number) => ({
  x: Math.min(position.x + 1, rows - 1),
  y: position.y,
})
const goLeft = (position: PositionType, columns: number) => {
  const newPosition = position.y - 1
  return {
    x: position.x,
    y: newPosition < 0 ? columns - 1 : newPosition,
  }
}
const goRight = (position: PositionType, columns: number) => {
  const newPosition = position.y + 1
  return { x: position.x, y: newPosition % columns }
}

export { getMatrixPositionFromIndex, getIndexFromMaxtrixPosition, goUp, goDown, goLeft, goRight }
