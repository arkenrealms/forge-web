import React, { Dispatch, SetStateAction } from 'react';

const navigateToDirection = (
  newDirection: number,
  currentPage: number,
  setPage: React.Dispatch<React.SetStateAction<[number, number]>>,
  maxPage = 2
) => {
  let resolvedPage = currentPage + newDirection;

  if (resolvedPage > maxPage) {
    resolvedPage = 0;
  }

  if (resolvedPage === -1) {
    resolvedPage = maxPage;
  }

  setPage([resolvedPage, newDirection]);

  return resolvedPage;
};

export default navigateToDirection;
