import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '~/components/Button';
import { Skeleton } from '~/ui';
import { trpc, trpcClient } from '~/utils/trpc';
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
  const { data: shards } = trpc.evolution.getShards.useQuery<Evolution.Shard.Shard[]>({
    where: { realmId: { equals: props.match.params.id } },
  });
  const { data: info, refetch }: any = trpc.evolution.info.useQuery();
  const { mutateAsync: auth } = trpc.evolution.auth.useMutation();
  const { mutateAsync: connectSeer } = trpc.evolution.connectSeer.useMutation();
  const { mutateAsync: createShard } = trpc.evolution.createShard.useMutation();
  const [selectedProfile, setSelectedProfile] = useState(undefined);
  return (
    <>
      Selected Profile: {selectedProfile ? selectedProfile.name : 'none'}
      <br />
      <br />
      Info:
      <br />
      {info ? (
        <>
          version: {info.version}
          <br />
          Seer Connected: {info.isSeerConnected ? 'yes' : 'no'}
          <br />
          playerCount: {info.playerCount}
          <br />
          speculatorCount: {info.speculatorCount}
          <br />
          roundId: {info.roundId}
          <br />
          gameMode: {info.gameMode}
          <br />
          isRoundPaused: {info.isRoundPaused ? 'yes' : 'no'}
          <br />
          isBattleRoyale: {info.isBattleRoyale ? 'yes' : 'no'}
          <br />
          isGodParty: {info.isGodParty ? 'yes' : 'no'}
          <br />
          level2open: {info.level2open ? 'yes' : 'no'}
          <br />
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
      <Button
        onClick={() => {
          connectSeer();
          refetch();
        }}>
        Connect Seer
      </Button>
      <Button
        onClick={() => {
          createShard();
          refetch();
        }}>
        Create Shard
      </Button>
      <Button
        onClick={async () => {
          const profileData = await trpcClient.query(
            'seer.evolution.getProfile',
            '0x150F24A67d5541ee1F8aBce2b69046e25d64619c'
          );
          setSelectedProfile(profileData);
        }}>
        getProfile maiev
      </Button>
      <Button
        onClick={async () => {
          const profileData = await trpcClient.query(
            'seer.evolution.getProfile',
            '0xF7252D2a3b95B8069Dfc2Fadd5f4b39D3Ee71122'
          );
          setSelectedProfile(profileData);
        }}>
        getProfile riccardo
      </Button>
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
