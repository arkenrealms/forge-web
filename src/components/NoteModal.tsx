import React, { useState, useRef } from 'react';
import styled, { css, createGlobalStyle } from 'styled-components';
import useSound from 'use-sound';
import useCache from '~/hooks/useCache';
import { Modal, useModal, InjectedModalProps } from '~/components/Modal';
import useInventory from '~/hooks/useInventory';
import { decodeItem } from '@arken/node/util/decoder';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { useToast } from '~/state/hooks';
import Item from '~/components/Item';
import { useTranslation } from 'react-i18next';
import useApproveConfirmTransaction from '~/hooks/useApproveConfirmTransaction';
import { useArcaneItems, useMasterchef, useBarracks, useBlacksmith } from '~/hooks/useContract';
import { useProfile } from '~/state/hooks';
import { motion } from 'framer-motion';
import { getContractAddress } from '~/utils/addressHelpers';
import useGetWalletItems from '~/hooks/useGetWalletItems';
import useWeb3 from '~/hooks/useWeb3';
import useLive from '~/hooks/useLive';
import { Button, Flex } from '~/ui';

interface NoteModalProps extends InjectedModalProps {
  tokenId: string;
  onSuccess: () => void;
}

const ModalContent = styled.div`
  margin-bottom: 16px;
`;

const Actions = styled.div``;

const NoteModal: React.FC<NoteModalProps> = ({ tokenId, onSuccess, onDismiss }) => {
  const { call } = useLive();
  const { userNotes } = useCache();
  const { t } = useTranslation();
  const { address: account } = useWeb3();
  const { toastError, toastSuccess } = useToast();
  const item = decodeItem(tokenId);
  const [note, setNote] = useState('');
  const { fetchUserData } = useCache();

  const saveNote = async function () {
    await call('CS_SaveNoteRequest', { tokenId, note });
    fetchUserData(account);
    toastSuccess('Note saved');
    onDismiss();
  };

  return (
    <Modal title={t('Note')} onDismiss={onDismiss}>
      <ModalContent
        css={css`
          color: #ddd;
          position: relative;
        `}>
        <Flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          css={css`
            width: 100%;
            max-width: 425px;
          `}>
          <textarea
            onChange={(e) => setNote(e.target.value)}
            rows={10}
            style={{ width: '100%' }}
            value={note || userNotes[item.tokenId]}
            css={css`
              border: 3px solid #333;
              background-color: #111;
              padding: 10px;
              border-radius: 6px;
              font-size: 1.1rem;
              color: #aaa;
            `}></textarea>
        </Flex>
      </ModalContent>
      <Actions
        css={css`
          text-align: center;
        `}>
        <Button onClick={saveNote}>Save</Button>
      </Actions>
    </Modal>
  );
};

export default NoteModal;
