import React, { useState, useRef, useEffect } from 'react';
import useI18n from '~/hooks/useI18n';
import { useTranslation } from 'react-i18next';
import {
  Heading,
  Text,
  BaseLayout,
  AutoRenewIcon,
  Button,
  Card,
  CardBody,
  Skeleton,
  CheckmarkCircleIcon,
  Flex,
  Tag,
  LinkExternal,
  PrizeIcon,
  OpenNewIcon,
  BlockIcon,
} from '~/ui';
import { Modal, useModal, InjectedModalProps } from '~/components/Modal';
import ConnectModal from '~/components/WalletModal/ConnectModal';
import AccountModal from '~/components/WalletModal/AccountModal';
import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';
import CardHeader from '~/components/account/CardHeader';
import Collectibles from '~/components/account/Collectibles';
import WalletNotConnected from '~/components/account/WalletNotConnected';
import StatBox from '~/components/account/StatBox';
import EditProfileAvatar from '~/components/account/EditProfileAvatar';
import AchievementsList from '~/components/AchievementsList';
import useAuth from '~/hooks/useAuth';
import { UnsupportedChainIdError } from '@web3-react/core';
import useWeb3 from '~/hooks/useWeb3';
import { Config, ConnectorNames } from '~/components/WalletModal/types';
import { useProfile } from '~/state/hooks';
// import WinCard from '~/views/Dashboard/components/WinCard'
import Inventory from '~/components/Inventory';
import nftList from '~/config/constants/nfts';
import useGetWalletNfts from '~/hooks/useGetWalletNfts';
import { NavLink } from 'react-router-dom';

const StyledCard = styled(Card)`
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  // margin-bottom: 25px;
  border-image: none;
  background-color: rgb(39 38 44 / 80%);
  border: solid 2px rgba(0, 0, 0, 0.7);
  background-image: linear-gradient(180deg, transparent 0, rgba(0, 0, 0, 0.42) 50%, transparent),
    url(/images/background.jpeg);

  & > div {
    // background-size: 400px;
    border: solid 2px rgba(133, 133, 133, 0.1);
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    margin: 0;
    max-width: none;
    // margin-bottom: 25px;
  }
`;

let init = false;

