import styled from 'styled-components';
import Button from '../../Button/Button';

const MenuButton = styled(Button)`
  width: 30px;
  margin-right: 10px;
  color: ${({ theme }) => theme.colors.text};
  border-radius: 8px;
  background: none !important;
`;

export default MenuButton;
