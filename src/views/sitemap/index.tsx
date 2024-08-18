import React, { useState } from 'react';
import Page from '~/components/layout/Page';
import PageWindow from '~/components/PageWindow';
import useWeb3 from '~/hooks/useWeb3';
import { Link as RouterLink, NavLink } from 'react-router-dom';

const Sitemap = () => {
  const { address: account, library } = useWeb3();

  return (
    <Page>
      <PageWindow>
        {account === '0xa987f487639920A3c2eFe58C8FBDedB96253ed9B' ? (
          <>
            <RouterLink to="/account/signup">Sign Up</RouterLink>
          </>
        ) : null}
        <ul>
          <li>
            <RouterLink to="/mod">Mod Panel</RouterLink>
          </li>
          <li>
            <RouterLink to="/roadmap">Roadmap</RouterLink>
          </li>
          <li>
            <RouterLink to="/account/link">Link Account</RouterLink>
          </li>
          <li>
            <RouterLink to="/lore">Lore</RouterLink>
          </li>
        </ul>
      </PageWindow>
    </Page>
  );
};

export default Sitemap;
