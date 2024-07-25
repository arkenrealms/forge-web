import styled from 'styled-components'

const Card2 = styled.div<any>`
  width: 100%;
  border-radius: 16px;
  padding: 1.25rem;
  padding: ${({ padding }) => padding};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
`

export { default as Card } from './Card'
export { default as CardBody } from './CardBody'
export { default as CardHeader } from './CardHeader'
export { default as CardFooter } from './CardFooter'
export { default as CardRibbon } from './CardRibbon'
export type { CardProps, CardRibbonProps } from './types'

export default Card2
