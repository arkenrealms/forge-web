import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AddLiquidity from './index';

const OLD_PATH_STRUCTURE = /^(0x[a-fA-F0-9]{40})-(0x[a-fA-F0-9]{40})$/;

export function RedirectOldAddLiquidityPathStructure() {
  const { currencyIdA } = useParams();
  const navigate = useNavigate();

  const match = currencyIdA.match(OLD_PATH_STRUCTURE);
  if (match?.length) {
    navigate(`/swap/add/${match[1]}/${match[2]}`, { replace: true });
    return null;
  }

  return <AddLiquidity />;
}

export function RedirectDuplicateTokenIds() {
  const { currencyIdA, currencyIdB } = useParams();
  const navigate = useNavigate();

  if (currencyIdA.toLowerCase() === currencyIdB.toLowerCase()) {
    navigate(`/swap/add/${currencyIdA}`, { replace: true });
    return null;
  }

  return <AddLiquidity />;
}
