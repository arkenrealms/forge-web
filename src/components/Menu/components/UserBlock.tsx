import React from 'react';
import useSettings from '~/hooks/useSettings2';
import { Modal, useModal, InjectedModalProps } from '~/components/Modal';
import ConnectModal from '~/components/WalletModal/ConnectModal';
import AccountModal from '~/components/WalletModal/AccountModal';
import Button from '../../Button/Button';
import { Login } from '../../WalletModal/types';

interface Props {
  name?: string;
  address?: string;
  token?: string;
  login: Login;
  logout: () => void;
  sign: (address: string) => void;
}

const UserBlock: React.FC<Props> = ({ name, address, token, sign, login, logout }) => {
  const [onPresentConnectModal] = useModal(<ConnectModal login={login} />);
  const [onPresentAccountModal] = useModal(<AccountModal account={address || ''} logout={logout} />);
  const settings = useSettings();

  // @ts-ignore
  const isFlame = window.ethereum && window.ethereum.isFlame;

  if (isFlame) return <></>;

  const accountEllipsis = name
    ? name
    : address
      ? `${address.substring(0, 2)}...${address.substring(address.length - 4)}`
      : null;

  // console.log(9999, name)
  return (
    <div>
      {address && token ? (
        <Button
          scale="sm"
          variant="tertiary"
          onClick={() => {
            onPresentAccountModal();
          }}>
          {accountEllipsis}
        </Button>
      ) : settings.isCrypto && address && !token ? (
        <Button scale="sm" onClick={() => sign(address)}>
          Sign
        </Button>
      ) : settings.isCrypto && !address && !token ? (
        <Button
          scale="sm"
          onClick={() => {
            onPresentConnectModal();
          }}>
          Connect
        </Button>
      ) : (
        <Button
          scale="sm"
          onClick={() => {
            onPresentConnectModal();
            // onPresentLoginModal()
          }}>
          Login
        </Button>
      )}
    </div>
  );
};

export default React.memo(UserBlock, (prevProps, nextProps) => prevProps.address === nextProps.address);
