import BigNumber from 'bignumber.js';
import { formatDistance, parseISO } from 'date-fns';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Counter } from 'react95';
import { decodeItem } from 'rune-backend-sdk/build/util/item-decoder';
import styled, { createGlobalStyle, css } from 'styled-components';
import { Navigation, Pagination, Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import useSound from 'use-sound';
import ApproveConfirmButtons from '~/components/account/ApproveConfirmButtons';
import BottomCTA from '~/components/BottomCTA';
import { ItemInfo } from '~/components/ItemInfo';
import ItemInformation from '~/components/ItemInformation';
import SoundContext from '~/contexts/SoundContext';
import useApproveConfirmTransaction from '~/hooks/useApproveConfirmTransaction';
import useCache from '~/hooks/useCache';
import { useArcaneItems, useMarketContract, useRxs } from '~/hooks/useContract';
import useGetWalletItems from '~/hooks/useGetWalletItems';
import useMarket from '~/hooks/useMarket';
import useMatchBreakpoints from '~/hooks/useMatchBreakpoints';
import useTokenBalance from '~/hooks/useTokenBalance';
import useWeb3 from '~/hooks/useWeb3';
import { useToast } from '~/state/hooks';
import { getUsername } from '~/state/profiles/getProfile';
import { BaseLayout, Button, Card, CardBody, Flex, Heading } from '~/ui';
import { getContractAddress, getRxsAddress } from '~/utils/addressHelpers';
import { getBalanceNumber } from '~/utils/formatBalance';

function pad(n, width = 2, z = '0') {
  n += '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

const Container = styled.div`
  // margin-bottom: 30px;
  width: 100%;
  height: 100%;
  position: relative;
`;

const ItemCard = styled(Card)`
  position: relative;
  overflow: visible;
  font-weight: bold;

  // transform: scale(0.8);
  text-shadow: 1px 1px 1px black;
  // box-shadow: 0 2px 0 0 rgb(0 0 0 / 80%), inset 0 -1px 0 0 rgb(0 0 0 / 10%), 0 0 66px 66px rgb(0 0 0 / 10%);
  filter: contrast(1.08);
  padding: 30px 80px;

  & > div {
    position: relative;
    z-index: 2;
  }
`;

const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;

  & > div {
    grid-column: span 6;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 12;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 6;
    }
  }
`;

const VerticalCards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;

  & > div {
    grid-column: span 12;
    width: 100%;
  }
`;

const Actions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 8px;
`;

// let initialized = false

const Counters = styled.div`
  zoom: 0.8;
`;

const GlobalStyles = createGlobalStyle`
.counter span {
  --react95-digit-bg-color: #000;
  --react95-digit-primary-color: #eee;
  --react95-digit-secondary-color: #000;
}
`;

const CounterBlock = styled.div`
  min-width: 90px;
  text-align: center;
  display: inline-block;
  align-self: center;
  .counter {
    text-align: left;
    background-color: #000;
  }
  p {
    font-size: 15px;
    color: #eee;
  }
`;

const MarketTradeInner = ({ trade }) => {
  const { t } = useTranslation();
  const cache = useCache();
  const { address: account } = useWeb3();
  const { web3 } = useWeb3();
  const { tradesByToken } = useMarket();
  const traderAddress = getContractAddress('market');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toastError, toastSuccess } = useToast();
  const arcaneItemsContract = useArcaneItems();
  const { refresh } = useGetWalletItems();
  const bnbBalance = useTokenBalance(getRxsAddress());
  const rxsContract = useRxs();
  const [relatedTrades, setRelatedTrades] = useState([]);
  const marketContract = useMarketContract();
  const [sellerUsername, setSellerUsername] = useState('');
  const [tradeAvailable, setTradeAvailable] = useState(null);
  const [rxsAllowance, setRxsAllowance] = useState(new BigNumber(0));
  const { isMd, isLg, isXl, isXxl, isXxxl } = useMatchBreakpoints();
  const isMobile = !isMd && !isLg && !isXl && !isXxl && !isXxxl;

  useEffect(() => {
    async function init() {
      if (!account) return;
      const response = await rxsContract.methods.allowance(account, getContractAddress('market')).call();
      const currentAllowance1 = new BigNumber(response);
      setRxsAllowance(currentAllowance1);
    }

    init();
  }, [account, rxsContract]);

  useEffect(() => {
    async function init() {
      if (!trade) return;

      let username = await getUsername(trade.seller);

      if (username === 'Sdadasd') username = 'Rune Official';
      if (username === 'Botter') username = 'Rune Official';
      if (username === 'Testman') username = 'Rune Official';

      setSellerUsername(username);
    }

    init();
  }, [trade]);

  const { isApproving, isApproved, isConfirmed, isConfirming, handleApprove, handleConfirm } =
    useApproveConfirmTransaction({
      stateOverride: { approvalState: getBalanceNumber(rxsAllowance) > parseFloat(trade.price) ? 'success' : 'idle' },
      onRequiresApproval: async () => {
        return getBalanceNumber(rxsAllowance) > parseFloat(trade.price);
      },
      onApprove: () => {
        return rxsContract.methods
          .approve(getContractAddress('market'), ethers.constants.MaxUint256)
          .send({ from: account });
      },
      onConfirm: () => {
        return marketContract.methods
          .buy(trade.seller, trade.item.tokenId, new BigNumber(trade.price).times(new BigNumber(10).pow(18)).toString())
          .send({ from: account });
      },
      onSuccess: () => {
        refresh();

        toastSuccess(`Item bought!`);
      },
    });

  useEffect(() => {
    if (!account || !trade) return;
    // initialized = true

    async function init() {
      const buyer = await marketContract.methods.tradeBuyer(trade.seller, trade.item.tokenId).call({ from: account });

      if (buyer !== '0x0000000000000000000000000000000000000000') {
        setTradeAvailable(true);
      } else {
        setTradeAvailable(false);
      }
    }

    init();
  }, [account, web3, setTradeAvailable, marketContract.methods, trade]);

  const [endCount, setEndCount] = useState({
    days: '0',
    hours: '0',
    minutes: '0',
    seconds: '0',
  });

  useEffect(() => {
    if (!trade) return;
    // trade.releaseAt = new Date().getTime() / 1000 + 10

    const endTimer = setInterval(() => {
      try {
        const now2 = new Date().getTime() / 1000;
        const remainingSeconds = trade.releaseAt - now2;

        // console.log('vvv', remainingSeconds, now2, trade.price, trade.seller)
        if (remainingSeconds < 0) {
          setEndCount({
            days: pad(0),
            hours: pad(0),
            minutes: pad(0),
            seconds: pad(0),
          });
          return;
        }

        const days = Math.floor(remainingSeconds / 24 / 60 / 60);
        const hoursLeft = Math.floor(remainingSeconds - days * 86400);
        const hours = Math.floor(hoursLeft / 3600);
        const minutesLeft = Math.floor(hoursLeft - hours * 3600);
        const minutes = Math.floor(minutesLeft / 60);
        const seconds = Math.floor(remainingSeconds % 60);

        setEndCount({
          days: pad(days),
          hours: pad(hours),
          minutes: pad(minutes),
          seconds: pad(seconds),
        });
      } catch (e) {
        console.log('Market trade countdown issue');
      }
    }, 500);

    return () => {
      clearInterval(endTimer);
    };
  }, [trade]);

  if (!trade) {
    return (
      <Container>
        <Heading as="h2" size="xl" mb="24px">
          {t(`Trade Not Found`)}
        </Heading>
      </Container>
    );
  }

  const delist = async () => {
    await marketContract.methods.delist(trade.item.tokenId).send({ from: account });
  };

  const now = new Date().getTime() / 1000;

  return (
    <Container>
      <GlobalStyles />
      <Cards>
        <VerticalCards>
          <Card>
            <CardBody>
              <Flex flexDirection="column" alignItems="center" justifyContent="center">
                <Heading as="h2" size="xl" mb="24px">
                  {t(`Trade #${trade.id}`)}
                </Heading>

                {/* {!account && tradeAvailable === null ? <>Connect wallet to load availability</> : null} */}

                {/* {account && tradeAvailable === null ? <>Loading Trade...</> : null} */}

                {/* {tradeAvailable !== null ? ( */}
                <>
                  {trade.buyer !== '0xa987f487639920A3c2eFe58C8FBDedB96253ed9B' &&
                  trade.buyer !== '0x0000000000000000000000000000000000000000' ? (
                    <Final>
                      <strong>Private Sale</strong>
                      <br />
                      <br />
                    </Final>
                  ) : null}
                  <Final>
                    <>
                      <strong>Seller:</strong>{' '}
                      <RouterLink to={`/user/${sellerUsername}/inventory`}>{sellerUsername}</RouterLink>
                    </>
                  </Final>
                  <Final>
                    <>
                      <strong>Token ID:</strong>{' '}
                      <a
                        href={`https://envoy.arken.gg/token/${trade.tokenId}`}
                        rel="noreferrer noopener"
                        target="_blank">{`${trade.tokenId.slice(0, 23)}...${trade.tokenId.slice(-3)}`}</a>
                    </>
                  </Final>
                  <Final>
                    <strong>Listed:</strong>{' '}
                    {formatDistance(parseISO(new Date(trade.createdAt).toISOString()), new Date(), {
                      addSuffix: true,
                    })}
                  </Final>
                  {trade.status === 'sold' ? (
                    <Final>
                      <strong>Sold:</strong>{' '}
                      {formatDistance(parseISO(new Date(trade.updatedAt).toISOString()), new Date(), {
                        addSuffix: true,
                      })}
                    </Final>
                  ) : null}
                  <Final>
                    <strong>Price:</strong> {trade.price} RXS (${(trade.price * cache.runes.rxs.price).toFixed(2)})
                  </Final>
                  <Final>
                    <RouterLink to={`/market?seller=${trade.seller}`}>See Other Items</RouterLink>
                  </Final>
                  <br />
                  <br />
                  {/* <p>{trade.item.message}</p> */}
                  <br />
                  <br />

                  <div
                    css={css`
                      position: absolute;
                      bottom: 0;
                      left: 0;
                      width: 100%;
                      padding: 10px;
                      text-align: center;
                    `}>
                    {trade.releaseAt && trade.releaseAt > now ? (
                      <>
                        <Counters>
                          <CounterBlock>
                            <p>DAYS</p>
                            <Counter
                              value={parseInt(endCount.days)}
                              minLength={1}
                              size="md"
                              className="counter"
                              style={{
                                border: 0,
                              }}
                            />
                          </CounterBlock>
                          <CounterBlock>
                            <p>HOURS</p>
                            <Counter
                              value={parseInt(endCount.hours)}
                              minLength={2}
                              size="md"
                              className="counter"
                              style={{
                                border: 0,
                              }}
                            />
                          </CounterBlock>
                          <CounterBlock>
                            <p>MINS</p>
                            <Counter
                              value={parseInt(endCount.minutes)}
                              minLength={2}
                              size="md"
                              className="counter"
                              style={{
                                border: 0,
                              }}
                            />
                          </CounterBlock>
                          <CounterBlock>
                            <p>SECS</p>
                            <Counter
                              value={parseInt(endCount.seconds)}
                              minLength={2}
                              size="md"
                              className="counter"
                              style={{
                                border: 0,
                              }}
                            />
                          </CounterBlock>
                        </Counters>
                        <br />
                        <br />
                      </>
                    ) : null}
                    {tradeAvailable === false ? (
                      <>Trade Unavailable</>
                    ) : trade.seller === account ? (
                      <>
                        <Button onClick={delist}>Delist</Button>
                      </>
                    ) : (
                      <>
                        {trade.buyer === account ||
                        trade.buyer.indexOf('0x0000000000000000000000') !== -1 ||
                        (trade.releaseAt && trade.releaseAt <= now) ? (
                          <>
                            {!account ? (
                              <Announce>Wallet not connected</Announce>
                            ) : parseFloat(trade.price) > getBalanceNumber(bnbBalance) ? (
                              <Announce>Not enough RXS</Announce>
                            ) : (
                              <ApproveConfirmButtons
                                isApproveDisabled={error || isConfirmed || isConfirming || isApproved}
                                isApproving={isApproving}
                                isConfirmDisabled={error || !isApproved || isConfirmed}
                                isConfirming={isConfirming}
                                onApprove={handleApprove}
                                onConfirm={handleConfirm}
                                confirmText="Buy"
                              />
                            )}
                          </>
                        ) : (
                          <>
                            <Announce>Unable to purchase. Seller has specified a specific buyer.</Announce>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </>
                {/* ) : null} */}
              </Flex>
            </CardBody>
          </Card>
        </VerticalCards>
        <VerticalCards>
          <ItemCard style={{ padding: '50px 30px' }}>
            <ItemInfo item={trade.item} hideTokenId useZoom />
          </ItemCard>
        </VerticalCards>
      </Cards>
      {relatedTrades ? (
        <Swiper
          modules={[Navigation, Pagination, Scrollbar]}
          spaceBetween={5}
          slidesPerView={isMobile ? 1 : 4}
          navigation
          style={{ maxWidth: 1200, margin: '0 auto 30px auto' }}>
          {relatedTrades.map((t2) => (
            <SwiperSlide key={t2.name} style={{ height: '100%', position: 'relative' }}>
              <ItemInformation item={decodeItem(t2.tokenId)} showActions={false} showBranches />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : null}
      {/* <br /><br />
      <h3>Other listings of this exact item</h3>
      <br />
      {trade.item.tokenIds.map(tokenId => (
        <>
        <RouterLink to={`/market/trade/${tradesByToken[tokenId].id}`}>{tradesByToken[tokenId].price} RXS</RouterLink>
        </>
      ))} */}
      <BottomCTA />
    </Container>
  );
};

const MarketTrade = (props) => {
  const [playSelect] = useSound('/assets/sounds/select.mp3');
  const [playAction] = useSound('/assets/sounds/action.mp3', { volume: 0.5 });
  const contextState = {
    playSelect,
    playAction,
  };
  return (
    <SoundContext.Provider value={contextState}>
      <MarketTradeInner {...props} />
    </SoundContext.Provider>
  );
};

MarketTrade.defaultProps = {};

export default MarketTrade;

const Final = styled.div`
  margin-top: 1em;
  text-align: center;
  font-size: 20px;
  font-weight: normal;
  color: ${(props) => props.theme.colors.primary};
`;
const Announce = styled.div`
  margin-top: 1em;
  margin-left: 0.4em;
  color: #ed4b9e;
`;
