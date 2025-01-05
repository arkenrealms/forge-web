

import React, { useMemo } from 'react';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import {
  WalletModalProvider,
} from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  // Add other wallets here if needed
} from '@solana/wallet-adapter-wallets';

require('@solana/wallet-adapter-react-ui/styles.css');

const WalletContext = ({ children }) => {
  // Can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const network = 'devnet';

  // Endpoint for the Solana cluster
  const endpoint = useMemo(() => {
    // switch (network) {
    //   case 'mainnet-beta':
    //     return 'https://api.mainnet-beta.solana.com';
    //   case 'testnet':
    //     return 'https://api.testnet.solana.com';
    //   default:
    //     return 'https://api.devnet.solana.com';
    // }
  }, [network]);

  // Wallets to support
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      // Add other wallets here
    ],
    []
  );

  return <></>

//   return (
//     <ConnectionProvider endpoint={endpoint}>
//       <WalletProvider wallets={wallets} autoConnect>
//         <WalletModalProvider>
//           {children}
//         </WalletModalProvider>
//       </WalletProvider>
//     </ConnectionProvider>
//   );
};

export default WalletContext;