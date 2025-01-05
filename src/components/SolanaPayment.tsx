import React, { useCallback, useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey, Transaction } from '@solana/web3.js';
import { Program, AnchorProvider, Idl } from '@project-serum/anchor';
import * as borsh from 'borsh';
import nacl from 'tweetnacl';
import axios from 'axios';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

type ArkenChest = {
  address: 'CgvKrCs4MPtatzdWE4ZGBx8yFVWBayyZLzffwbp7apLj';
  metadata: {
    name: 'arkenChest';
    version: '0.1.0';
    spec: '0.1.0';
  };
  instructions: [
    {
      name: 'blockAddress';
      docs: ['Blocks a specific user address from claiming tokens'];
      discriminator: [199, 140, 68, 34, 1, 27, 188, 74];
      accounts: [
        {
          name: 'state';
        },
        {
          name: 'admin';
          signer: true;
          relations: ['state'];
        },
      ];
      args: [
        {
          name: 'address';
          type: 'pubkey';
        },
      ];
    },
    {
      name: 'grantRole';
      docs: ['Grants a role to a user (Dev or Bulk)'];
      discriminator: [218, 234, 128, 15, 82, 33, 236, 253];
      accounts: [
        {
          name: 'state';
        },
        {
          name: 'admin';
          signer: true;
          relations: ['state'];
        },
      ];
      args: [
        {
          name: 'user';
          type: 'pubkey';
        },
        {
          name: 'role';
          type: {
            defined: {
              name: 'role';
            };
          };
        },
      ];
    },
    {
      name: 'initialize';
      docs: ['Initializes the state account'];
      discriminator: [175, 175, 109, 31, 13, 152, 155, 237];
      accounts: [
        {
          name: 'state';
          writable: true;
          signer: true;
        },
        {
          name: 'admin';
          writable: true;
          signer: true;
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
      ];
      args: [
        {
          name: 'authorizedSigner';
          type: 'pubkey';
        },
        {
          name: 'expirySeconds';
          type: 'u64';
        },
      ];
    },
    {
      name: 'sendItems';
      docs: ['Sends items (tokens) to a user after verifying the signature, nonce, and expiry'];
      discriminator: [249, 227, 240, 127, 117, 32, 203, 147];
      accounts: [
        {
          name: 'state';
        },
        {
          name: 'admin';
          signer: true;
          relations: ['state'];
        },
        {
          name: 'authority';
          signer: true;
        },
        {
          name: 'nonceAccount';
          writable: true;
        },
        {
          name: 'fromToken';
          writable: true;
        },
        {
          name: 'toToken';
          writable: true;
        },
        {
          name: 'tokenProgram';
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
        },
      ];
      args: [
        {
          name: 'itemData';
          type: {
            defined: {
              name: 'itemData';
            };
          };
        },
        {
          name: 'signature';
          type: {
            array: ['u8', 64];
          };
        },
      ];
    },
    {
      name: 'setAuthorizedSigner';
      docs: ['Sets a new authorized signer'];
      discriminator: [55, 116, 231, 8, 96, 14, 120, 140];
      accounts: [
        {
          name: 'state';
        },
        {
          name: 'admin';
          signer: true;
          relations: ['state'];
        },
      ];
      args: [
        {
          name: 'newSigner';
          type: 'pubkey';
        },
      ];
    },
    {
      name: 'setExpirySeconds';
      docs: ['Sets a new expiry duration in seconds'];
      discriminator: [48, 136, 31, 0, 89, 175, 21, 24];
      accounts: [
        {
          name: 'state';
        },
        {
          name: 'admin';
          signer: true;
          relations: ['state'];
        },
      ];
      args: [
        {
          name: 'newExpiry';
          type: 'u64';
        },
      ];
    },
  ];
  accounts: [
    {
      name: 'arkenChestState';
      discriminator: [54, 161, 35, 248, 68, 187, 27, 42];
    },
    {
      name: 'nonceAccount';
      discriminator: [110, 202, 133, 201, 147, 206, 238, 84];
    },
  ];
  errors: [
    {
      code: 6000;
      name: 'invalidSignature';
      msg: 'Invalid signature provided.';
    },
    {
      code: 6001;
      name: 'addressBlocked';
      msg: 'Recipient address is blocked.';
    },
    {
      code: 6002;
      name: 'invalidNonce';
      msg: 'Invalid nonce.';
    },
    {
      code: 6003;
      name: 'expired';
      msg: 'The request has expired.';
    },
  ];
  types: [
    {
      name: 'arkenChestState';
      docs: ['Define State Account'];
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'admin';
            type: 'pubkey';
          },
          {
            name: 'authorizedSigner';
            type: 'pubkey';
          },
          {
            name: 'expirySeconds';
            type: 'u64';
          },
          {
            name: 'blocklist';
            type: {
              vec: 'pubkey';
            };
          },
          {
            name: 'devs';
            type: {
              vec: 'pubkey';
            };
          },
          {
            name: 'bulks';
            type: {
              vec: 'pubkey';
            };
          },
        ];
      };
    },
    {
      name: 'itemData';
      docs: ['Define ItemData'];
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'tokenAddresses';
            type: {
              vec: 'pubkey';
            };
          },
          {
            name: 'tokenAmounts';
            type: {
              vec: 'u64';
            };
          },
          {
            name: 'tokenIds';
            type: {
              vec: 'u64';
            };
          },
          {
            name: 'itemIds';
            type: {
              vec: 'u16';
            };
          },
          {
            name: 'purportedSigner';
            type: 'pubkey';
          },
          {
            name: 'to';
            type: 'pubkey';
          },
          {
            name: 'nonce';
            type: 'u64';
          },
          {
            name: 'expiry';
            type: 'u64';
          },
          {
            name: 'requestId';
            type: 'string';
          },
        ];
      };
    },
    {
      name: 'nonceAccount';
      docs: ['Define Nonce Account'];
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'nonce';
            type: 'u64';
          },
        ];
      };
    },
    {
      name: 'role';
      docs: ['Define Roles'];
      type: {
        kind: 'enum';
        variants: [
          {
            name: 'dev';
          },
          {
            name: 'bulk';
          },
        ];
      };
    },
  ];
};

