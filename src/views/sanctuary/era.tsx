import React from 'react';
import Era from '~/components/Sanctuary/Era';
import LoreContainer from '~/components/LoreContainer';

const EraView = ({ match }) => {
  const { id }: { id: string } = match.params;
  return (
    <LoreContainer color="dark">
      <Era id={id} />
    </LoreContainer>
  );
};

export default EraView;
