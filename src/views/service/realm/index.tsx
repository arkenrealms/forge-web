import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '~/components/Button';
import { Skeleton } from '~/ui';
import { trpc } from '~/utils/trpc';
import useWeb3 from '~/hooks/useWeb3';
import type * as Evolution from '@arken/evolution-protocol/types';

async function getSignature(library, web3, address, data = null) {
  const hash = library?.bnbSign
    ? (await library.bnbSign(address, data))?.signature
    : await web3.eth.personal.sign(data, address, null);

  return {
    hash,
    address,
  };
}

export default function (props) {
  const { account, library, web3 } = useWeb3();
  // const { data: shards }: any = evolution.trpc.game.getEras.useQuery();
  const { data: shards } = trpc.evolution.getShards.useQuery<Evolution.Shard.Shard[]>({
    where: { realmId: { equals: props.match.params.id } },
  });
  const { data: info }: any = trpc.evolution.info.useQuery();

  const { mutateAsync: auth } = trpc.evolution.auth.useMutation();
  const { mutateAsync: connectSeer } = trpc.evolution.connectSeer.useMutation(); // evolution.trpc.realm.connectSeer.useMutation();
  const { mutateAsync: createShard } = trpc.evolution.createShard.useMutation(); //evolution.trpc.realm.createShard.useMutation();

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
      <Button
        onClick={async () => {
          const data = 'Authorizing';
          auth({ data, signature: await getSignature(library, web3, account, data) });
        }}>
        Authorize
      </Button>
      <Button onClick={() => connectSeer()}>Connect Seer</Button>
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
