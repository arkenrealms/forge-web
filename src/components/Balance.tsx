import React, { useEffect, useRef } from 'react';
import CountUp from 'react-countup';
import styled from 'styled-components';
import { Text } from '~/ui';

interface TextProps {
  isDisabled?: boolean;
  fontSize?: string;
  color?: string;
}

interface BalanceProps extends TextProps {
  value?: number;
  decimals?: number;
  unit?: string;
}

const StyledText = styled(Text)<TextProps>`
  color: ${({ isDisabled, color, theme }) => (isDisabled ? theme.colors.textDisabled : color)};
`;

const Balance: React.FC<BalanceProps> = ({
  value = 0,
  fontSize = '32px',
  color = 'text',
  decimals = 3,
  isDisabled = false,
  unit,
}) => {
  const previousValue = useRef(0);

  useEffect(() => {
    previousValue.current = value;
  }, [value]);

  return (
    <StyledText color={color} fontSize={fontSize} isDisabled={isDisabled}>
      {/* @ts-ignore */}
      <CountUp start={previousValue.current} end={value} decimals={decimals} duration={1} separator="," />
      {value && unit && <span>{unit}</span>}
    </StyledText>
  );
};

export default Balance;