export const ConnectNetwork = ({ showConnect = true, ...rest }) => {
  const { account, connector } = useWeb3();
  const [showLearnMore, setShowLearnMore] = useState(false);
  const { login, logout, error } = useAuth();
  const [onPresentConnectModal] = useModal(<ConnectModal login={login} />);

  useEffect(
    function () {
      if (init) return;

      init = true;

      login(ConnectorNames.Injected);
    },
    [login]
  );
  // @ts-ignore
  const { ethereum } = window;

  const addPolygonToMetamask = () => {
    if (ethereum) {
      // @ts-ignore
      ethereum
        .request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x89',
              chainName: 'Polygon Network',
              rpcUrls: ['https://rpc-mainnet.maticvigil.com/'],
              iconUrls: [
                'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0/logo.png',
              ],
              blockExplorerUrls: ['https://explorer.matic.network/'],
              nativeCurrency: {
                name: 'Matic Token',
                symbol: 'MATIC',
                decimals: 18,
              },
            },
          ], // you must have access to the specified account
        })
        .then((result: any) => {
          // window.location.reload();
        })
        .catch((e: any) => {
          alert('An error occurred. Please seek help in Telegram chat. Error code: ' + e.code);
          if (e.code === 4001) {
            // EIP-1193 userRejectedRequest error
            console.log('We can encrypt anything without the key.');
          } else {
            console.error(e);
          }
        });
    }
  };

  const addBscToMetamask = () => {
    if (ethereum) {
      // @ts-ignore
      ethereum
        .request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x38',
              chainName: 'Binance Smart Chain Mainnet',
              rpcUrls: ['https://bsc-dataseed1.binance.org'],
              iconUrls: ['https://dex-bin.bnbstatic.com/static/images/networks/chain-icon.svg'],
              blockExplorerUrls: ['https://bscscan.com'],
              nativeCurrency: {
                name: 'BNB Token',
                symbol: 'BNB',
                decimals: 18,
              },
            },
          ], // you must have access to the specified account
        })
        .then((result: any) => {
          // window.location.reload();
        })
        .catch((e: any) => {
          alert('An error occurred. Please seek help in Telegram chat. Error code: ' + e.code);
          if (e.code === 4001) {
            // EIP-1193 userRejectedRequest error
            console.log('We can encrypt anything without the key.');
          } else {
            console.error(e);
          }
        });
    }
  };

  const LearnMore = () => (
    <>
      {!ethereum ||
      !ethereum.isMetaMask ||
      (Number(ethereum.chainId) !== 67 && Number(ethereum.chainId) !== 137 && Number(ethereum.chainId) !== 1) ? (
        <Flex flexDirection="row" alignItems="center" justifyContent="center">
          <Button
            scale="sm"
            as="a"
            href="https://player.vimeo.com/video/522762925"
            target="_blank"
            style={{ marginRight: 10 }}>
            Learn more about Binance Smart Chain
          </Button>
          <Button
            scale="sm"
            as="a"
            href="https://www.youtube.com/watch?v=K3oZXgCoRSM&ab_channel=LazyRune"
            target="_blank"
            style={{ marginRight: 10 }}>
            Learn more about Arken Realms
          </Button>
          {/* <Button
            scale="sm"
            as="a"
            href="https://ethereum.org/en/what-is-ethereum/"
            target="_blank"
            style={{ marginRight: 10 }}
          >
            Learn more about Ethereum
          </Button>
          <Button scale="sm" as="a" href="https://defirate.com/polygon/" target="_blank">
            Learn more about Polygon
          </Button> */}
        </Flex>
      ) : null}
    </>
  );

  const Options = ({ isError, ...rest2 }) => (
    <div {...rest2}>
      <Flex flexDirection="column" alignItems="center" justifyContent="center">
        {/* <Heading as="h2" size="xl" color="#fff" mb="24px">
          Notice
        </Heading> */}
        <p>Arken requires using the Binance Smart Chain network (BSC) with Metamask.</p>
        <br />
        {/* <p>Support for other networks will be added soon.</p>
          <br /> */}
        {isError ? (
          <Flex flexDirection="row" alignItems="center" justifyContent="center" style={{ marginBottom: 10 }}>
            {ethereum && ethereum.isMetaMask && Number(ethereum.chainId) !== 67 ? (
              <Button scale="md" onClick={addBscToMetamask} style={{ marginRight: 10 }}>
                Switch to BSC
              </Button>
            ) : null}
            {/* {ethereum && ethereum.isMetaMask && Number(ethereum.chainId) !== 1 ? (
                <Button scale="sm" disabled style={{ marginRight: 10 }}>
                  Switch to Ethereum
                </Button>
              ) : null}
              {ethereum && ethereum.isMetaMask && Number(ethereum.chainId) !== 137 ? (
                <Button scale="sm" disabled>
                  Switch to Polygon
                </Button>
              ) : null} */}
          </Flex>
        ) : showConnect ? (
          <Flex flexDirection="row" alignItems="center" justifyContent="center" style={{ marginBottom: 10 }}>
            <Button scale="md" onClick={onPresentConnectModal} style={{ marginRight: 10 }}>
              Connect
            </Button>
            {/* <Button scale="sm" onClick={addPolygonToMetamask} disabled>
                Connect Polygon
              </Button> */}
          </Flex>
        ) : null}
        <p>
          <Button variant="text" onClick={() => setShowLearnMore(!showLearnMore)}>
            Learn More
          </Button>
        </p>
        {showLearnMore ? <LearnMore /> : null}
      </Flex>
    </div>
  );

  if (account) {
    return <></>;
  }

  if (error) {
    return (
      <div>
        {error instanceof UnsupportedChainIdError && !(ethereum && ethereum.isMetaMask) ? (
          <p>Wrong Network</p>
        ) : error instanceof UnsupportedChainIdError && ethereum && ethereum.isMetaMask ? (
          <Options {...rest} isError />
        ) : (
          <p>Could not connect. Arken can only be used with Binance Smart Chain.</p>
        )}
      </div>
    );
  }

  return <Options isError={false} {...rest} />;
};
