import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Monster from '~/components/Sanctuary/Monster';
import LoreContainer from '~/components/LoreContainer';

const MonsterView = ({ match }) => {
  const { id }: { id: string } = match.params;
  return (
    <LoreContainer>
      <Monster id={id} />
    </LoreContainer>
  );
};

export default MonsterView;
