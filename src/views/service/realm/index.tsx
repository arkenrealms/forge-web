import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '~/components/Button';
import { Skeleton } from '~/ui';
import * as evolution from '~/utils/evolution';
import type * as Evolution from '@arken/evolution-protocol/types';

export default function (props) {
  // const { data: shards }: any = evolution.trpc.game.getEras.useQuery();
  const { data: shards } = evolution.trpc.getShards.useQuery<Evolution.Shard.Shard[]>({
    where: { realmId: { equals: props.match.params.id } },
  });
  const { data: info }: any = evolution.trpc.info.useQuery();

  const { mutate: connectSeer } = evolution.trpc.connectSeer.useMutation(); // evolution.trpc.realm.connectSeer.useMutation();
  const { mutate: createShard } = evolution.trpc.createShard.useMutation(); //evolution.trpc.realm.createShard.useMutation();

  return (
    <>
      Info:
      {info ? (
        <>
          {info.version}
          {info.playerCount}
          {info.speculatorCount}
          Games: {info.games.length}
        </>
      ) : null}
      <Button onClick={connectSeer}>Connect Seer</Button>
      <Button onClick={createShard}>Create Shard</Button>
      {shards?.length ? (
        shards.map((shard) => {
          return (
            <div>
              <h3>
                {shard.name} ({shard.endpoint})
              </h3>
              <Button onClick={() => {}}>Shutdown</Button>
            </div>
          );
        })
      ) : (
        <div style={{ padding: 10 }}>
          <Skeleton height="80px" mb="16px" mt="16px" ml="16px" mr="16px" />
        </div>
      )}
    </>
  );
}
