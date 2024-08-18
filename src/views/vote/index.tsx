import React, { useEffect, useRef, useState, useContext } from 'react';

const Vote = ({ active }) => {
  useEffect(() => {
    if (!active) return;
    if (!document) return;

    document.location.href = 'https://vote.arken.gg';
  }, [active]);

  return <></>;
};

export default Vote;
