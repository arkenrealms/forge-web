import React from 'react';
import Act from '~/components/Sanctuary/Act';
import LoreContainer from '~/components/LoreContainer';

const ActView = ({ match }) => {
  const { id }: { id: string } = match.params;
  return (
    <LoreContainer color="red">
      <Act id={id} />
    </LoreContainer>
  );
};

export default ActView;
