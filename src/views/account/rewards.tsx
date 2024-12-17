import React from 'react';
import addresses from '@arken/node/legacy/contractInfo';
import { itemData, rewardTokenIdMap, RuneNames } from '@arken/node/legacy/data/items';
import { ItemsMainCategoriesType } from '@arken/node/legacy/data/items.type';
import { decodeItem } from '@arken/node/util/decoder';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import styled, { css } from 'styled-components';
import Item from '~/components/Item';
import ItemInformation from '~/components/ItemInformation';
import Page from '~/components/layout/Page';
import useCache from '~/hooks/useCache';
import useWeb3 from '~/hooks/useWeb3';
import { useFetchProfile, useProfile, useToast } from '~/state/hooks';
import { getUserAddressByUsername, getUsername } from '~/state/profiles/getProfile';
import { AutoRenewIcon, BaseLayout, Button, Card, CardBody, CardHeader, Flex, Heading, Tag, Text } from '~/ui';
import Header from '~/components/account/Header';
import Menu from '~/components/account/Menu';
import WalletNotConnected from '~/components/account/WalletNotConnected';
import ProfileCreation from './ProfileCreation';

const allowedItemIds = [
  // itemDatabase.runeword.find(r => r.name === "Black Drake Scale").id,
  // itemDatabase.runeword.find(r => r.name === "Black Drake Talon").id,
  // itemDatabase.runeword.find(r => r.name === "Glow Fly Powder").id,
  itemData.runeword.find((r) => r.name === "Zavox's Fortune").id,
];

const VerticalCards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;

  & > div {
    grid-column: span 6;
    width: 100%;
  }
`;
const ClaimBox = styled.div`
  background: rgb(59 65 85 / 30%);
  padding: 7px;
  margin-bottom: 20px;
  border-radius: 7px;
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(4, auto);
  margin-bottom: 24px;
`;

const GridItem = styled.div`
  margin-bottom: '10px';
`;

const whitelistedAccounts = [
  '0xa987f487639920A3c2eFe58C8FBDedB96253ed9B',
  '0x82b644E1B2164F5B81B3e7F7518DdE8E515A419d',
  '0xD934BAD7bCaAfdfdEbad863Bc9964B82197cBCc3',
];

const CraftItem = function ({ item }) {
  const [active, setActive] = useState(false);

  return (
    <RouterLink
      to={`/transmute/${item.name.toLowerCase()}`}
      css={css`
        & > div {
          width: 100px;
          height: 100px;
        }
      `}>
      <Item
        itemIndex={'rewardsItem' + item.id}
        item={item}
        isDisabled={false}
        showDropdown
        showName
        showQuantity={false}
        showActions={false}
        hideMetadata
      />
      {/* <div onClick={() => setActive(true)} css={css`
        width: 100px;
        height: 100px;
        background: url(${item.icon}) no-repeat 0 0;
        ${active ? 'display: none;' : ''}
      `}>
        {item.name}
      </div>
      <div css={css`
        ${active ? '' : 'display: none;'}
      `}>
        <ItemInformation item={item} />
      </div> */}
    </RouterLink>
  );
};

const Tag2 = styled(Tag)`
  zoom: 0.7;
  border-color: #bb955e;
  color: #bb955e;
  margin: 5px 5px 0 0;
  opacity: 0.9;
`;

const RewardCardContainer = styled(Flex)`
  padding: 10px;
  margin-bottom: 10px;
`;
const RewardCardItem = ({ reward }) => {
  reward.tokenId = rewardTokenIdMap[reward.name][reward.rarity];

  const item = decodeItem(reward.tokenId);
  return (
    <RewardCardContainer>
      <ItemInformation item={item} showActions={false} hideMetadata quantity={reward.quantity} showBranches={false}>
        {allowedItemIds.includes(item.id) ? (
          <p style={{ color: 'green' }}>Claimable</p>
        ) : (
          <p style={{ color: 'red' }}>Not claimable yet</p>
        )}
      </ItemInformation>
    </RewardCardContainer>
  );
};

const RewardCard = ({ reward }) => {
  return <RewardCardItem reward={reward} />;
};

const MainCard = styled(Card)`
  position: relative;
  font-weight: bold;
  padding: 20px;
  // transform: scale(0.8);
  text-shadow: 1px 1px 1px black;
  // box-shadow: 0 2px 0 0 rgb(0 0 0 / 80%), inset 0 -1px 0 0 rgb(0 0 0 / 10%), 0 0 66px 66px rgb(0 0 0 / 10%);
  text-align: center;
  color: #bb955e;
  text-shadow: 1px 1px 1px black;
  font-weight: bold;
