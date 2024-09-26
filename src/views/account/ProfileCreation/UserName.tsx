import BigNumber from 'bignumber.js';
import { formatDistance, parseISO } from 'date-fns';
import Cookies from 'js-cookie';
import debounce from 'lodash/debounce';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import UIKitInput from '~/components/Input/Input';
import { useModal } from '~/components/Modal';
import nftList from '~/config/constants/nfts';
import { useCharacters } from '~/hooks/useContract';
import useGetWalletNfts from '~/hooks/useGetWalletNfts';
import useHasRuneBalance from '~/hooks/useHasRuneBalance';
import useWeb3 from '~/hooks/useWeb3';
import history from '~/routerHistory';
import { useToast } from '~/state/hooks';
import { AutoRenewIcon, Button, CheckmarkIcon, Flex, Heading, Skeleton, Text, WarningIcon } from '~/ui';
import { getArcaneProfileAddress } from '~/utils/addressHelpers';
import ApproveConfirmButtons from '~/components/account/ApproveConfirmButtons';
import ConfirmProfileCreationModal from '~/components/account/ConfirmProfileCreationModal';
import useProfileCreation from './contexts/hook';

import { REGISTER_COST, USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH } from './config';

enum ExistingUserState {
  IDLE = 'idle', // initial state
  CREATED = 'created', // username has already been created
  NEW = 'new', // username has not been created
}

const profileApiUrl = process.env.REACT_APP_API_PROFILE;
const minimumRuneToRegister = new BigNumber(REGISTER_COST).multipliedBy(new BigNumber(10).pow(18));

const InputWrap = styled.div`
  position: relative;
  max-width: 240px;
`;

const Input = styled(UIKitInput)`
  padding-right: 40px;
`;

const Indicator = styled(Flex)`
  align-items: center;
  height: 24px;
  justify-content: center;
  margin-top: -12px;
  position: absolute;
  right: 16px;
  top: 50%;
  width: 24px;
`;

