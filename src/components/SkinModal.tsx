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
import ApproveConfirmButtons from './account/ApproveConfirmButtons';

interface SkinModalProps extends InjectedModalProps {
  tokenId: string;
  onSuccess: () => void;
}

const ModalContent = styled.div`
  margin-bottom: 16px;
`;

const Actions = styled.div``;

const SkinModal: React.FC<SkinModalProps> = ({ tokenId, onSuccess, onDismiss }) => {
  const { call } = useLive();
  const { t } = useTranslation();
  const { address: account } = useWeb3();
  const item = decodeItem(tokenId);
  const { tokenSkins, userSkins, fetchUserData } = useCache();
  const [selectedSkin, setSelectedSkin] = useState(null);
  const [showSkins, setShowSkins] = useState(false);

  const claimSkin = async function () {
    await call('CS_ClaimSkinRequest', { tokenId });
    fetchUserData(account);
  };

  const detachSkin = async function () {
    await call('CS_DetachSkinRequest', { tokenId });
    fetchUserData(account);
  };

  const attachSkin = async function (skin) {
    if (!skin) {
      setShowSkins(true);
      return;
    }

    await call('CS_AttachSkinRequest', { tokenId, skin });
    setSelectedSkin(null);
    fetchUserData(account);
  };

  const icon =
    item.tokenId && tokenSkins[item.tokenId] ? `https://s1.envoy.arken.asi.sh${tokenSkins[item.tokenId]}` : null;

  return (
    <Modal title={t('Skin')} onDismiss={onDismiss}>
      <ModalContent
        css={css`
          color: #ddd;
          position: relative;
        `}>
        {showSkins ? (
          <div
            css={css`
              position: absolute;
              top: 0;
              left: 0;
              z-index: 1;
              width: 100%;
              height: 100%;
              background: #000;

              display: grid;
              grid-auto-columns: 1fr;
              grid-column-gap: 5px;
              grid-row-gap: 5px;
              grid-template-columns: 1fr 1fr 1fr;
              grid-template-rows: auto auto;
            `}>
            {!userSkins[item.id]?.length ? <>No skins found</> : null}
            {userSkins[item.id]?.length > 0
              ? userSkins[item.id].map((s) => (
                  <div
                    onClick={() => {
                      setSelectedSkin(s);
                      setShowSkins(false);
                    }}
                    css={css`
                      width: 100px;
                      height: 100px;
                      background: url(${`https://s1.envoy.arken.asi.sh${s}`}) no-repeat 0 0;
                      background-size: 100%;
                      cursor: url('/images/cursor3.png'), pointer;
                      border: 1px solid #666;

                      &:hover {
                        border: 1px solid #aaa;
                      }
                    `}
                  />
                ))
              : null}
          </div>
        ) : null}
        <Flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          css={css`
            width: 100%;
            max-width: 425px;
          `}>
          <TransformWrapper>
            <TransformComponent>
              <img src={selectedSkin ? `https://s1.envoy.arken.asi.sh${selectedSkin}` : icon} />
            </TransformComponent>
          </TransformWrapper>

          <br />
          <br />
          {!selectedSkin && icon ? (
            <p>
              <strong>Current Skin:</strong> {icon === item.icon ? 'Default' : 'Custom'}
            </p>
          ) : null}
          <br />
        </Flex>
      </ModalContent>
      <Actions
        css={css`
          text-align: center;
        `}>
        {!showSkins ? (
          <>
            {tokenSkins[item.tokenId] === undefined ? (
              <Button onClick={claimSkin}>Claim</Button>
            ) : selectedSkin ? (
              <>
                <Button onClick={() => attachSkin(selectedSkin)}>Confirm</Button>
                <Button onClick={() => setSelectedSkin(null)}>Cancel</Button>
              </>
            ) : tokenSkins[item.tokenId] === null ? (
              <Button onClick={() => attachSkin(selectedSkin)}>Attach</Button>
            ) : (
              <Button onClick={detachSkin}>Detach</Button>
            )}
            <br />
            <br />
            <em style={{ fontSize: '0.9rem', color: 'rgb(255 156 149)' }}>
              <strong>Disclaimer:</strong> <br />
              This is a beta feature.
              <br />
              It will likely work fine.
              <br />
              But maybe it doesn't.
            </em>
          </>
        ) : null}
      </Actions>
    </Modal>
  );
};

export default SkinModal;
