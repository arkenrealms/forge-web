import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import { Modal, useModal, InjectedModalProps } from '~/components/Modal';
import { PurchaseModal } from '~/components/PurchaseModal';
import { StakeModal } from '~/components/StakeModal';
import Page from '~/components/layout/Page';
import { Link as RouterLink, NavLink } from 'react-router-dom';
import useWeb3 from '~/hooks/useWeb3';
import useAccount from '~/hooks/useAccount';
import useLive from '~/hooks/useLive';
import { Card, CardBody, Heading, Button } from '~/ui';

const zzz = styled.div``;

const features = {
  'expert-mode': 10000,
};

const Item = styled.div`
  border: 1px solid #bb955e;
  padding: 10px;
  margin-bottom: 20px;
  font-size: 0.9rem;
`;

const RxsView = () => {
  const { walletTokens, stakedTokens } = useAccount();
  const { address } = useWeb3();
  const { call, callUnsigned } = useLive();
  const [status, setStatus] = useState('');
  const [lockedTokens, setLockedTokens] = useState(0);
  const [unlockedTokens, setUnlockedTokens] = useState(0);
  const [unlockedFeatures, setUnlockedFeatures] = useState(undefined);

  const [onPresentPurchaseModal] = useModal(<PurchaseModal defaultAmount={1 + ''} onSuccess={() => {}} />);
  const [onPresentStakeModal] = useModal(<StakeModal defaultAmount={1 + ''} onSuccess={() => {}} />);
  const [onPresentUnstakeModal] = useModal(<StakeModal defaultAmount={1 + ''} onSuccess={() => {}} />);

  const unlockFeature = async (key) => {
    if (stakedTokens >= features[key]) {
      const res = await call('CS_UnlockPremiumFeatureRequest', { key });

      if (res.status === 1) {
        setStatus('Unlocked successfully');
      } else {
        setStatus('Unlock error: ' + res.message);
      }
    } else {
      onPresentPurchaseModal();
    }
  };

  const lockFeature = async (key) => {
    if (stakedTokens >= features[key]) {
      const res = await call('CS_LockPremiumFeatureRequest', { key });

      if (res.status === 1) {
        setStatus('Locked successfully');
      } else {
        setStatus('Lock error: ' + res.message);
      }
    } else {
      onPresentPurchaseModal();
    }
  };

  useEffect(
    function () {
      if (unlockedFeatures !== undefined) return;

      async function run() {
        const res = await callUnsigned('CS_GetUserUnlocksRequest', { address });

        if (res?.status === 1) {
          setUnlockedFeatures(res.data.features);
          setLockedTokens(res.data.locked);
          setUnlockedTokens(res.data.unlocked);
        } else {
          setUnlockedFeatures([]);
        }
      }

      run();
    },
    [callUnsigned, unlockedFeatures, setUnlockedFeatures, setLockedTokens, address]
  );

  return (
    <Page>
      <Card style={{ width: '100%' }}>
        <Heading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
          Arken Realm Shards
        </Heading>
        <hr />
        <CardBody>
          <p>
            Arken Realm Shards (<strong>$RXS</strong>) are the protocol and governance tokens for the Arken ecosystem.{' '}
            <RouterLink to="/tokenomics">Rune Tokenomics</RouterLink> are balanced to promote a healthy inflow/outflow
            of RXS.
            <br />
            <br />
            To purchase Arken Realm Shards, simply <RouterLink to="/swap">swap for them</RouterLink>. Then you'll be
            able to <RouterLink to="/market">purchase items on the market</RouterLink>, or stake them for premium
            unlocks and rewards.
          </p>
        </CardBody>
      </Card>
      <br />
      <Card style={{ width: '100%' }}>
        <Heading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
          Premium Unlocks
        </Heading>
        <hr />
        <CardBody>
          <p>
            There are a number of premium features you can unlock by staking your RXS tokens. You will not lose your
            tokens when staking. Enabling will allocate them so they cannot be re-used until disabled.
            <br />
            <br />
            <strong>Your Wallet:</strong> {walletTokens.toFixed(0)} RXS{' '}
            <Button scale="sm" onClick={() => onPresentPurchaseModal()}>
              Purchase
            </Button>{' '}
            {walletTokens > 0 ? (
              <Button scale="sm" onClick={() => onPresentStakeModal()}>
                Stake
              </Button>
            ) : null}
            <br />
            <strong>Stake Used:</strong> {lockedTokens.toFixed(0)} RXS
            <br />
            <strong>Stake Unused:</strong> {unlockedTokens.toFixed(0)} RXS{' '}
            {unlockedTokens > 0 ? (
              <Button scale="sm" onClick={() => onPresentUnstakeModal()}>
                Unstake
              </Button>
            ) : null}
            <br />
          </p>
          <br />
          {status ? (
            <p>
              {status}
              <br />
              <br />
            </p>
          ) : null}
          <Item>
            <h3 style={{ fontSize: '1.2rem' }}>Zavox's Knowledge</h3>
            <br />
            <p>
              Zavox the wisest sage known in Haerra, and with his knowledge you'll be able to decrypt and use his
              mysterious items.
              <br />
              <br />
              <strong>Required:</strong> 100,000 RXS
              <br />
              <br />
              {unlockedFeatures?.includes('expert-mode') ? (
                <Button onClick={() => lockFeature('expert-mode')}>Disable</Button>
              ) : (
                <Button onClick={() => unlockFeature('expert-mode')}>Enable</Button>
              )}
            </p>
          </Item>
          <Item>
            <h3 style={{ fontSize: '1.2rem' }}>Fellowships</h3>
            <br />
            <p>
              Unlocking fellowships will allow you to recruit heroes to join your cause. They will be able to use your
              equipment in battle and share the rewards with you.
              <br />
              <br />
              <strong>Required:</strong> 1,000,000 RXS
              <br />
              <br />
              {unlockedFeatures?.includes('fellowships') ? (
                <Button onClick={() => lockFeature('fellowships')}>Disable</Button>
              ) : (
                <Button onClick={() => unlockFeature('fellowships')}>Enable</Button>
              )}
            </p>
          </Item>
          <Item>
            <h3 style={{ fontSize: '1.2rem' }}>Expert Mode</h3>
            <br />
            <p>
              Expert mode is a tool to navigate the history of farms that existed in Arken: Runic Raids in an easier and
              quicker way, and chat with other experts.
              <br />
              <br />
              <strong>Required:</strong> 10,000 RXS
              <br />
              <br />
              {unlockedFeatures?.includes('expert-mode') ? (
                <Button onClick={() => lockFeature('expert-mode')}>Disable</Button>
              ) : (
                <Button onClick={() => unlockFeature('expert-mode')}>Enable</Button>
              )}
            </p>
          </Item>
        </CardBody>
      </Card>
    </Page>
  );
};

export default RxsView;
