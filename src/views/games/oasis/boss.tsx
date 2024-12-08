import React from 'react';
import Boss from '~/components/Sanctuary/Boss';
import LoreContainer from '~/components/LoreContainer';

const BossView = ({ match }) => {
  const { id }: { id: string } = match.params;
  return (
    <LoreContainer>
      <Boss id={id} />
    </LoreContainer>
  );
};

export default BossView;
