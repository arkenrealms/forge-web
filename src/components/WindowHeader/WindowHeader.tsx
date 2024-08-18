import styled from 'styled-components'
import { WindowHeader } from 'react95'

export default styled(WindowHeader)`
  display: flex;
  position: relative;
  padding: 0px 4px 0;

  :hover {
    cursor: move;
  }

  ${({ active }) => (active ? 'cursor: move;' : '')}

  ${({ theme }) =>
    theme.name === 'original'
      ? `
          border-radius: 6px;
  img {
    filter: grayscale(100%) brightness(70%) sepia(100%) hue-rotate(60deg) saturate(300%);
  }
`
      : ''}

    ${({ theme }) =>
    theme.name === 'pokemon'
      ? `
              border-radius: 6px;
    `
      : ''}



  ${({ theme }) =>
    theme.name === 'sex'
      ? `
          border-radius: 6px;
        `
      : ''}
`
