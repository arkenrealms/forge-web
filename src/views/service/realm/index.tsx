import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '~/components/Button';
import { Skeleton } from '~/ui';
import * as evolution from '~/utils/evolution';
import type { Types } from '@arken/node/modules/core';

export default function (props) {
  const { data: shards }: any = evolution.trpc.game.getEras.useQuery();
  // const { data: shards } = evolution.trpc.realm.getShards.useQuery({
  //   where: { realmId: { equals: props.match.params.id } },
  // });

  const { mutate: connectSeer } = evolution.trpc.job.updateMetrics.useMutation(); // evolution.trpc.realm.connectSeer.useMutation();
  const { mutate: createShard } = evolution.trpc.job.updateMetrics.useMutation(); //evolution.trpc.realm.createShard.useMutation();

  return (
    <>
      <Button onClick={connectSeer}>Connect Seer</Button>
      <Button onClick={createShard}>Create Shard</Button>
      {shards?.length ? (
        shards.map((shard: any) => {
          return (
            <div>
              <h3>{shard.name}</h3>
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
