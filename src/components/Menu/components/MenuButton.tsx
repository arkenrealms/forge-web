import styled from 'styled-components';
import Button from '../../Button/Button';

const MenuButton = styled(Button)`
  color: ${({ theme }) => theme.colors.text};
  padding: 1px 8px 0 5px;
  border-radius: 8px;
  background: none !important;
`;

export default MenuButton;