`;

const isLocal = process.env.REACT_APP_RUNE_ENV === 'local';
const endpoints = {
  // cache: 'https://s1.envoy.arken.asi.sh',
  // coordinator: 'https://s1.relay.arken.asi.sh',
  cache: isLocal ? 'http://localhost:6001' : 'https://s1.envoy.arken.asi.sh',
  coordinator: isLocal ? 'http://localhost:5001' : 'https://s1.relay.arken.asi.sh',
};

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

const Rewards = ({ match }) => {
  const { t } = useTranslation();
  const { web3 } = useWeb3();
  const { id }: { id: string } = match.params;
  const { address: _account, library } = useWeb3();
  const [account, setAccount] = useState(id ? id : _account);

  useFetchProfile(account);

  const { toastError, toastSuccess, toastInfo } = useToast();
  const [rewards, setRewards] = useState({});
  const [username, setUsername] = useState('');
  const [payoutHistory, setPayoutHistory] = useState(null);
  const [playerRewards, setPlayerRewards] = useState({});
  const { profile, hasProfile } = useProfile(account);
  const cache = useCache();
  const [itemsRewardCraftable, setItemsRewardCraftable] = useState([]);
  const [clickedClaim, setClickedClaim] = useState(false);

  useEffect(() => {
    async function init() {
      const acc = id || _account;

      if (!acc) return;

      if (acc.indexOf('0x') === 0) {
        setAccount(acc);
      } else {
        setAccount(await getUserAddressByUsername(acc));
      }
    }

    init();
  }, [id, _account]);

  //   if (!account) {
  //     return <Page><WalletNotConnected /></Page>
  //   }

  useEffect(
    function () {
      if (!account) return;
      if (!window) return;

      async function init() {
        try {
          // const account2 = '0x0d835cEa2c866B2be91E82e0b5FBfE6f64eD14cd' // pet account on asia1
          // const account2 = '0xa6d1e757cE8de4341371a8e225f0bBB417D47E31' // rune account on asia1
          const response = await fetch(`${endpoints.cache}/users/${account}/overview.json`);
          const responseData = await response.json();

          if (responseData) {
            setPlayerRewards(responseData.rewards?.runes || {});
            setRewards(responseData.rewards?.items || {});
          }
        } catch (e) {
          console.log(e);
          setPlayerRewards({});
          setRewards({});
        }
      }

      init();

      const inter = setInterval(init, 1 * 60 * 1000);

      return () => {
        clearInterval(inter);
      };
    },
    [account]
  );

  useEffect(
    function () {
      async function main() {
        setItemsRewardCraftable(await getCraftableItemsFromRunes(playerRewards));
      }

      main();
    },
    [playerRewards]
  );

  useEffect(
    function () {
      if (!account) return;

      // accountInitialized = true

      async function init() {
        try {
          const res = await getUsername(account);
          // @ts-ignore
          if (res) {
            setUsername(res);

            const res3 = (await (await fetch(`${endpoints.coordinator}/claim/history/${account}`)).json()) as any;

            setPayoutHistory(res3.result.sort((a, b) => b.createdAt - a.createdAt));
          } else {
            // setUsername(account.slice(0, 5))
          }
        } catch (e) {
          // @ts-ignore
          // setUsername(account.slice(0, 5))
        }
      }

      const inter = setInterval(init, 1 * 60 * 1000);
      init();

      return () => {
        clearInterval(inter);
      };
    },
    [account, setUsername]
  );

  async function getSignature(text = null) {
    const value = text || Math.floor(Math.random() * 999) + '';
    const hash = library?.bnbSign
      ? (await library.bnbSign(account, value))?.signature
      : await web3.eth.personal.sign(value, account, null);

    return {
      value,
      hash,
    };
  }

  const claimRuneRewards = async (_username) => {
    try {
      if (!_username) {
        toastError('Username not set');
        return;
      }

      setClickedClaim(true);

      const sig = (await getSignature(`Request evolution rewards to ${account}`)).hash;

      const rewardRunes = Object.keys(playerRewards).filter((r) => playerRewards[r] > 0);
      const rewardAmounts = rewardRunes.map((r) => playerRewards[r]);
      const itemIds = [];

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ runes: rewardRunes, amounts: rewardAmounts, itemIds, to: account }),
      };

      const res = (await (
        await fetch(`${endpoints.coordinator}/claim/request/${account}/${_username}/${sig}`, requestOptions)
      ).json()) as any;

      if (res.status === 0) {
        toastError(res.message || 'Error');
      }
    } catch (e) {
      // alert('Referral error. Please report in Telegram or Discord.')
    }

    const res3 = (await (await fetch(`${endpoints.coordinator}/claim/history/${account}`)).json()) as any;

    setPayoutHistory(res3.result.sort((a, b) => b.createdAt - a.createdAt));
  };

  const claimItemRewards = async (_username) => {
    try {
      if (!_username) {
        toastError('Username not set');
        return;
      }

      const sig = (await getSignature(`Request evolution rewards to ${account}`)).hash;

      const rewardRunes = [];
      const rewardAmounts = [];
      const itemIds = [];

      if (whitelistedAccounts.includes(account)) {
        for (const rewardId of Object.keys(rewards)) {
          const item = decodeItem(rewards[rewardId].tokenId);
          if (!allowedItemIds.includes(item.id)) continue;

          itemIds.push({
            id: item.id,
            rewardRarity: rewards[rewardId].rarity,
            rewardName: rewards[rewardId].name,
            rewardId,
          });
        }
      }

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ runes: rewardRunes, amounts: rewardAmounts, itemIds, to: account }),
      };

      const res = (await (
        await fetch(`${endpoints.coordinator}/claim/request/${account}/${_username}/${sig}`, requestOptions)
      ).json()) as any;

      if (res.status === 0) {
        toastError(res.message || 'Error');
      }
    } catch (e) {
      console.log(e);
      // alert('Referral error. Please report in Telegram or Discord.')
    }

    const res3 = (await (await fetch(`${endpoints.coordinator}/claim/history/${account}`)).json()) as any;

    setPayoutHistory(res3.result.sort((a, b) => b.createdAt - a.createdAt));
  };

  const finalizeClaim = async (payoutInfo) => {
    try {
      // console.log(payoutInfo.result.data, payoutInfo.result.signedData, account)

      web3.eth.sendTransaction({
        to: '0xEC8e4F50A5EDc7aD5e567E747F2c8056F1A0723b',
        from: account,
        data: payoutInfo.signedData,
      });
    } catch (e) {
      console.log(e);
      toastError('Error claiming: ' + e);
    }

    // async function checkClaim() {
    //   const res2 = (await (await fetch(`${endpoints.coordinator}/claim/check/${account}`)).json()) as any

    //   if (res2.status === 2) {
    //     setPayoutInfo(false)
    //   } else {
    //     setPayoutInfo(res2)

    //     if (res2.result?.status === 'completed' || res2.result?.status !== 'failed') {
    //       setTimeout(checkClaim, 10 * 1000)
    //     }
    //   }
    // }

    // setTimeout(checkClaim, 10 * 1000)
  };

  if (account && !hasProfile) {
    return (
      <Page>
        <ProfileCreation />
      </Page>
    );
  }

  let totalRewardValue = 0;

  Object.keys(playerRewards).forEach((id2) => {
    if (id2 === 'usd') totalRewardValue += playerRewards[id2];
    else totalRewardValue += playerRewards[id2] ? playerRewards[id2] * 0.99 * cache.runes[id2].price : 0;
  });

  const unconfirmedClaim =
    payoutHistory?.filter((item) => item.status === 'processed' || item.status === 'sent').length > 0 || false;

  return (
    <Page>
      <Header address={account}>
        <Menu params={match.params} activeIndex={4} />
      </Header>
      <br />
      {account ? (
        <VerticalCards>
          <div>
            <Card style={{ overflow: 'visible' }}>
              <CardHeader>
                <Flex alignItems="center" justifyContent="space-between">
                  <div>
                    <Heading size="lg" mb="8px">
                      {t('Runes')}
                    </Heading>
                    <Text as="p">{t('Unclaimed runes from your adventures')}</Text>
                    {/* <Text as="p">{t('Collecting points for these quests makes them available again.')}</Text> */}
                  </div>
                </Flex>
              </CardHeader>
              <CardBody>
                <Flex flexDirection="row" alignItems="center" justifyContent="center">
                  <Button
                    disabled={
                      Object.keys(playerRewards).filter((id2) => playerRewards[id2] > 0).length === 0 ||
                      unconfirmedClaim ||
                      clickedClaim
                    }
                    onClick={() => claimRuneRewards(username)}>
                    Claim Runes
                  </Button>
                </Flex>
                <br />
                <br />
                {!profile?.nft ? (
                  <>
                    <br />
                    <br />
                    <p
                      style={{
                        textAlign: 'left',
                        fontWeight: 'normal',
                        fontFamily: 'Cambria, Verdana, Arial, Helvetica, sans-serif',
                        textTransform: 'none',
                        fontSize: '0.9rem',
                      }}>
                      {t('You cannot claim rewards until you have created a Rune account.')}
                    </p>
                    <br />
                    <br />
                    <Button
                      scale="sm"
                      as={RouterLink}
                      to="/account"
                      onClick={() => {
                        window.scrollTo(0, 0);
                      }}>
                      {t('Create Account')}
                    </Button>
                  </>
                ) : (
                  <>
                    {Object.keys(playerRewards).filter((id2) => playerRewards[id2] > 0).length
                      ? Object.keys(playerRewards).map((id2) => {
                          if (!playerRewards[id2]) return null;

                          return (
                            <div key={id2}>
                              {(playerRewards[id2] > 0 ? playerRewards[id2] : 0).toFixed(3)} {id2} <br />
                            </div>
                          );
                        })
                      : null}
                    <br />
                    <Heading as="h2" size="lg" style={{ textAlign: 'center', marginTop: 15 }}>
                      {t(' Craft from Rewards')}
                    </Heading>
                    <hr />
                    {itemsRewardCraftable.length ? (
                      <Grid>
                        {itemsRewardCraftable.map((item) => {
                          return (
                            <GridItem>
                              <CraftItem item={item} />
                            </GridItem>
                          );
                        })}
                      </Grid>
                    ) : (
                      <>None craftable</>
                    )}
                  </>
                )}
              </CardBody>
            </Card>
            <br />
            <Card>
              <CardHeader>
                <Flex alignItems="center" justifyContent="space-between">
                  <div>
                    <Heading size="lg" mb="8px">
                      {t('Items')}
                    </Heading>
                    <Text as="p">{t(`Unclaimed items from your adventures`)}</Text>
                    {/* <Text as="p">{t('Collecting points for these quests makes them available again.')}</Text> */}
                  </div>
                </Flex>
              </CardHeader>
              <CardBody>
                <Flex flexDirection="row" alignItems="center" justifyContent="center">
                  <Button
                    disabled={!whitelistedAccounts.includes(account) || Object.keys(rewards).length === 0}
                    onClick={() => claimItemRewards(username)}>
                    Claim Items
                  </Button>
                </Flex>
                <br />
                <br />
                {Object.keys(rewards).length !== 0 ? (
                  <>
                    {Object.keys(rewards).map((reward, index) => (
                      <RewardCard key={index} reward={rewards[reward]} />
                    ))}
                    <br />
                    <br />
                    {/* {payoutInfo === false ? (
                        <p
                          style={{
                            textAlign: 'left',
                            fontWeight: 'normal',
                            fontFamily: 'Cambria, Verdana, Arial, Helvetica, sans-serif',
                            textTransform: 'none',
                            fontSize: '0.9rem',
                          }}
                        >
                          <Button onClick={claimRewards}>Claim Rewards</Button>
                        </p>
                      ) : payoutInfo?.message !== undefined ? (
                        <p
                          style={{
                            textAlign: 'left',
                            fontWeight: 'normal',
                            fontFamily: 'Cambria, Verdana, Arial, Helvetica, sans-serif',
                            textTransform: 'none',
                            fontSize: '0.9rem',
                          }}
                        >
                          <>{payoutInfo?.message}</>
                        </p>
                      ) : payoutInfo?.result?.status === 'submitted' ? (
                        <p
                          style={{
                            textAlign: 'left',
                            fontWeight: 'normal',
                            fontFamily: 'Cambria, Verdana, Arial, Helvetica, sans-serif',
                            textTransform: 'none',
                            fontSize: '0.9rem',
                          }}
                        >
                          <Button disabled>Claim Sent</Button>
                        </p>
                      ) : payoutInfo?.result?.status === 'processing' ? (
                        <p
                          style={{
                            textAlign: 'left',
                            fontWeight: 'normal',
                            fontFamily: 'Cambria, Verdana, Arial, Helvetica, sans-serif',
                            textTransform: 'none',
                            fontSize: '0.9rem',
                          }}
                        >
                          <Button disabled>Claim Processing</Button>
                        </p>
                      ) : payoutInfo?.result?.status === 'processed' ? (
                        <p
                          style={{
                            textAlign: 'left',
                            fontWeight: 'normal',
                            fontFamily: 'Cambria, Verdana, Arial, Helvetica, sans-serif',
                            textTransform: 'none',
                            fontSize: '0.9rem',
                          }}
                        >
                          <Button onClick={finalizeClaim}>Confirm Claim</Button>
                        </p>
                      ) : payoutInfo?.result?.status === 'completed' ? (
                        <p
                          style={{
                            textAlign: 'left',
                            fontWeight: 'normal',
                            fontFamily: 'Cambria, Verdana, Arial, Helvetica, sans-serif',
                            textTransform: 'none',
                            fontSize: '0.9rem',
                          }}
                        >
                          <Button disabled style={{ backgroundColor: 'green', color: 'white' }}>
                            Claim Received
                          </Button>
                        </p>
                      ) : payoutInfo?.result?.status === 'failed' ? (
                        <p
                          style={{
                            textAlign: 'left',
                            fontWeight: 'normal',
                            fontFamily: 'Cambria, Verdana, Arial, Helvetica, sans-serif',
                            textTransform: 'none',
                            fontSize: '0.9rem',
                          }}
                        >
                          <Button onClick={claimRewards}>Claim Failed. Retry?</Button>
                        </p>
                      ) : (
                        <p
                          style={{
                            textAlign: 'left',
                            fontWeight: 'normal',
                            fontFamily: 'Cambria, Verdana, Arial, Helvetica, sans-serif',
                            textTransform: 'none',
                            fontSize: '0.9rem',
                          }}
                        >
                          Checking payout status...
                        </p>
                      )} */}
                  </>
                ) : null}
              </CardBody>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <Flex alignItems="center" justifyContent="space-between">
                <div>
                  <Heading size="lg" mb="8px">
                    {t('Reward History')}
                  </Heading>
                  <Text as="p">{t('Make sure to finalize the claims!')}</Text>
                  {/* <Text as="p">{t('Collecting points for these quests makes them available again.')}</Text> */}
                </div>
              </Flex>
            </CardHeader>
            <CardBody style={{ padding: '25px 10px 10px' }}>
              {payoutHistory ? (
                <>
                  {payoutHistory.map((payoutItem) => (
                    <ClaimBox key={payoutItem.id}>
                      <h3>
                        Claim #{payoutItem.id}
                        {payoutItem.status === 'submitted' ? (
                          <Tag2
                            outline
                            variant="textDisabled"
                            css={css`
                              float: right;
                            `}>
                            {t('Sent')}
                          </Tag2>
                        ) : payoutItem.status === 'processing' ? (
                          <Tag2
                            outline
                            variant="textDisabled"
                            css={css`
                              float: right;
                            `}>
                            {t('Processing')}
                          </Tag2>
                        ) : payoutItem.status === 'processed' ? (
                          <>
                            <Button scale="sm" onClick={() => finalizeClaim(payoutItem)} style={{ marginLeft: 10 }}>
                              Confirm Claim
                            </Button>
                            <Tag2
                              outline
                              variant="textDisabled"
                              css={css`
                                float: right;
                              `}>
                              {t('Unconfirmed')}
                            </Tag2>
                          </>
                        ) : payoutItem.status === 'voided' ? (
                          <Tag2
                            outline
                            variant="textDisabled"
                            css={css`
                              float: right;
                            `}>
                            Voided
                          </Tag2>
                        ) : payoutItem.status === 'completed' ? (
                          <Tag2
                            outline
                            variant="textDisabled"
                            css={css`
                              float: right;
                            `}>
                            {t('Completed')}
                          </Tag2>
                        ) : payoutItem.status === 'failed' ? (
                          <Tag2
                            outline
                            variant="textDisabled"
                            css={css`
                              float: right;
                            `}>
                            {t('Failed')}
                          </Tag2>
                        ) : (
                          <>
                            <Button scale="sm" disabled style={{ marginLeft: 10 }}>
                              <AutoRenewIcon spin color="currentColor" />
                            </Button>
                          </>
                        )}
                      </h3>
                      <hr />
                      {Object.keys(payoutItem.tokenAddresses).length ? (
                        <div style={{ marginBottom: 0 }}>
                          {Object.keys(payoutItem.tokenAddresses).map((index) => {
                            return (
                              <small key={index} style={{ fontSize: '0.8rem' }}>
                                {contractAddressToKey[payoutItem.tokenAddresses[index]].toUpperCase()}=
                                {payoutItem.tokenAmounts[index].toFixed(3)},{' '}
                              </small>
                            );
                          })}
                        </div>
                      ) : (
                        <></>
                      )}
                      {Object.keys(payoutItem.itemIds).length ? (
                        <div style={{ marginTop: 0 }}>
                          {Object.keys(payoutItem.itemIds).map((index) => {
                            return (
                              <small key={index} style={{ fontSize: '0.8rem' }}>
                                {payoutItem.itemIds[index]?.rewardName}
                                <br />
                              </small>
                            );
                          })}
                        </div>
                      ) : (
                        <></>
                      )}
                    </ClaimBox>
                  ))}
                </>
              ) : null}
            </CardBody>
          </Card>
        </VerticalCards>
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

export default Rewards;
