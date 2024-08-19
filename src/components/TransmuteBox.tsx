import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { BigNumber } from 'bignumber.js';
import { ethers } from 'ethers';
import { useProfile, useToast } from '~/state/hooks';
import useI18n from '~/hooks/useI18n';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { getRuneAddress } from '~/utils/addressHelpers';
import useWeb3 from '~/hooks/useWeb3';
import useGetWalletNfts from '~/hooks/useGetWalletNfts';
import useDoubleApproveConfirmTransaction from '~/hooks/useDoubleApproveConfirmTransaction';
import { useCharacters, useBlacksmith, useProfile as useProfileContract } from '~/hooks/useContract';
import { useERC20 } from '~/hooks/useContract';
import { getBlacksmithAddress } from '~/utils/addressHelpers';
import { Button, Flex, Heading } from '~/ui';
import ApproveConfirmButtons from '~/components/account/ApproveConfirmButtons';
import useGetWalletItems from '~/hooks/useGetWalletItems';
import { ItemsMainCategoriesType } from '@arken/node/data/items.type';
import { itemData } from '@arken/node/data/items';
import Slider from '~/components/Slider';
import useDebouncedChangeHandler from '~/utils/useDebouncedChangeHandler';

type TransmuteProps = {
  runes: number[];
  onDismiss?: (tokenId: string) => void;
  balances?: any;
};

const RuneButton = styled(Button)`
  margin-right: 5px;
`;

const zeroAddress = '0x0000000000000000000000000000000000000000';

const alreadyApproved = [];

