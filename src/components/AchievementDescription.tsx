import React from 'react';
import { Text, TextProps } from '~/ui';
import useI18n from '~/hooks/useI18n';
import { useTranslation } from 'react-i18next';
import { TranslatableText } from '~/state/types';
import styled from 'styled-components';

interface AchievementDescriptionProps extends TextProps {
  description?: TranslatableText | TranslatableText[];
}

const Description = styled(Text).attrs({ as: 'p', fontSize: '14px' })`
  display: none;

  ${({ theme }) => theme.mediaQueries.md} {
    display: block;
  }
`;

const AchievementDescription: React.FC<AchievementDescriptionProps> = ({ description, ...props }) => {
  const TranslateString = useI18n();
  const { t } = useTranslation();

  if (!description) {
    return null;
  }

  if (Array.isArray(description)) {
    return (
      <>
        {description.map((i) => (
          <Text key={i as string} as="p" color="textSubtle" fontSize="14px" {...props}>
            {i as any}
          </Text>
        ))}
      </>
    );
  }

  if (typeof description === 'string') {
    return (
      <Text as="p" color="textSubtle" fontSize="14px" {...props}>
        {description}
      </Text>
    );
  }

  // @ts-ignore
  const { id, fallback, data = {} } = description;

  return (
    <Description color="textSubtle" {...props}>
      {TranslateString(id, fallback, data)}
    </Description>
  );
};

export default AchievementDescription;
