import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LoreBlock1 from '~/components/LoreBlock1';
import { Skeleton } from '~/ui';
import { trpc } from '~/utils/trpc';
import type * as Arken from '@arken/node/types';

export default function (props) {
  const { data: realms } = trpc.seer.core.getRealms.useQuery<Arken.Core.Types.Realm[]>({
    where: { gameId: { equals: props.match.params.id } },
  });

  if (!realms?.length)
    return (
      <div style={{ padding: 10 }}>
        <Skeleton height="80px" mb="16px" mt="16px" ml="16px" mr="16px" />
      </div>
    );

  return (
    <>
      {realms.map((realm: Arken.Core.Types.Realm) => {
        return <Link to={'/service/realm/' + realm.id}>{realm.name}</Link>;
      })}
    </>
  );
}