export class ItemData {
  token_addresses: PublicKey[];
  token_amounts: number[];
  token_ids: number[];
  item_ids: number[];
  purported_signer: PublicKey;
  to: PublicKey;
  nonce: number;
  expiry: number;
  request_id: string;

  constructor(fields: {
    token_addresses: PublicKey[];
    token_amounts: number[];
    token_ids: number[];
    item_ids: number[];
    purported_signer: PublicKey;
    to: PublicKey;
    nonce: number;
    expiry: number;
    request_id: string;
  }) {
    this.token_addresses = fields.token_addresses;
    this.token_amounts = fields.token_amounts;
    this.token_ids = fields.token_ids;
    this.item_ids = fields.item_ids;
    this.purported_signer = fields.purported_signer;
    this.to = fields.to;
    this.nonce = fields.nonce;
    this.expiry = fields.expiry;
    this.request_id = fields.request_id;
  }
}

export const ItemDataSchema: Map<Function, any> = new Map([
  [
    ItemData,
    {
      kind: 'struct',
      fields: [
        ['token_addresses', ['pubkey']],
        ['token_amounts', ['u64']],
        ['token_ids', ['u64']],
        ['item_ids', ['u16']],
        ['purported_signer', 'pubkey'],
        ['to', 'pubkey'],
        ['nonce', 'u64'],
        ['expiry', 'u64'],
        ['request_id', 'string'],
      ],
    },
  ],
]);

// Replace with your program ID
const PROGRAM_ID = new PublicKey('YourProgramIDHere');

// Replace with your state account public key
const STATE_PUBKEY = new PublicKey('YourStateAccountPublicKeyHere');

// Replace with your authorized signer's public key
const AUTHORIZED_SIGNER_PUBKEY = new PublicKey('AuthorizedSignerPublicKeyHere');

// Replace with your from token account public key
const FROM_TOKEN = new PublicKey('FromTokenAccountAddressHere');

// Replace with your existing token mint address
const TOKEN_MINT = new PublicKey('ExistingTokenMintAddressHere');

