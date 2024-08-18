import React, { useState, useRef, useEffect, useContext } from 'react';
import cx from 'classnames';
import styled from 'styled-components';
import { Text } from '~/ui';
import { Modal, useModal, InjectedModalProps } from '~/components/Modal';
import RuneDetailsModal from '~/components/RuneDetailsModal';
import { getRuneAddress } from '~/utils/addressHelpers';
import CraftModal from '~/components/CraftModal';
import TradeModal from '~/components/TradeModal';
import history from '~/routerHistory';
import EquipModal from '~/components/EquipModal';
import UnequipModal from '~/components/UnequipModal';
import TransferModal from '~/components/TransferModal';
import TransmuteModal from '~/components/TransmuteModal';
import TrianglesBox from './TrianglesBox';
import useClickOutside from '~/utils/hooks/useClickOutside';
import ItemsContext from '~/contexts/ItemsContext';
import SoundContext from '~/contexts/SoundContext';

const Container = styled.div`
  user-select: none;

  &:hover {
    cursor: url('/images/cursor3.png'), pointer;
  }
`;

enum ModalOptions {
  NONE = 0,
  DETAILS = 1,
  TRADE = 2,
  CRAFT = 3,
  EQUIP = 4,
  TRANSFER = 5,
  CANCEL = 6,
  UNEQUIP = 7,
  UPGRADE = 8,
  TRANSMUTE = 9,
  SKIN = 10,
}

