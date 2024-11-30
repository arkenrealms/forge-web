import React, { useEffect, useMemo, useRef, useState, useContext, useCallback } from 'react';
import useSound from 'use-sound';
import {
  Button,
  Heading,
  Toggle,
  Text,
  Link,
  Card,
  CardBody,
  BaseLayout,
  OpenNewIcon,
  Flex,
  ButtonMenu,
  ButtonMenuItem,
} from '~/ui';
import Input from '~/components/Input/Input';
import styled from 'styled-components';
import useI18n from '~/hooks/useI18n';
import { useTranslation } from 'react-i18next';
import Page from '~/components/layout/Page';
import { ConnectNetwork } from '~/components/ConnectNetwork';
import BigNumber from 'bignumber.js';
import useRuneBalance from '~/hooks/useRuneBalance';
import SoundContext from '~/contexts/SoundContext';
import { getBalanceNumber } from '~/utils/formatBalance';
import { useNative, useRxs } from '~/hooks/useContract';
import { getContractAddress, getNativeAddress, getRuneAddress } from '~/utils/addressHelpers';
import { ethers } from 'ethers';
import { useToast } from '~/state/hooks';
import useWeb3 from '~/hooks/useWeb3';
import useApproveConfirmTransaction from '~/hooks/useApproveConfirmTransaction';
import ApproveConfirmButtons from '~/components/account/ApproveConfirmButtons';
import NumericalInput from '~/components/NumericalInput';

const Container = styled.div`
  // margin-bottom: 30px;
  width: 100%;
  height: 100%;
  position: relative;
`;

const ItemCard = styled(Card)`
  position: relative;
  overflow: hidden;
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

const InputPanel = styled.div`
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.background};
  z-index: 1;
  width: 100%;
`;
const InputContainer = styled.div`
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.input};
  box-shadow: ${({ theme }) => theme.shadows.inset};
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

const InputRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: 0.75rem 0.75rem 0.75rem 1rem;
`;

// let initialized = false

const MarketTrade = (props) => {
  const { t } = useTranslation();
  const { address: account } = useWeb3();
  const { web3 } = useWeb3();
  const rxsContract = useRxs();
  const runeContract = useNative();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toastError, toastSuccess } = useToast();
  const [amount, setAmount] = useState('');
  const [rune1Allowance, setRune1Allowance] = useState(new BigNumber(0));

  const runeBalance = useRuneBalance('RUNE');

  const onMax = () => {
    setAmount(getBalanceNumber(runeBalance) + '');
  };

  useEffect(() => {
    async function init() {
      if (!account) return;
      const response = await runeContract.methods.allowance(account, getContractAddress('rxs')).call();
      const currentAllowance1 = new BigNumber(response);
      setRune1Allowance(currentAllowance1);
    }

    init();
  }, [account, amount, runeContract]);

  const { isApproving, isApproved, isConfirmed, isConfirming, handleApprove, handleConfirm } =
    useApproveConfirmTransaction({
      stateOverride: { approvalState: getBalanceNumber(rune1Allowance) > parseFloat(amount) ? 'success' : 'idle' },
      onRequiresApproval: async () => {
        return getBalanceNumber(rune1Allowance) > parseFloat(amount);
      },
      onApprove: () => {
        return runeContract.methods
          .approve(getContractAddress('rxs'), ethers.constants.MaxUint256)
          .send({ from: account });
      },
      onConfirm: () => {
        return rxsContract.methods
          .swap(ethers.utils.parseEther(parseFloat(amount) * 0.99999 + ''))
          .send({ from: account });
      },
      onSuccess: () => {
        toastSuccess(`Sharded!`);
      },
    });

  return (
    <Page>
      <ConnectNetwork />
      <Cards>
        <VerticalCards>
          <Card>
            <CardBody>
              <Flex flexDirection="column" alignItems="center" justifyContent="center">
                <Heading as="h2" size="xl" mb="24px">
                  {t(`Rune Sharder`)}
                </Heading>
                <br />
                <p>
                  This tool is for sharding your <strong>$RUNE</strong> into <strong>$RXS</strong>.
                </p>
                <br />
                <Flex flexDirection="column" alignItems="center" justifyContent="center">
                  <Button
                    variant="text"
                    as={Link}
                    href="https://arkenrealms.medium.com/rune-monthly-report-october-2021-bb31ffb67a49"
                    target="_blank"
                    style={{ color: '#bb955e', padding: '6px 20px', textAlign: 'center' }}>
                    {t('Blog Post')}
                    <OpenNewIcon ml="4px" />
                  </Button>
                  <Button
                    variant="text"
                    as={Link}
                    href="https://bscscan.com/token/0x2098fef7eeae592038f4f3c4b008515fed0d5886"
                    target="_blank"
                    style={{ color: '#bb955e', padding: '6px 20px', textAlign: 'center' }}>
                    {t('$RXS Contract')}
                    <OpenNewIcon ml="4px" />
                  </Button>
                </Flex>
                <br />
                <br />
                <InputPanel>
                  <InputContainer>
                    <InputRow style={{}}>
                      <>
                        <NumericalInput
                          value={amount}
                          onUserInput={(val) => {
                            setAmount(val);
                          }}
                        />
                        <Button onClick={onMax} scale="sm" variant="text">
                          MAX
                        </Button>
                      </>
                    </InputRow>
                  </InputContainer>
                </InputPanel>

                <br />
                <Final>
                  1 <strong>$RUNE</strong> = 10,000 <strong>$RXS</strong>
                </Final>
                <br />
                <br />
                <p>
                  <strong>Warning:</strong> $RUNE will be burned.
                </p>
                <br />
                <br />

                {!account ? <div style={{ fontSize: '1.2rem', color: '#ce0000' }}>Connect your wallet</div> : null}

                {account ? (
                  <>
                    <ApproveConfirmButtons
                      isApproveDisabled={error || isConfirmed || isConfirming || isApproved}
                      isApproving={isApproving}
                      isConfirmDisabled={error || !isApproved || isConfirmed}
                      isConfirming={isConfirming}
                      onApprove={handleApprove}
                      onConfirm={handleConfirm}
                      confirmText="Confirm"
                    />
                  </>
                ) : null}
              </Flex>
            </CardBody>
          </Card>
        </VerticalCards>
      </Cards>
    </Page>
  );
};

export default MarketTrade;

const Final = styled.div`
  margin-top: 1em;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.primary};
`;
const Announce = styled.div`
  margin-top: 1em;
  margin-left: 0.4em;
  color: #ed4b9e;
`;
