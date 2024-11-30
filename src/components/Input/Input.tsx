import styled, { DefaultTheme } from 'styled-components';
import { InputProps, scales } from './types';

interface StyledInputProps extends InputProps {
  theme: DefaultTheme;
}

const getHeight = ({ scale = scales.MD }: StyledInputProps) => {
  switch (scale) {
    case scales.SM:
      return '32px';
    case scales.LG:
      return '48px';
    case scales.MD:
    default:
      return '32px';
  }
};

const Input = styled.input<InputProps>`
  background-color: rgba(255, 255, 255, 0.1);
  border: 0;
  border-radius: 6px;
  color: ${({ theme }) => theme.colors.text};
  display: block;
  font-size: 16px;
  height: ${getHeight};
  outline: 0;
  padding: 4px 16px;
  width: 100%;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSubtle};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.backgroundDisabled};
    box-shadow: none;
    color: ${({ theme }) => theme.colors.textDisabled};
    cursor: not-allowed;
  }

  &:focus:not(:disabled) {
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
`;

export default Input;
