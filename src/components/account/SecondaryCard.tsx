import styled from 'styled-components';
import { Text } from '~/ui';

// Define the props interface
interface SecondaryCardProps {
  p?: string; // Optional padding prop
}

const SecondaryCard = styled(Text)<SecondaryCardProps>`
  border: 2px solid ${({ theme }) => theme.colors.tertiary};
  border-radius: 16px;
  padding: ${({ p = '24px' }) => p};
`;

export default SecondaryCard;