const UserName: React.FC<any> = () => {
  const [isApproved, setIsApproved] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const { isLoading: nftsLoading, nfts: nftsInWallet } = useGetWalletNfts();
  const arcaneCharactersContract = useCharacters();
  const characterIds = Object.keys(nftsInWallet).map((nftWalletItem) => Number(nftWalletItem));
  const walletNfts = nftList.filter((nft) => characterIds.includes(nft.characterId));
  const [isAcknowledged, setIsAcknoledged] = useState(true);
  const { teamId, userName, actions, minimumRuneRequired, allowance } = useProfileCreation();
  const { t } = useTranslation();
  const { account, library } = useWeb3();
  const { toastError } = useToast();
  const { web3 } = useWeb3();
  const [existingUserState, setExistingUserState] = useState<ExistingUserState>(ExistingUserState.IDLE);
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const hasMinimumRuneRequired = useHasRuneBalance(minimumRuneToRegister);
  const tokenId =
    nftsInWallet && walletNfts && walletNfts.length > 0 && nftsInWallet[walletNfts[0].characterId]
      ? nftsInWallet[walletNfts[0].characterId].tokenIds[0]
      : null;

  const [onPresentConfirmProfileCreation] = useModal(
    <ConfirmProfileCreationModal
      tokenId={tokenId}
      account={account}
      teamId={teamId}
      minimumRuneRequired={minimumRuneRequired}
      allowance={allowance}
      onDismiss={() => {
        history.push('/games');
      }}
    />,
    false
  );
  const isUserCreated = existingUserState === ExistingUserState.CREATED;

  const checkUsernameValidity = debounce(async (value: string) => {
    try {
      setIsLoading(true);
      const res = await fetch(`${profileApiUrl}/users/valid/${value}`);

      if (res.ok) {
        setIsValid(true);
        setMessage('');
      } else {
        const data = await res.json();
        setIsValid(false);
        setMessage(data?.error?.message || 'Username is taken or invalid');
      }
    } finally {
      setIsLoading(false);
    }
  }, 200);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    actions.setUserName(value);
    checkUsernameValidity(value);
  };

  const handleConfirm = async () => {
    try {
      setIsLoading(true);

      const signature = library?.bnbSign
        ? (await library.bnbSign(account, userName))?.signature
        : await web3.eth.personal.sign(userName, account, null); // Last param is the password, and is null to request a signature in the wallet

      const response = await fetch(`${profileApiUrl}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: account,
          username: userName,
          signature,
        }),
      });

      if (response.ok) {
        setExistingUserState(ExistingUserState.CREATED);

        const referer = Cookies.get(`referer`);

        if (referer) {
          try {
            fetch(
              `https://s1.relay.arken.asi.sh/refer/${referer.replace('%2520', ' ')}/${account}/${userName}/${signature}`
            ).catch(() => {
              alert('Referral error. Please report in Telegram or Discord.');
            });
          } catch (e) {
            alert('Referral error. Please report in Telegram or Discord.');
          }
        }
      } else {
        const data = await response.json();
        toastError(data?.error?.message);
      }
    } catch (error) {
      // @ts-ignore
      toastError(error?.message ? error.message : JSON.stringify(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = () => {
    arcaneCharactersContract.methods
      .approve(getArcaneProfileAddress(), tokenId + '')
      .send({ from: account })
      .on('sending', () => {
        setIsApproving(true);
      })
      .on('receipt', () => {
        setIsApproving(false);
        setIsApproved(true);
      })
      .on('error', (error) => {
        toastError('Error', error?.message);
        setIsApproving(false);
      });
  };

  useEffect(() => {
    if (tokenId !== null) {
      // @ts-ignore
      arcaneCharactersContract.methods.getApproved(tokenId + '').call({ from: account }, function (error, res) {
        if (error) return;
        if (res.toLowerCase() === getArcaneProfileAddress().toLowerCase()) {
          setIsApproved(true);
        }
      });
    }
  }, [account, arcaneCharactersContract.methods, tokenId, nftsInWallet, walletNfts]);

  const handleAcknoledge = () => setIsAcknoledged(!isAcknowledged);

  // Perform an initial check to see if the wallet has already created a username
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${profileApiUrl}/users/${account}`);
        const data = await response.json();

        if (response.ok) {
          let dateCreated;
          try {
            dateCreated = formatDistance(parseISO(data.created_at), new Date());
          } catch (e) {
            dateCreated = formatDistance(parseISO(new Date(data.created_at).toISOString()), new Date());
          }
          setMessage(`Created ${dateCreated} ago`);

          actions.setUserName(data.username);
          setExistingUserState(ExistingUserState.CREATED);
          setIsValid(true);
          setIsLoading(false);
        } else {
          setExistingUserState(ExistingUserState.NEW);
        }
      } catch (error) {
        toastError('Error: Unable to verify username');
      }
    };

    if (account) {
      fetchUser();
    }
  }, [account, setExistingUserState, setIsValid, setMessage, actions, toastError, isAcknowledged]);

  return (
    <>
      <Text fontSize="20px" color="textSubtle" bold>
        {t(`Step ${3}`)}
      </Text>
      <Heading as="h3" size="xl" mb="24px">
        {t('Choose Profile Name')}
      </Heading>
      {/* <Text as="p" mb="24px">
        {TranslateString(
          999,
          'This name will be shown in team leaderboards and search results as long as your profile is active.',
        )}
      </Text> */}
      {/* <Card mb="24px">
        <CardBody>
          <Heading as="h4" size="lg" mb="8px">
            {t('Set Your Name')}
          </Heading>
          <Text as="p" color="textSubtle" mb="24px">
            {TranslateString(
              840,
              'Your name must be at least 3 and at most 15 standard letters and numbers long. You can’t change this once you click Confirm.',
            )}
          </Text> */}
      {existingUserState === ExistingUserState.IDLE ? (
        <Skeleton height="40px" width="240px" />
      ) : (
        <InputWrap>
          <Input
            onChange={handleChange}
            isWarning={userName && !isValid}
            isSuccess={userName && isValid}
            minLength={USERNAME_MIN_LENGTH}
            maxLength={USERNAME_MAX_LENGTH}
            disabled={isUserCreated}
            placeholder={t('Enter your name...')}
            value={userName}
          />
          <Indicator>
            {isLoading && <AutoRenewIcon spin />}
            {!isLoading && isValid && userName && <CheckmarkIcon color="success" />}
            {!isLoading && !isValid && userName && <WarningIcon color="failure" />}
          </Indicator>
        </InputWrap>
      )}
      <Text color="textSubtle" fontSize="14px" py="4px" mb="16px" style={{ minHeight: '30px' }}>
        {message}
      </Text>
      {/* <Text as="p" color="failure" mb="8px">
            {TranslateString(
              1100,
              "Only reuse a name from other social media if you're OK with people viewing your wallet. You can't change your name once you click Confirm.",
            )}
          </Text> */}
      {/* <label
        htmlFor="checkbox"
        style={{ display: 'block', cursor: 'url("/images/cursor3.png"), pointer', marginBottom: '24px' }}
      >
        <Flex alignItems="center">
          <div style={{ flex: 'none' }}>
            <Checkbox id="checkbox" scale="sm" checked={isAcknowledged} onChange={handleAcknoledge} />
          </div>
          <Text ml="8px">
            {t('I understand that people can see my wallet address using my username')}
          </Text>
        </Flex>
      </label> */}
      {/* <Button onClick={handleConfirm} disabled={!isValid || isUserCreated || isLoading || !isAcknowledged}>
        {t('Confirm')}
      </Button> */}
      <br />
      <br />
      {/* </CardBody>
      </Card> */}
      <ApproveConfirmButtons
        isApproveDisabled={isApproved || isApproving || tokenId === null}
        isApproving={isApproving}
        isConfirmDisabled={!isApproved || !isValid || isUserCreated || isLoading || !isAcknowledged}
        isConfirming={isLoading}
        onApprove={handleApprove}
        onConfirm={handleConfirm}
      />
      {/* <Button
        isLoading={isApproving}
        disabled={isApproved || isApproving || tokenId === null}
        onClick={handleApprove}
        endIcon={isApproving ? <AutoRenewIcon spin color="currentColor" /> : undefined}
      >
        {t('Approve')}
      </Button> */}
      <br />
      <br />
      <div style={{ textAlign: 'center' }}>
        <Button
          onClick={onPresentConfirmProfileCreation}
          disabled={!isValid || !isUserCreated || !hasMinimumRuneRequired}
          style={{ zoom: '1.3', margin: '0 auto' }}>
          {t('Complete Profile')}
        </Button>
      </div>
      {!hasMinimumRuneRequired && (
        <Text color="failure" mt="16px">
          {t(`${REGISTER_COST} RXS fee is required`, { num: REGISTER_COST })}
        </Text>
      )}
    </>
  );
};

export default UserName;