export default ({ name, item, symbol, details, onClose = undefined, style = {} }) => {
  const { closeModal } = useContext(ItemsContext);
  const [selectedOption, setSelectedOption] = useState(ModalOptions.DETAILS);
  const modalRef = useRef<HTMLDivElement>(null);
  const { playSelect } = useContext(SoundContext);
  const isRune = name.indexOf('Rune') !== -1;
  const [onPresentCraftModal] = useModal(<CraftModal onSuccess={() => {}} />);
  const [onPresentTradeModal] = useModal(<TradeModal item={item} onSuccess={() => {}} />);
  const [onPresentEquipModal] = useModal(<EquipModal tokenId={item.tokenId} onSuccess={() => {}} />);
  const [onPresentUnequipModal] = useModal(<UnequipModal tokenId={item.tokenId} onSuccess={() => {}} />);
  const [onPresentTransferModal] = useModal(
    <TransferModal
      symbol={symbol}
      maxAmount={0}
      tokenAddress={isRune ? getRuneAddress(symbol) : null}
      tokenId={item.tokenId}
      onSuccess={() => {}}
    />
  );
  const [onPresentTransmuteModal] = useModal(<TransmuteModal tokenId={item.tokenId} onSuccess={() => {}} />);

  const [onPresentDetailsModal] = useModal(
    <RuneDetailsModal
      tokenAddress={isRune ? getRuneAddress(symbol) : null}
      item={item}
      details={details}
      onSuccess={() => {}}
    />
  );

  const handleClose = onClose ? onClose : closeModal;

  useClickOutside(modalRef, handleClose);

  const onTrade = () => {
    setSelectedOption(ModalOptions.TRADE);
    onPresentTradeModal();
  };

  const onCraft = () => {
    setSelectedOption(ModalOptions.CRAFT)
    history.push('/transmute')
    // onPresentCraftModal()
  };

  const onEquip = () => {
    setSelectedOption(ModalOptions.EQUIP);
    onPresentEquipModal();
  };

  const onUnequip = () => {
    setSelectedOption(ModalOptions.UNEQUIP);
    onPresentUnequipModal();
  };

  const onTransfer = () => {
    setSelectedOption(ModalOptions.TRANSFER);
    onPresentTransferModal();
  };

  const onDetails = () => {
    setSelectedOption(ModalOptions.DETAILS);
    onPresentDetailsModal();
  };

  const onTransmute = () => {
    setSelectedOption(ModalOptions.TRANSMUTE);
    onPresentTransmuteModal();
  };

  const handleKeyPressed = (event: React.KeyboardEvent) => {
    event.stopPropagation();
    event.preventDefault();
    if (event.key === 'ArrowUp') {
      setSelectedOption(Math.max(selectedOption - 1, 0));
      playSelect();
    } else if (event.key === 'ArrowDown') {
      setSelectedOption(Math.min(selectedOption + 1, 6));
      playSelect();
    } else if (event.key === 'Enter') {
      switch (selectedOption) {
        case ModalOptions.TRADE:
          onTrade();
          break;
        case ModalOptions.CRAFT:
          onCraft();
          break;
        case ModalOptions.EQUIP:
          onEquip();
          break;
        case ModalOptions.UNEQUIP:
          onUnequip();
          break;
        case ModalOptions.DETAILS:
          onDetails();
          break;
        case ModalOptions.TRANSMUTE:
          onTransmute();
          break;
        default:
          closeModal && closeModal();
          break;
      }
      closeModal && closeModal();
    }
  };

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.focus();
    }
  }, []);

  return (
    <Container
      ref={modalRef}
      onKeyDown={handleKeyPressed}
      tabIndex={0}
      className="border border-arcane-darkGray w-32 bg-arcane-bgModal absolute top-0 left-0 z-50 mx-6 my-6 outline-none text-white"
      style={style}>
      <div className="flex flex-col p-4" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
        {item.details ? (
          <div
            className={cx(
              {
                'shadow-yellow border-arcane-softYellow border-2': selectedOption === ModalOptions.DETAILS,
              },
              'flex justify-center px-6 py-2 relative border border-arcane-darkGray mb-4'
            )}
            onClick={onDetails}
            onMouseEnter={() => setSelectedOption(ModalOptions.DETAILS)}>
            {selectedOption === ModalOptions.DETAILS && <TrianglesBox />}
            Details
          </div>
        ) : null}
        {item.isTradeable ? (
          <div
            className={cx(
              {
                'shadow-yellow border-arcane-softYellow border-2': selectedOption === ModalOptions.TRADE,
              },
              'flex justify-center px-6 py-2 relative border border-arcane-darkGray mb-4'
            )}
            onClick={onTrade}
            onMouseEnter={() => setSelectedOption(ModalOptions.TRADE)}>
            {selectedOption === ModalOptions.TRADE && <TrianglesBox />}
            Trade
          </div>
        ) : null}
        {item.isCraftable ? (
          <div
            className={cx(
              {
                'shadow-yellow border-arcane-softYellow border-2': selectedOption === ModalOptions.CRAFT,
              },
              'flex justify-center px-6 py-2 relative border border-arcane-darkGray mb-4'
            )}
            onClick={onCraft}
            onMouseEnter={() => setSelectedOption(ModalOptions.CRAFT)}>
            {selectedOption === ModalOptions.CRAFT && <TrianglesBox />}
            Craft
          </div>
        ) : null}
        {item.isEquipable ? (
          <div
            className={cx(
              {
                'shadow-yellow border-arcane-softYellow border-2': selectedOption === ModalOptions.EQUIP,
              },
              'flex justify-center px-6 py-2 relative border border-arcane-darkGray mb-4'
            )}
            onClick={onEquip}
            onMouseEnter={() => setSelectedOption(ModalOptions.EQUIP)}>
            {selectedOption === ModalOptions.EQUIP && <TrianglesBox />}
            Equip
          </div>
        ) : null}
        {item.isEquipped ? (
          <div
            className={cx(
              {
                'shadow-yellow border-arcane-softYellow border-2': selectedOption === ModalOptions.UNEQUIP,
              },
              'flex justify-center px-6 py-2 relative border border-arcane-darkGray mb-4'
            )}
            onClick={onUnequip}
            onMouseEnter={() => setSelectedOption(ModalOptions.UNEQUIP)}>
            {selectedOption === ModalOptions.UNEQUIP && <TrianglesBox />}
            Unequip
          </div>
        ) : null}
        {item.isTransferable ? (
          <div
            className={cx(
              {
                'shadow-yellow border-arcane-softYellow border-2': selectedOption === ModalOptions.TRANSFER,
              },
              'flex justify-center px-6 py-2 relative border border-arcane-darkGray mb-4'
            )}
            onClick={onTransfer}
            onMouseEnter={() => setSelectedOption(ModalOptions.TRANSFER)}>
            {selectedOption === ModalOptions.TRANSFER && <TrianglesBox />}
            Transfer
          </div>
        ) : null}
        {item.isTransmutable ? (
          <div
            className={cx(
              {
                'shadow-yellow border-arcane-softYellow border-2': selectedOption === ModalOptions.TRANSMUTE,
              },
              'flex justify-center px-6 py-2 relative border border-arcane-darkGray mb-4'
            )}
            onClick={onTransmute}
            onMouseEnter={() => setSelectedOption(ModalOptions.TRANSMUTE)}>
            {selectedOption === ModalOptions.TRANSMUTE && <TrianglesBox />}
            Transmute
          </div>
        ) : null}
        <div
          className={cx(
            {
              'shadow-yellow border-arcane-softYellow border-2': selectedOption === ModalOptions.CANCEL,
            },
            'flex justify-center px-6 py-2 relative border border-arcane-darkGray'
          )}
          onClick={handleClose}
          onMouseEnter={() => setSelectedOption(ModalOptions.CANCEL)}>
          {selectedOption === ModalOptions.CANCEL && <TrianglesBox />}
          Cancel
        </div>
      </div>
    </Container>
  );
};
