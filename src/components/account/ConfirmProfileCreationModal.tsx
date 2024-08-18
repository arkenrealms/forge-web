import React from 'react';
import { Text } from '~/ui';
import { Modal, useModal, InjectedModalProps } from '~/components/Modal';
import { useDispatch } from 'react-redux';
import BigNumber from 'bignumber.js';
import useI18n from '~/hooks/useI18n';
import { useTranslation } from 'react-i18next';
import { ethers, BigNumber as BN } from 'ethers';
import { useNative, useRxs, useCharacters, useProfile } from '~/hooks/useContract';
import useApproveConfirmTransaction from '~/hooks/useApproveConfirmTransaction';
import { fetchProfile } from '~/state/profiles';
import { useToast } from '~/state/hooks';
import { REGISTER_COST } from '../../views/account/ProfileCreation/config';
import ApproveConfirmButtons from './ApproveConfirmButtons';

interface Props {
  tokenId: number;
  account: string;
  teamId: number;
  minimumRuneRequired: BigNumber;
  allowance: BigNumber;
  onDismiss?: () => void;
}

const ConfirmProfileCreationModal: React.FC<Props> = ({
  account,
  teamId,
  tokenId,
  minimumRuneRequired,
  allowance,
  onDismiss,
}) => {
  const { t } = useTranslation();
  const profileContract = useProfile();
  const arcaneCharactersContract = useCharacters();
  const dispatch = useDispatch();
  const { toastSuccess } = useToast();
  const runeContract = useRxs();

  const { isApproving, isApproved, isConfirmed, isConfirming, handleApprove, handleConfirm } =
    useApproveConfirmTransaction({
      onRequiresApproval: async () => {
        try {
          const response = await runeContract.methods.allowance(account, profileContract.options.address).call();
          const currentAllowance = new BigNumber(response as any);
          return currentAllowance.gte(minimumRuneRequired);
        } catch (error) {
          return false;
        }
      },
      onApprove: () => {
        return runeContract.methods
          .approve(profileContract.options.address, allowance.toJSON())
          .send({ from: account });
      },
      onConfirm: () => {
        console.log(teamId, arcaneCharactersContract.options.address, tokenId, account);
        return profileContract.methods
          .createProfile(teamId, arcaneCharactersContract.options.address, ethers.utils.hexlify(BN.from(tokenId)))
          .send({ from: account });
      },
      onSuccess: async () => {
        await dispatch(fetchProfile(account));
        onDismiss();
        toastSuccess('Profile created!');
      },
    });

  return (
    <Modal title="Complete Profile" onDismiss={onDismiss}>
      <Text color="textSubtle" mb="8px">
        {t('Submit username and guild to network...')}
      </Text>
      {/* <Flex justifyContent="space-between" mb="16px">
        <Text>{t('Cost')}</Text>
        <Text>{t(`${REGISTER_COST} RUNE`, { num: REGISTER_COST })}</Text>
      </Flex> */}
      <ApproveConfirmButtons
        isApproveDisabled={isConfirmed || isConfirming || isApproved}
        isApproving={isApproving}
        isConfirmDisabled={!isApproved || isConfirmed}
        isConfirming={isConfirming}
        onApprove={handleApprove}
        onConfirm={handleConfirm}
      />
    </Modal>
  );
};

export default ConfirmProfileCreationModal;
