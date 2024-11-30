import React, { ElementType, ReactNode } from 'react';
import { Flex, Heading, Text, TextProps } from '~/ui';
import SecondaryCard from './SecondaryCard';

interface StatBoxProps extends TextProps {
  icon?: any;
  title: ReactNode;
  subtitle: ReactNode;
  isDisabled?: boolean;
  mb?: string;
  style?: any;
  css?: any;
}

const StatBox: React.FC<StatBoxProps> = ({ icon: Icon, title, subtitle, isDisabled = false, ...props }) => {
  return (
    <SecondaryCard>
      <Flex alignItems="start">
        {Icon ? <Icon width="44px" mr="24px" color={isDisabled ? 'textDisabled' : 'currentColor'} /> : null}
        <div>
          <Heading as="h3" size="xl" color={isDisabled ? 'textDisabled' : 'text'}>
            {title}
          </Heading>
          <Text textTransform="uppercase" color={isDisabled ? 'textDisabled' : 'textSubtle'} fontSize="12px" bold>
            {subtitle}
          </Text>
        </div>
      </Flex>
    </SecondaryCard>
  );
};

export default StatBox;
