import React, { useState } from 'react';
import { css } from 'styled-components';
import { Breadcrumb, Layout, Button, Menu, theme } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Flex, Heading, Text } from '~/ui';
import Page from '~/components/layout/Page';
import { Skeleton } from '~/ui';
import { trpc } from '~/utils/trpc';
import type { Types } from '@arken/node/modules/game';

const { Header, Content, Footer, Sider } = Layout;

export default function () {
  const { data: games } = trpc.seer.game.getGames.useQuery<Types.Game[]>();

  if (!games?.length)
    return (
      <div style={{ padding: 10 }}>
        <Skeleton height="80px" mb="16px" mt="16px" ml="16px" mr="16px" />
      </div>
    );

  return (
    <Page>
      {games.map((game: Types.Game) => {
        return (
          <>
            <Link to={'/service/game/' + game.id}>{game.name}</Link>
          </>
        );
      })}
    </Page>
  );
}
