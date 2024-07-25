import styled from 'styled-components'

const Card2 = styled.div<any>`
  width: 100%;
  border-radius: 16px;
  padding: 1.25rem;
  padding: ${({ padding }) => padding};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
`

export default styled(Card2)`
  background-color: ${({ theme }) => theme.colors.tertiary};
`
