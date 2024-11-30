import styled from 'styled-components';
import { space, SpaceProps } from 'styled-system';

export type CardHeaderProps = SpaceProps;

const CardHeader = styled.div<CardHeaderProps>`
  background: ${({ theme }) => theme.card.cardHeaderBackground};

  h2 {
    filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.5));
  }

  ${space}
`;

export default CardHeader;
