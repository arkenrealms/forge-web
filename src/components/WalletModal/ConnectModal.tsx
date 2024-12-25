import React from 'react';
import styled from 'styled-components';
import useAuth from '~/hooks/useAuth';
import { Button, Card, CardBody, Flex, Heading } from '~/ui';
import { Link } from '../Link';
import { Modal } from '../Modal';
import { HelpIcon } from '../Svg';
import config from './config';
import { Login } from './types';
import WalletCard from './WalletCard';

interface Props {
  login: Login;
  onDismiss?: () => void;
}

const HelpLink = styled(Link)`
  display: flex;
  align-self: center;
  align-items: center;
  margin-top: 24px;
`;

const StyledCard = styled(Card)`
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  margin-bottom: 20px;
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
    margin-bottom: 20px;
    max-width: none;
  }
`;

const ConnectModal: React.FC<Props> = function ({ login, onDismiss = () => null }) {
  const { error } = useAuth();

  // useEffect(function() {
  //   if (init) return

  //   init = true

  //   login(ConnectorNames.Injected)
  // }, [login])
  // @ts-ignore
  const { ethereum } = window;

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
          window.location.reload();
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

  return (
    <Modal title="Connect to a wallet" onDismiss={onDismiss}>
      <Flex flexDirection="column" alignItems="center" justifyContent="center">
        <Heading as="h3" size="lg" color="#fff" mb="24px">
          Notice
        </Heading>
        <p style={{ color: 'white' }}>Arken requires using the Binance Smart Chain network (BSC) with Metamask.</p>
        <br />
        <Button scale="md" onClick={addBscToMetamask} style={{ marginRight: 10 }}>
          Switch to BSC
        </Button>
        <br />
      </Flex>
      {config.map((entry, index) => (
        <WalletCard
          key={entry.title}
          login={login}
          walletConfig={entry}
          onDismiss={onDismiss}
          mb={index < config.length - 1 ? '8px' : '0'}
        />
      ))}
      {/* <HelpLink href="https://docs.arken.gg/resources/faq#q-how-do-i-set-up-my-wallet" external>
        Note: Binance Chain Wallet has issues and is not recommended.
      </HelpLink> */}
      <HelpLink href="https://docs.arken.gg/resources/faq#q-how-do-i-set-up-my-wallet" external>
        <HelpIcon color="primary" mr="6px" />
        Learn how to connect
      </HelpLink>
    </Modal>
  );
};

export default ConnectModal;
