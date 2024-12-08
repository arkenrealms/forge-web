import React from 'react';
import Race from '~/components/Sanctuary/Race';
import LoreContainer from '~/components/LoreContainer';

const RaceView = ({ match }) => {
  const { id }: { id: string } = match.params;
  return (
    <LoreContainer color="red">
      <Race id={id} />
    </LoreContainer>
  );
};

export default RaceView;
