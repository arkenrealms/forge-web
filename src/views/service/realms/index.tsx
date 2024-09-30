import React, { useState } from 'react';
import { css } from 'styled-components';
import { Breadcrumb, Layout, Button, Menu, theme } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Flex, Heading, Text } from '~/ui';
import Page from '~/components/layout/Page';
import { Skeleton } from '~/ui';
import { trpc } from '~/utils/trpc';
import type { Types } from '@arken/node/modules/core';

export default function () {
  const { data: realms } = trpc.core.core.getRealms.useQuery<Types.Realm[]>();

  if (!realms?.length)
    return (
      <div style={{ padding: 10 }}>
        <Skeleton height="80px" mb="16px" mt="16px" ml="16px" mr="16px" />
      </div>
    );

  return (
    <Page>
      {realms.map((realm: Types.Realm) => {
        return (
          <>
            <Link to={'/service/realm/' + realm.id}>{realm.name}</Link>
          </>
        );
      })}
    </Page>
  );
}