const Transmute: React.FC<TransmuteProps> = ({ runes, balances, onDismiss }) => {
  const [runeNames, setRuneNames] = useState(
    runes.map((r) => itemData[ItemsMainCategoriesType.RUNES].find((r2) => r2.id === r).details['Symbol'])
  );

  const [tokenId, setTokenId] = useState(null);
  const { t } = useTranslation();
  const { isLoading, nfts: nftsInWallet } = useGetWalletNfts();
  const dispatch = useDispatch();
  const { profile } = useProfile();
  const { refresh } = useGetWalletItems();
  const blacksmithContract = useBlacksmith();
  const arcaneCharactersContract = useCharacters();
  const profileContract = useProfileContract();
  const { address: account } = useWeb3();
  const { toastSuccess } = useToast();
  const rune1TokenContract = useERC20(getRuneAddress(runeNames[0]));
  const rune2TokenContract = useERC20(getRuneAddress(runeNames[1]));
  const rune3TokenContract = useERC20(getRuneAddress(runeNames[2]));
  const rune4TokenContract = useERC20(getRuneAddress(runeNames[3]));
  const rune5TokenContract = useERC20(getRuneAddress(runeNames[4]));
  const [rune1Allowance, setRune1Allowance] = useState(new BigNumber(0));
  const [rune2Allowance, setRune2Allowance] = useState(new BigNumber(runeNames[1] ? 0 : 1));
  const [rune3Allowance, setRune3Allowance] = useState(new BigNumber(runeNames[2] ? 0 : 1));
  const [rune4Allowance, setRune4Allowance] = useState(new BigNumber(runeNames[3] ? 0 : 1));
  const [rune5Allowance, setRune5Allowance] = useState(new BigNumber(runeNames[4] ? 0 : 1));

  const onApprove = useMemo(() => {
    const res = [];

    if (rune1Allowance.lt(1.0)) {
      res.push(() => {
        return alreadyApproved[runeNames[0]]
          ? () => {}
          : rune1TokenContract.methods
              .approve(getBlacksmithAddress(), ethers.constants.MaxUint256)
              .send({ from: account });
      });
    }

    if (rune2Allowance.lt(1.0)) {
      res.push(() => {
        return alreadyApproved[runeNames[1]]
          ? () => {}
          : rune2TokenContract.methods
              .approve(getBlacksmithAddress(), ethers.constants.MaxUint256)
              .send({ from: account });
      });
    }

    if (rune3Allowance.lt(1.0) && runeNames[2]) {
      res.push(() => {
        return alreadyApproved[runeNames[2]]
          ? () => {}
          : rune3TokenContract.methods
              .approve(getBlacksmithAddress(), ethers.constants.MaxUint256)
              .send({ from: account });
      });
    }

    if (rune4Allowance.lt(1.0) && runeNames[3]) {
      res.push(() => {
        return alreadyApproved[runeNames[3]]
          ? () => {}
          : rune4TokenContract.methods
              .approve(getBlacksmithAddress(), ethers.constants.MaxUint256)
              .send({ from: account });
      });
    }

    if (rune5Allowance.lt(1.0) && runeNames[4]) {
      res.push(() => {
        return alreadyApproved[runeNames[4]]
          ? () => {}
          : rune5TokenContract.methods
              .approve(getBlacksmithAddress(), ethers.constants.MaxUint256)
              .send({ from: account });
      });
    }

    return res.slice(0, runeNames.length);
  }, [
    account,
    runeNames,
    rune1TokenContract,
    rune2TokenContract,
    rune3TokenContract,
    rune4TokenContract,
    rune5TokenContract,
    rune1Allowance,
    rune2Allowance,
    rune3Allowance,
    rune4Allowance,
    rune5Allowance,
  ]);

  useEffect(() => {
    async function init() {
      const response = await rune1TokenContract.methods.allowance(account, getBlacksmithAddress()).call();
      const currentAllowance1 = new BigNumber(response);
      setRune1Allowance(currentAllowance1);
    }

    init();
  }, [account, rune1TokenContract]);

  useEffect(() => {
    async function init() {
      const response = await rune2TokenContract.methods.allowance(account, getBlacksmithAddress()).call();
      const currentAllowance2 = new BigNumber(response);
      setRune2Allowance(currentAllowance2);
    }

    init();
  }, [account, rune2TokenContract]);

  useEffect(() => {
    async function init() {
      const response = await rune3TokenContract.methods.allowance(account, getBlacksmithAddress()).call();
      const currentAllowance3 = new BigNumber(response);
      setRune3Allowance(currentAllowance3);
    }

    init();
  }, [account, rune3TokenContract]);

  useEffect(() => {
    async function init() {
      const response = await rune4TokenContract.methods.allowance(account, getBlacksmithAddress()).call();
      const currentAllowance4 = new BigNumber(response);
      setRune4Allowance(currentAllowance4);
    }

    init();
  }, [account, rune4TokenContract]);

  useEffect(() => {
    async function init() {
      const response = await rune5TokenContract.methods.allowance(account, getBlacksmithAddress()).call();
      const currentAllowance5 = new BigNumber(response);

      setRune5Allowance(currentAllowance5);
    }

    init();
  }, [account, rune5TokenContract]);

  // const liquidityPercentChangeCallback = useCallback(
  //   (value: number) => {
  //     setInnerLiquidityPercentage(value.toString())
  //   },
  //   [setInnerLiquidityPercentage],
  // )

  const [craftAmount, setCraftAmount] = useState(1);

  const [innerLiquidityPercentage, setInnerLiquidityPercentage] = useDebouncedChangeHandler(
    craftAmount as number,
    setCraftAmount
  );

  const onConfirm = useCallback(() => {
    const _item1 = getRuneAddress(runeNames[0]);
    const _item2 = runeNames[1] ? getRuneAddress(runeNames[1]) : zeroAddress;
    const _item3 = runeNames[2] ? getRuneAddress(runeNames[2]) : zeroAddress;
    const _item4 = runeNames[3] ? getRuneAddress(runeNames[3]) : zeroAddress;
    const _item5 = runeNames[4] ? getRuneAddress(runeNames[4]) : zeroAddress;
    const rand = Math.floor(Math.random() * Math.floor(9500));
    // console.log(rand)
    // console.log(_item1, _item2, _item3, _item4, _item5)
    return blacksmithContract.methods
      .transmute(_item1, _item2, _item3, _item4, _item5, rand, craftAmount)
      .send({ from: account });
  }, [blacksmithContract, account, runeNames, craftAmount]);

  const { isApproving, isApproved, isConfirmed, isConfirming, handleApprove, handleConfirm } =
    useDoubleApproveConfirmTransaction({
      onRequiresApproval: async () => {
        try {
          return (
            rune1Allowance.gte(1.0) &&
            rune2Allowance.gte(1.0) &&
            rune3Allowance.gte(1.0) &&
            rune4Allowance.gte(1.0) &&
            rune5Allowance.gte(1.0)
          );
        } catch (error) {
          console.log(error);
          return true;
        }
      },
      onApprove,
      onConfirm,
      onSuccess: (state, payload: any) => {
        refresh();
        // console.log('yyyy', payload)
        try {
          const events = Array.isArray(payload?.events?.ItemMint)
            ? payload?.events?.ItemMint
            : payload?.events?.ItemMint
            ? [payload?.events?.ItemMint]
            : [];

          onDismiss(events.map((e) => e.returnValues[1]) || []);
        } catch (e) {
          console.log('Error crafting', e);
          // @ts-ignore
          onDismiss([]);
        }
      },
    });

  return (
    <>
      <br />
      <br />
      {/* <Heading as="h2" size="lg">
        Approve
      </Heading>
      <br /> */}
      <Flex flexDirection="row" alignItems="center" justifyContent="center">
        {runeNames[0] ? (
          <RuneButton
            scale="sm"
            disabled={!alreadyApproved[runeNames[0]] && rune1Allowance.gte(1.0)}
            onClick={async () => {
              await rune1TokenContract.methods
                .approve(getBlacksmithAddress(), ethers.constants.MaxUint256)
                .send({ from: account });

              const response = await rune1TokenContract.methods.allowance(account, getBlacksmithAddress()).call();
              const currentAllowance1 = new BigNumber(response);
              setRune1Allowance(currentAllowance1);
            }}>
            {runeNames[0]}
          </RuneButton>
        ) : null}
        {runeNames[1] ? (
          <RuneButton
            scale="sm"
            disabled={!alreadyApproved[runeNames[1]] && rune2Allowance.gte(1.0)}
            onClick={async () => {
              await rune2TokenContract.methods
                .approve(getBlacksmithAddress(), ethers.constants.MaxUint256)
                .send({ from: account });

              const response = await rune2TokenContract.methods.allowance(account, getBlacksmithAddress()).call();
              const currentAllowance2 = new BigNumber(response);
              setRune2Allowance(currentAllowance2);
            }}>
            {runeNames[1]}
          </RuneButton>
        ) : null}
        {runeNames[2] ? (
          <RuneButton
            scale="sm"
            disabled={!alreadyApproved[runeNames[2]] && rune3Allowance.gte(1.0)}
            onClick={async () => {
              await rune3TokenContract.methods
                .approve(getBlacksmithAddress(), ethers.constants.MaxUint256)
                .send({ from: account });

              const response = await rune3TokenContract.methods.allowance(account, getBlacksmithAddress()).call();
              const currentAllowance3 = new BigNumber(response);
              setRune3Allowance(currentAllowance3);
            }}>
            {runeNames[2]}
          </RuneButton>
        ) : null}
        {runeNames[3] ? (
          <RuneButton
            scale="sm"
            disabled={!alreadyApproved[runeNames[3]] && rune4Allowance.gte(1.0)}
            onClick={async () => {
              await rune4TokenContract.methods
                .approve(getBlacksmithAddress(), ethers.constants.MaxUint256)
                .send({ from: account });

              const response = await rune4TokenContract.methods.allowance(account, getBlacksmithAddress()).call();
              const currentAllowance4 = new BigNumber(response);
              setRune4Allowance(currentAllowance4);
            }}>
            {runeNames[3]}
          </RuneButton>
        ) : null}
        {runeNames[4] ? (
          <RuneButton
            scale="sm"
            disabled={!alreadyApproved[runeNames[4]] && rune5Allowance.gte(1.0)}
            onClick={async () => {
              await rune5TokenContract.methods
                .approve(getBlacksmithAddress(), ethers.constants.MaxUint256)
                .send({ from: account });

              const response = await rune5TokenContract.methods.allowance(account, getBlacksmithAddress()).call();
              const currentAllowance5 = new BigNumber(response);
              setRune5Allowance(currentAllowance5);
            }}>
            {runeNames[4]}
          </RuneButton>
        ) : null}
      </Flex>
      <br />
      <br />
      <ApproveConfirmButtons
        isApproveDisabled={isConfirmed || isConfirming || isApproved}
        isApproving={isApproving}
        isConfirmDisabled={!!runes.find((r: any) => balances[r - 1] < craftAmount) || !isApproved || isConfirmed}
        isConfirming={isConfirming}
        onApprove={handleApprove}
        onConfirm={handleConfirm}
        confirmText={`Mint ${craftAmount}`}
      />
      <br />
      <br />
      <Slider min={1} max={100} value={innerLiquidityPercentage as number} onChange={setInnerLiquidityPercentage} />
      <br />
      {/* <Button
        disabled={!runes.find((r: any) => balances[r - 1] < craftAmount) || !isApproved || isConfirmed}
        variant="text"
        onClick={transmute50}
        mb="10px"
        style={{ background: 'none' }}
      >
        Transmute {craftAmount}
      </Button>
      <br /> */}
    </>
  );
};

export default Transmute;
