import useSettings from '~/hooks/useSettings2';
import React from 'react';
import { useWindupString } from 'windups';

type Props = {
  text: string;
};

const TypeWriter: React.FC<Props> = ({ text }) => {
  const { quality } = useSettings();

  const [itemSelectedDescription] = useWindupString((Array.isArray(text) ? text.join(' ') : text) || '', {
    pace: () => 5,
  });

  if (quality === 'bad') return <>{text}</>;

  return <>{itemSelectedDescription}</>;
};

export default TypeWriter;
