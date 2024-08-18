import React from 'react';
import NPC from '~/components/Sanctuary/NPC';
import LoreContainer from '~/components/LoreContainer';

const NPCView = ({ match }) => {
  const { id }: { id: string } = match.params;
  return (
    <LoreContainer color="dark">
      <NPC id={id} />
    </LoreContainer>
  );
};

export default NPCView;
