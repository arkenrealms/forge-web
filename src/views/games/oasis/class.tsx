import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Class from '~/components/Sanctuary/Class';
import LoreContainer from '~/components/LoreContainer';

const ClassView = ({ match }) => {
  const { id }: { id: string } = match.params;
  return (
    <LoreContainer color="dark">
      <Class id={id} />
    </LoreContainer>
  );
};

export default ClassView;
