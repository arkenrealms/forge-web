import styled from 'styled-components';
import { space, SpaceProps } from 'styled-system';

export type CardBodyProps = SpaceProps;

const CardBody = styled.div<CardBodyProps>`
  ${space}

  ${({ theme }) =>
    theme.brand === 'w4'
      ? `
    // background-color: #28283f;
    padding: 14px;
  `
      : `
      padding: 24px;
      `}
`;

export default CardBody;
