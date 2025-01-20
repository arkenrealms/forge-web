import React from 'react';
import addresses from '@arken/node/legacy/contractInfo';
import { itemData, rewardTokenIdMap, RuneNames } from '@arken/node/legacy/data/items';
import { ItemsMainCategoriesType } from '@arken/node/legacy/data/items.type';
import { decodeItem } from '@arken/node/util/decoder';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '~/hooks/useAuth';
import { Link as RouterLink } from 'react-router-dom';
import styled, { css } from 'styled-components';
import Item from '~/components/Item';
import ItemInformation from '~/components/ItemInformation';
import Page from '~/components/layout/Page';
import useWeb3 from '~/hooks/useWeb3';
import { trpc } from '~/utils/trpc';
import { useFetchProfile, useProfile, useToast } from '~/state/hooks';
import { getUserAddressByUsername, getUsername } from '~/state/profiles/getProfile';
import { AutoRenewIcon, BaseLayout, Button, Card, Card3, CardBody, CardHeader, Flex, Heading, Tag, Text } from '~/ui';
import Header from '~/components/account/Header';
import Menu from '~/components/account/Menu';
import Rewards from '~/components/Rewards';
import WalletNotConnected from '~/components/account/WalletNotConnected';
import { getAddress } from '~/utils/addressHelpers';

const contractAddressToKey = {};

for (const contractKey of Object.keys(addresses)) {
  contractAddressToKey[addresses[contractKey][56]] = contractKey;
}

async function getCraftableItemsFromRunes(runes) {
  const result = [];
  const items = itemData[ItemsMainCategoriesType.OTHER].filter((i) => !!i.isCraftable);

  for (const itemDef of items) {
    let matched = true;

    if (!itemDef.recipe?.requirement) continue;

    for (const rune of itemDef.recipe.requirement) {
      if (!RuneNames[rune.id]) continue;

      if (!runes[RuneNames[rune.id].toLowerCase()]) {
        matched = false;
      }

      if (runes[RuneNames[rune.id].toLowerCase()] < rune.quantity) {
        matched = false;
      }
    }

    if (matched) {
      result.push(itemDef);
    }
  }

  return result;
}

const RewardsView = ({ match }) => {
  const { t } = useTranslation();
  const { web3 } = useWeb3();
  const { id }: { id: string } = match.params;
  const { address: _account, library } = useWeb3();
  const [account, setAccount] = useState(id ? id : _account);
  const auth = useAuth();

  // const createPaymentRequest = async (_username) => {
  //   try {
  //     if (!_username) {
  //       toastError('Username not set');
  //       return;
  //     }

  //     setClickedClaim(true);

  //     const sig = (await getSignature(`Claim rewards for ${account}`)).hash;

  //     const rewardRunes = Object.keys(playerRewards).filter((r) => playerRewards[r] > 0);
  //     const rewardAmounts = rewardRunes.map((r) => playerRewards[r]);
  //     const itemIds = [];

  //     // const requestOptions = {
  //     //   method: 'POST',
  //     //   headers: { 'Content-Type': 'application/json' },
  //     //   body: JSON.stringify({ runes: rewardRunes, amounts: rewardAmounts, itemIds, to: account }),
  //     // };

  //     // const res = (await (
  //     //   await fetch(`${endpoints.coordinator}/claim/request/${account}/${_username}/${sig}`, requestOptions)
  //     // ).json()) as any;
  //   } catch (e) {
  //     toastError(e.message || 'Error');
  //     // alert('Referral error. Please report in Telegram or Discord.')
  //   }

  //   const res3 = (await (await fetch(`${endpoints.coordinator}/claim/history/${account}`)).json()) as any;

  //   setPayoutHistory(res3.result.sort((a, b) => b.createdAt - a.createdAt));
  // };

  // const claimItemRewards = async (_username) => {
  //   try {
  //     if (!_username) {
  //       toastError('Username not set');
  //       return;
  //     }

  //     const sig = (await getSignature(`Request evolution rewards to ${account}`)).hash;

  //     const rewardRunes = [];
  //     const rewardAmounts = [];
  //     const itemIds = [];

  //     if (whitelistedAccounts.includes(account)) {
  //       for (const rewardId of Object.keys(rewards)) {
  //         const item = decodeItem(rewards[rewardId].tokenId);
  //         if (!allowedItemIds.includes(item.id)) continue;

  //         itemIds.push({
  //           id: item.id,
  //           rewardRarity: rewards[rewardId].rarity,
  //           rewardName: rewards[rewardId].name,
  //           rewardId,
  //         });
  //       }
  //     }

  //     const requestOptions = {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ runes: rewardRunes, amounts: rewardAmounts, itemIds, to: account }),
  //     };

  //     const res = (await (
  //       await fetch(`${endpoints.coordinator}/claim/request/${account}/${_username}/${sig}`, requestOptions)
  //     ).json()) as any;

  //     if (res.status === 0) {
  //       toastError(res.message || 'Error');
  //     }
  //   } catch (e) {
  //     console.log(e);
  //     // alert('Referral error. Please report in Telegram or Discord.')
  //   }

  //   const res3 = (await (await fetch(`${endpoints.coordinator}/claim/history/${account}`)).json()) as any;

  //   setPayoutHistory(res3.result.sort((a, b) => b.createdAt - a.createdAt));
  // };

  if (!auth?.profile) {
    return (
      <Card3>
        <CardBody>
          <p
            style={{
              textAlign: 'left',
              fontWeight: 'normal',
              fontFamily: 'Cambria, Verdana, Arial, Helvetica, sans-serif',
              textTransform: 'none',
              fontSize: '0.9rem',
            }}>
            {t('You cannot claim rewards until you have created an account.')}
          </p>
          <br />
          <br />
          <Button
            scale="sm"
            as={RouterLink}
            to="/register"
            onClick={() => {
              window.scrollTo(0, 0);
            }}>
            {t('Create Account')}
          </Button>
          <br />
          <br />
        </CardBody>
      </Card3>
    );
  }
  return (
    <Page>
      <Header address={account}>
        <Menu params={match.params} activeIndex={4} />
      </Header>
      <br />
      {account ? (
        <Rewards />
      ) : (
        <Card>
          <CardBody>
            <WalletNotConnected />
          </CardBody>
        </Card>
      )}
    </Page>
  );
};

export default RewardsView;