const SolanaPayment = () => {
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const [requestId, setRequestId] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  const [program, setProgram] = useState<Program<any> | null>(null);

  // Initialize Anchor Provider and Program
  useEffect(() => {
    if (!publicKey) return;

    const provider = new AnchorProvider(
      connection,
      {
        publicKey: publicKey,
        signTransaction: signTransaction,
        signAllTransactions: signTransaction, // Adjust if needed
      },
      AnchorProvider.defaultOptions()
    );

    // Load the IDL
    // import('../target/types/arken_chest.json')
    //   .then((idl: Idl) => {
    //     const programInstance = new Program<any>(idl, PROGRAM_ID, provider);
    //     setProgram(programInstance);
    //   })
    //   .catch((err) => {
    //     console.error('Failed to load IDL', err);
    //   });
  }, [publicKey, connection, signTransaction]);

  const handleClaim = useCallback(async () => {
    if (!publicKey || !program) {
      alert('Please connect your wallet and ensure the program is loaded.');
      return;
    }

    if (!requestId) {
      alert('Please enter a Request ID.');
      return;
    }

    try {
      setStatus('Preparing claim...');

      // Derive the nonce PDA for the recipient
      const [noncePDA, nonceBump] = await PublicKey.findProgramAddress(
        [Buffer.from('nonce'), publicKey.toBuffer()],
        PROGRAM_ID
      );

      // Fetch current nonce from the nonce account
      let currentNonce = 0;
      try {
        const nonceAccount = await program.account.nonceAccount.fetch(noncePDA);
        // @ts-ignore
        currentNonce = nonceAccount.nonce.toNumber();
      } catch (e) {
        // If nonce account doesn't exist, assume nonce is 0
        currentNonce = 0;
      }

      // Construct ItemData
      const itemData = new ItemData({
        token_addresses: [TOKEN_MINT],
        token_amounts: [100], // Amount to claim
        token_ids: [], // Ignored
        item_ids: [], // Ignored
        purported_signer: AUTHORIZED_SIGNER_PUBKEY,
        to: publicKey,
        nonce: currentNonce,
        expiry: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
        request_id: requestId,
      });

      // Serialize ItemData using Borsh
      // @ts-ignore
      const message = borsh.serialize(ItemDataSchema, itemData);

      // Request signature from backend
      setStatus('Requesting signature from backend...');
      const response = await axios.post('https://your-backend.com/generate-signature', {
        message: Array.from(message),
      });

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      const signature = Uint8Array.from(response.data.signature);

      // Derive ATA for the user
      const toToken = await deriveATA(publicKey, TOKEN_MINT, connection);

      // Construct the sendItems instruction
      const txInstruction = await program.methods
        .sendItems(itemData, Array.from(signature))
        .accounts({
          state: STATE_PUBKEY,
          admin: AUTHORIZED_SIGNER_PUBKEY,
          authority: AUTHORIZED_SIGNER_PUBKEY, // Authorized signer is also the authority
          nonceAccount: noncePDA,
          fromToken: FROM_TOKEN,
          toToken: toToken,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .instruction();

      // Create a new transaction and add the instruction
      const transaction = new Transaction().add(txInstruction);

      // Let the user sign the transaction
      setStatus('Signing transaction...');
      const signedTransaction = await signTransaction(transaction);

      // Send the transaction
      setStatus('Sending transaction...');
      const signatureTx = await connection.sendRawTransaction(signedTransaction.serialize());

      // Confirm the transaction
      await connection.confirmTransaction(signatureTx, 'confirmed');

      setStatus(`Transaction successful: ${signatureTx}`);
    } catch (error: any) {
      console.error(error);
      setStatus(`Transaction failed: ${error.message}`);
    }
  }, [publicKey, program, requestId, connection, signTransaction]);

  // Helper function to derive ATA (Associated Token Address)
  const deriveATA = async (owner: PublicKey, mint: PublicKey, connection: any) => {
    const [ata, _] = await PublicKey.findProgramAddress(
      [owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
      new PublicKey('ATokenGPvbdG2gZVt4NvgurThjeZsXabk2SRTzV2zkk') // Associated Token Program ID
    );
    return ata;
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Arken Chest - Claim Tokens</h1>
      <WalletMultiButton />
      <div style={{ marginTop: '20px' }}>
        <input
          type="text"
          placeholder="Enter Request ID"
          value={requestId}
          onChange={(e) => setRequestId(e.target.value)}
          style={{ padding: '10px', width: '300px' }}
        />
        <button onClick={handleClaim} style={{ padding: '10px', marginLeft: '10px' }}>
          Claim Tokens
        </button>
      </div>
      {status && <p style={{ marginTop: '20px' }}>{status}</p>}
    </div>
  );
};

export default SolanaPayment;
