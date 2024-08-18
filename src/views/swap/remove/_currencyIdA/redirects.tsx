import React from 'react';
import { useParams, Navigate } from 'react-router-dom';

const OLD_PATH_STRUCTURE = /^(0x[a-fA-F0-9]{40})-(0x[a-fA-F0-9]{40})$/;

export function RedirectOldRemoveLiquidityPathStructure() {
  // Use the useParams hook to get the tokens parameter
  const { tokens } = useParams();

  // Check if the tokens parameter matches the expected structure
  if (!tokens || !OLD_PATH_STRUCTURE.test(tokens)) {
    return <Navigate to="/swap/pool" replace />;
  }

  // Split the tokens into currency0 and currency1
  const [currency0, currency1] = tokens.split('-');

  // Redirect to the new path
  return <Navigate to={`/swap/remove/${currency0}/${currency1}`} replace />;
}

export default RedirectOldRemoveLiquidityPathStructure;
