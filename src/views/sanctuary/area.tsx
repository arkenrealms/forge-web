import React from 'react';
import Area from '~/components/Sanctuary/Area';
import LoreContainer from '~/components/LoreContainer';

const AreaView = ({ match }) => {
  const { id }: { id: string } = match.params;
  return (
    <LoreContainer color="dark">
      <Area id={id} />
    </LoreContainer>
  );
};

export default AreaView;
