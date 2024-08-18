import React from 'react';
import styled from 'styled-components';
import { useResolvedPath, useMatch, Link } from 'react-router-dom';
import { ButtonMenu, ButtonMenuItem } from '~/ui';
import { useTranslation } from 'react-i18next';

const FarmTabButtons = () => {
  const { t } = useTranslation();

  const resolvedUrl = useResolvedPath('');
  const isExact = useMatch({ path: resolvedUrl.pathname, end: true });

  return (
    <Wrapper>
      <ButtonMenu activeIndex={isExact ? 0 : 1} scale="sm" variant="subtle">
        <ButtonMenuItem as={Link} to={resolvedUrl.pathname}>
          {t('Active')}
        </ButtonMenuItem>
        <ButtonMenuItem as={Link} to={`${resolvedUrl.pathname}/history`}>
          {t('Inactive')}
        </ButtonMenuItem>
      </ButtonMenu>
    </Wrapper>
  );
};

export default FarmTabButtons;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  a {
    padding-left: 12px;
    padding-right: 12px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 16px;
  }
`;
