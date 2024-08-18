import React, { useState } from 'react';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { Heading } from '~/ui';
import { useWeb3React as useWeb3ReactCore } from '@web3-react/core';
import erc20 from '~/config/abi/erc20.json';
import useI18n from '~/hooks/useI18n';
import { useTranslation } from 'react-i18next';
import useWeb3 from '~/hooks/useWeb3';
import Page from '~/components/layout/Page';
import PageWindow from '~/components/PageWindow';

import { getNativeAddress } from '~/utils/addressHelpers';
import addresses from 'rune-backend-sdk/build/contractInfo';
import { Address } from '~/config/constants/types';
import useBlock from '~/hooks/useBlock';
// import { INIT_CODE_HASH } from '../src/constants'

// import { bytecode } from '@uniswap/v2-core/build/UniswapV2Pair.json'
// import { keccak256 } from '@ethersproject/solidity'

// const COMPUTED_INIT_CODE_HASH = keccak256(['bytes'], [`0x${bytecode}`])

const VAULT_FEE = 90;
const CHARITY_FEE = 5;
const DEV_FEE = 5;

const MAINNET = 56;
const TESTNET = 97;

const MINT_COST = 0.49;

export const getAddress = (address: Address): string => {
  const mainNetChainId = 56;
  const chainId = process.env.REACT_APP_CHAIN_ID;
  return address[chainId] ? address[chainId] : address[mainNetChainId];
};

const Governance: React.FC = () => {
  const block = useBlock();
  const { library, account } = useWeb3();
  const { t } = useTranslation();
  const [cachedAddresses, setCachedAddresses] = useState(addresses);
  const [runeMintAmount, setRuneMintAmount] = useState('1');
  const [emissionRate, setEmissionRate] = useState('1');
  const [recipeItemVersion, setRecipeItemVersion] = useState('');
  const [recipeItemId, setRecipeItemId] = useState('');
  const [recipeItemModIndex, setRecipeItemModIndex] = useState('');
  const [recipeItemModVariant, setRecipeItemModVariant] = useState('');
  const [recipeItemModValue, setRecipeItemModValue] = useState('');
  const [recipeItemModMinRange, setRecipeItemModMinRange] = useState('');
  const [recipeItemModMaxRange, setRecipeItemModMaxRange] = useState('');
  const [recipeItemModDifficulty, setRecipeItemModDifficulty] = useState('');
  const [currentItemVersion, setCurrentItemVersion] = useState('');
  const [currentItemId, setCurrentItemId] = useState('');
  const [currentItemTokenId, setCurrentItemTokenId] = useState('');
  const [currentItemA1, setCurrentItemA1] = useState('');
  const [currentItemA2, setCurrentItemA2] = useState('');
  const [currentItemA3, setCurrentItemA3] = useState('');
  const [currentItemA4, setCurrentItemA4] = useState('');
  const [currentItemA5, setCurrentItemA5] = useState('');
  const [currentItemB1, setCurrentItemB1] = useState('');
  const [currentItemB2, setCurrentItemB2] = useState('');
  const [currentItemB3, setCurrentItemB3] = useState('');
  const [currentItemB4, setCurrentItemB4] = useState('');
  const [currentItemB5, setCurrentItemB5] = useState('');
  const [addPoolSymbol, setAddPoolSymbol] = useState('RUNE-BNB LP');
  const [poolPair0, setPoolPair0] = useState(getAddress(cachedAddresses.rune));
  const [poolPair1, setPoolPair1] = useState(getAddress(cachedAddresses.wbnb));
  const [botFeeAddress, setBotFeeAddress] = useState('');
  const [excludedFeeAddress, setExcludedFeeAddress] = useState('');
  const [log, setLog] = useState([]);

  function pad(n, width, z = '0') {
    const nn = n + '';
    return nn.length >= width ? nn : new Array(width - nn.length + 1).join(z) + nn;
  }

  // function packAttributes(arr) {
  //   for (const i = 0, L = arr.length, sum = new BigNumber("0"); i < L; sum = (new BigNumber(Math.pow(5000,i)*arr[i++])).plus(sum));
  //   return sum;
  // }

  // function unpackAttributes(packed, length) {
  //   let unpacked = []
  //   let prevVal = 0
  //   for (var i = length; i > 0; i--) {
  //     const diff = packed.minus(Math.pow(5000,i))
  //     prevVal =
  //   }
  //   return unpacked;
  // }

  const convertItemToTokenId = async () => {
    const dummy = '1';
    const version = '1';
    const tid =
      dummy +
      pad(version, 3) +
      pad(currentItemId, 5) +
      currentItemA1 +
      pad(currentItemB1, 3) +
      currentItemA2 +
      pad(currentItemB2, 3) +
      currentItemA3 +
      pad(currentItemB3, 3) +
      currentItemA4 +
      pad(currentItemB4, 3) +
      currentItemA5 +
      pad(currentItemB5, 3);

    setCurrentItemTokenId(tid);
  };

  const convertTokenIdToItem = async () => {
    setCurrentItemVersion(currentItemTokenId.slice(1, 4));
    setCurrentItemId(currentItemTokenId.slice(4, 9));

    setCurrentItemA1(currentItemTokenId.slice(9, 10));
    setCurrentItemB1(currentItemTokenId.slice(10, 13));

    setCurrentItemA2(currentItemTokenId.slice(13, 14));
    setCurrentItemB2(currentItemTokenId.slice(14, 17));

    setCurrentItemA3(currentItemTokenId.slice(17, 18));
    setCurrentItemB3(currentItemTokenId.slice(18, 21));

    setCurrentItemA4(currentItemTokenId.slice(21, 22));
    setCurrentItemB4(currentItemTokenId.slice(22, 25));

    setCurrentItemA5(currentItemTokenId.slice(25, 26));
    setCurrentItemB5(currentItemTokenId.slice(26, 29));
  };

  const deployItemContract = async () => {
    const ArcaneItemsContract = (await (await fetch('/contracts/ArcaneItems.json')).json()) as any;

    const signer = new ethers.providers.Web3Provider(library).getSigner();

    const arcaneItemsFactory = new ethers.ContractFactory(
      ArcaneItemsContract.abi,
      ArcaneItemsContract.bytecode,
      signer
    );

    const arcaneItemsContract = await arcaneItemsFactory.deploy('ipfs://');
  };

  const deployItemFactoryContract = async () => {
    const ArcaneItemFactoryContract = (await (await fetch('/contracts/ArcaneItemFactoryV2.json')).json()) as any;
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    const itemFactory = new ethers.ContractFactory(
      ArcaneItemFactoryContract.abi,
      ArcaneItemFactoryContract.bytecode,
      signer
    );

    const _itemMintingStation = getAddress(cachedAddresses.itemMintingStation);
    const _runeToken = getAddress(cachedAddresses.rune);
    const _tokenPrice = ethers.utils.parseEther('0');
    const _ipfsHash = 'mtwirsqawjuoloq2gvtyug2tc3jbf5htm2zeo4rsknfiv3fdp46a/';
    const _startBlockNumber = block;

    await itemFactory.deploy(_itemMintingStation, _runeToken, _tokenPrice, _ipfsHash, _startBlockNumber);
  };

  const deployItemMintingStationContract = async () => {
    const ArcaneItemMintingStationContract = (await (
      await fetch('/contracts/ArcaneItemMintingStation.json')
    ).json()) as any;
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    const itemFactory = new ethers.ContractFactory(
      ArcaneItemMintingStationContract.abi,
      ArcaneItemMintingStationContract.bytecode,
      signer
    );

    const _arcaneItems = getAddress(cachedAddresses.items);
    await itemFactory.deploy(_arcaneItems);
  };

  const createItem = async () => {
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    {
      const Contract = (await (await fetch('/contracts/ArcaneItemFactoryV1.json')).json()) as any;

      const contract = new ethers.Contract(getAddress(cachedAddresses.blacksmith), Contract.abi, signer);

      const _tokenPrice = ethers.utils.parseEther(`${MINT_COST}`);

      await contract.createItem('Broadsword');
    }
  };

  const setRecipe = async () => {
    const MasterChefContract = (await (await fetch('/contracts/NefChef.json')).json()) as any;
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    const masterchefContract = new ethers.Contract(
      getAddress(cachedAddresses.masterChef),
      MasterChefContract.abi,
      signer
    );

    //  {

    //   const _pid = 28
    //   const _allocPoint = ethers.utils.hexlify(0)
    //   const _depositFeeBP = ethers.utils.hexlify(0)
    //   const _withUpdate = true
    //   await masterchefContract.set(_pid, _allocPoint, _depositFeeBP, _withUpdate)

    // }

    //   const farm = {
    //     fid: 0,
    //     pid: 29,
    //     risk: 6,
    //     chefKey: 'ITH',
    //     isFinished: false,
    //     isStarting: false,
    //     multiplier: '1X',
    //     poolWeight: 200, // 50
    //     isTokenOnly: true,
    //     depositFeeBP: 0,
    //     inactive: false,
    //     lpSymbol: 'ITH',
    //     lpAddresses: cachedAddresses.ith,
    //     tokenSymbol: 'ITH',
    //     tokenAddresses: cachedAddresses.ith,
    //     quoteTokenAdresses: cachedAddresses.busd,
    //   }

    //   const _allocPoint = ethers.utils.hexlify(farm.poolWeight)
    //   const _lpToken = getAddress(farm.lpAddresses)
    //   const _depositFeeBP = ethers.utils.hexlify(farm.depositFeeBP)
    //   const _withUpdate = false

    //   console.log("Adding farm: ", _allocPoint, _lpToken, _depositFeeBP);

    //   await masterchefContract.add(_allocPoint, _lpToken, _depositFeeBP, _withUpdate)

    masterchefContract.setHiddenPoolPid(29);

    // return
    //     const signer = new ethers.providers.Web3Provider(library).getSigner()

    //     {
    //       const Contract = (await (await fetch('/contracts/ArcaneItemFactoryV1.json')).json()) as any

    //       const contract = new ethers.Contract(getAddress(cachedAddresses.blacksmith), Contract.abi, signer)

    //       const _item1 = getAddress(cachedAddresses.el)
    //       const _item2 = getAddress(cachedAddresses.tir)

    //       await contract.setRecipe(_item1, _item2, recipeItemVersion, recipeItemId)
    //     }
  };

  const setRecipeMod = async () => {
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    {
      const Contract = (await (await fetch('/contracts/ArcaneItemFactoryV1.json')).json()) as any;

      const contract = new ethers.Contract(getAddress(cachedAddresses.blacksmith), Contract.abi, signer);

      const _item1 = getAddress(cachedAddresses.el);
      const _item2 = getAddress(cachedAddresses.tir);

      // address _item1, address _item2, uint8 _index, uint8 _variant, uint16 _value, uint16 _minRange, uint16 _maxRange, uint16 _difficulty
      await contract.setRecipeMod(
        _item1,
        _item2,
        recipeItemModIndex,
        recipeItemModVariant,
        recipeItemModMinRange,
        recipeItemModMaxRange,
        recipeItemModDifficulty
      );
    }
  };

  const approveItemFactory = async () => {
    {
      const RuneTokenContract = (await (await fetch('/contracts/ElRune.json')).json()) as any;
      const signer = new ethers.providers.Web3Provider(library).getSigner();

      const runeTokenContract = new ethers.Contract(getAddress(cachedAddresses.el), RuneTokenContract.abi, signer);
      await runeTokenContract.approve(getAddress(cachedAddresses.blacksmith), ethers.constants.MaxUint256);
    }

    {
      const RuneTokenContract = (await (await fetch('/contracts/TirRune.json')).json()) as any;
      const signer = new ethers.providers.Web3Provider(library).getSigner();

      const runeTokenContract = new ethers.Contract(getAddress(cachedAddresses.tir), RuneTokenContract.abi, signer);
      await runeTokenContract.approve(getAddress(cachedAddresses.blacksmith), ethers.constants.MaxUint256);
    }
  };

  const approveNefchefOnVault = async () => {
    const RuneTokenContract = (await (await fetch('/contracts/NefRune.json')).json()) as any;
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    const runeTokenContract = new ethers.Contract(getAddress(cachedAddresses.ith), RuneTokenContract.abi, signer);
    await runeTokenContract.approve(getAddress(cachedAddresses.ithMasterChef), ethers.constants.MaxUint256);
  };

  const transmute = async () => {
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    {
      const Contract = (await (await fetch('/contracts/ArcaneItemFactoryV1.json')).json()) as any;

      const contract = new ethers.Contract(getAddress(cachedAddresses.blacksmith), Contract.abi, signer);

      const _item1 = getAddress(cachedAddresses.el);
      const _item2 = getAddress(cachedAddresses.tir);

      await contract.transmute(_item1, _item2);
    }
  };

  const setupItems = async () => {
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    // {
    //   const Contract = (await (await fetch('/contracts/ArcaneItemMintingStation.json')).json()) as any

    //   const contract = new ethers.Contract(getAddress(cachedAddresses.itemMintingStation), Contract.abi, signer)

    //   const MINTER_ROLE = await contract.MINTER_ROLE()

    //   await contract.revokeRole(MINTER_ROLE, '0x50cad602a38fe0aaf1ffd949516d6fc0a1320146')
    // }
    // return

    // {
    //   const Contract = (await (await fetch('/contracts/NefChef.json')).json()) as any

    //   const contract = new ethers.Contract(getAddress(cachedAddresses.nefMasterChef), Contract.abi, signer)

    //   const res = await contract.getItem('0x847B3317BEA31662F4307')

    //   console.log(res)
    // }

    // {
    //   const Contract = (await (await fetch('/contracts/ArcaneItemFactoryV1.json')).json()) as any

    //   const contract = new ethers.Contract(getAddress(cachedAddresses.blacksmith), Contract.abi, signer)

    //   await contract.setMintingEnabled(true)
    // }

    {
      const Contract = (await (await fetch('/contracts/ArcaneItemMintingStation.json')).json()) as any;

      const contract = new ethers.Contract(getAddress(cachedAddresses.itemMintingStation), Contract.abi, signer);

      const MINTER_ROLE = await contract.MINTER_ROLE();

      await contract.grantRole(MINTER_ROLE, getAddress(cachedAddresses.blacksmith));
    }

    // SETUP STEEL

    {
      const Contract = (await (await fetch('/contracts/ArcaneItemFactoryV2.json')).json()) as any;

      const contract = new ethers.Contract(getAddress(cachedAddresses.blacksmith), Contract.abi, signer);

      const _itemId = 1;
      const _itemJson = 'item-1.json';

      await contract.setItemJson(_itemId, _itemJson);
    }

    {
      const Contract = (await (await fetch('/contracts/ArcaneItemFactoryV2.json')).json()) as any;

      const contract = new ethers.Contract(getAddress(cachedAddresses.blacksmith), Contract.abi, signer);

      const _item1 = getAddress(cachedAddresses.tir);
      const _item2 = getAddress(cachedAddresses.el);
      const _item3 = 0;
      const _item4 = 0;

      await contract.setRecipe(_item1, _item2, _item3, _item4, 10, 1);
    }
    {
      const Contract = (await (await fetch('/contracts/ArcaneItemFactoryV2.json')).json()) as any;

      const contract = new ethers.Contract(getAddress(cachedAddresses.blacksmith), Contract.abi, signer);

      const _item1 = getAddress(cachedAddresses.tir);
      const _item2 = getAddress(cachedAddresses.el);
      const _item3 = 0;
      const _item4 = 0;

      // address _item1, address _item2, uint8 _index, uint8 _variant, uint16 _value, uint16 _minRange, uint16 _maxRange, uint16 _difficulty
      await contract.setRecipeMod(_item1, _item2, _item3, _item4, 0, 1, 5, 15, 0);
    }
    {
      const Contract = (await (await fetch('/contracts/ArcaneItemFactoryV2.json')).json()) as any;

      const contract = new ethers.Contract(getAddress(cachedAddresses.blacksmith), Contract.abi, signer);

      const _item1 = getAddress(cachedAddresses.tir);
      const _item2 = getAddress(cachedAddresses.el);
      const _item3 = 0;
      const _item4 = 0;

      // address _item1, address _item2, uint8 _index, uint8 _variant, uint16 _value, uint16 _minRange, uint16 _maxRange, uint16 _difficulty
      await contract.setRecipeMod(_item1, _item2, _item3, _item4, 1, 1, 3, 5, 0);
    }
    {
      const Contract = (await (await fetch('/contracts/ArcaneItemFactoryV2.json')).json()) as any;

      const contract = new ethers.Contract(getAddress(cachedAddresses.blacksmith), Contract.abi, signer);

      const _item1 = getAddress(cachedAddresses.tir);
      const _item2 = getAddress(cachedAddresses.el);
      const _item3 = 0;
      const _item4 = 0;

      // address _item1, address _item2, uint8 _index, uint8 _variant, uint16 _value, uint16 _minRange, uint16 _maxRange, uint16 _difficulty
      await contract.setRecipeMod(_item1, _item2, _item3, _item4, 2, 1, 0, 2, 0);
    }

    // SETUP FURY

    {
      const Contract = (await (await fetch('/contracts/ArcaneItemFactoryV2.json')).json()) as any;

      const contract = new ethers.Contract(getAddress(cachedAddresses.blacksmith), Contract.abi, signer);

      const _itemId = 2;
      const _itemJson = 'item-2.json';

      await contract.setItemJson(_itemId, _itemJson);
    }

    {
      const Contract = (await (await fetch('/contracts/ArcaneItemFactoryV2.json')).json()) as any;

      const contract = new ethers.Contract(getAddress(cachedAddresses.blacksmith), Contract.abi, signer);

      const _item1 = getAddress(cachedAddresses.nef);
      const _item2 = getAddress(cachedAddresses.eld);
      const _item3 = getAddress(cachedAddresses.tir);
      const _item4 = getAddress(cachedAddresses.el);

      await contract.setRecipe(_item1, _item2, _item3, _item4, 10, 2);
    }
    {
      const Contract = (await (await fetch('/contracts/ArcaneItemFactoryV2.json')).json()) as any;

      const contract = new ethers.Contract(getAddress(cachedAddresses.blacksmith), Contract.abi, signer);

      const _item1 = getAddress(cachedAddresses.nef);
      const _item2 = getAddress(cachedAddresses.eld);
      const _item3 = getAddress(cachedAddresses.tir);
      const _item4 = getAddress(cachedAddresses.el);

      // address _item1, address _item2, uint8 _index, uint8 _variant, uint16 _value, uint16 _minRange, uint16 _maxRange, uint16 _difficulty
      await contract.setRecipeMod(_item1, _item2, _item3, _item4, 0, 1, 3, 7, 0);
    }
    {
      const Contract = (await (await fetch('/contracts/ArcaneItemFactoryV2.json')).json()) as any;

      const contract = new ethers.Contract(getAddress(cachedAddresses.blacksmith), Contract.abi, signer);

      const _item1 = getAddress(cachedAddresses.nef);
      const _item2 = getAddress(cachedAddresses.eld);
      const _item3 = getAddress(cachedAddresses.tir);
      const _item4 = getAddress(cachedAddresses.el);

      // address _item1, address _item2, uint8 _index, uint8 _variant, uint16 _value, uint16 _minRange, uint16 _maxRange, uint16 _difficulty
      await contract.setRecipeMod(_item1, _item2, _item3, _item4, 1, 1, 20, 40, 0);
    }
    {
      const Contract = (await (await fetch('/contracts/ArcaneItemFactoryV2.json')).json()) as any;

      const contract = new ethers.Contract(getAddress(cachedAddresses.blacksmith), Contract.abi, signer);

      const _item1 = getAddress(cachedAddresses.nef);
      const _item2 = getAddress(cachedAddresses.eld);
      const _item3 = getAddress(cachedAddresses.tir);
      const _item4 = getAddress(cachedAddresses.el);

      // address _item1, address _item2, uint8 _index, uint8 _variant, uint16 _value, uint16 _minRange, uint16 _maxRange, uint16 _difficulty
      await contract.setRecipeMod(_item1, _item2, _item3, _item4, 2, 1, 20, 40, 0);
    }

    // SETUP LOREKEEPER

    {
      const Contract = (await (await fetch('/contracts/ArcaneItemFactoryV2.json')).json()) as any;

      const contract = new ethers.Contract(getAddress(cachedAddresses.blacksmith), Contract.abi, signer);

      const _itemId = 3;
      const _itemJson = 'item-3.json';

      await contract.setItemJson(_itemId, _itemJson);
    }

    {
      const Contract = (await (await fetch('/contracts/ArcaneItemFactoryV2.json')).json()) as any;

      const contract = new ethers.Contract(getAddress(cachedAddresses.blacksmith), Contract.abi, signer);

      const _item1 = getAddress(cachedAddresses.nef);
      const _item2 = getAddress(cachedAddresses.tir);
      const _item3 = 0;
      const _item4 = 0;

      await contract.setRecipe(_item1, _item2, _item3, _item4, 10, 3);
    }
    {
      const Contract = (await (await fetch('/contracts/ArcaneItemFactoryV2.json')).json()) as any;

      const contract = new ethers.Contract(getAddress(cachedAddresses.blacksmith), Contract.abi, signer);

      const _item1 = getAddress(cachedAddresses.nef);
      const _item2 = getAddress(cachedAddresses.tir);
      const _item3 = 0;
      const _item4 = 0;

      // address _item1, address _item2, uint8 _index, uint8 _variant, uint16 _value, uint16 _minRange, uint16 _maxRange, uint16 _difficulty
      await contract.setRecipeMod(_item1, _item2, _item3, _item4, 0, 1, 1, 3, 0);
    }
    {
      const Contract = (await (await fetch('/contracts/ArcaneItemFactoryV2.json')).json()) as any;

      const contract = new ethers.Contract(getAddress(cachedAddresses.blacksmith), Contract.abi, signer);

      const _item1 = getAddress(cachedAddresses.nef);
      const _item2 = getAddress(cachedAddresses.tir);
      const _item3 = 0;
      const _item4 = 0;

      // address _item1, address _item2, uint8 _index, uint8 _variant, uint16 _value, uint16 _minRange, uint16 _maxRange, uint16 _difficulty
      await contract.setRecipeMod(_item1, _item2, _item3, _item4, 1, 1, 1, 3, 0);
    }

    return;
    {
      const ArcaneItemsContract = (await (await fetch('/contracts/ArcaneItems.json')).json()) as any;

      const arcaneItemsContract = new ethers.Contract(
        getAddress(cachedAddresses.items),
        ArcaneItemsContract.abi,
        signer
      );

      await arcaneItemsContract.transferOwnership(getAddress(cachedAddresses.itemMintingStation));
    }
  };

  const deployNefContract = async () => {
    const RuneTokenContract = (await (await fetch('/contracts/NefRune.json')).json()) as any;
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    const runeTokenFactory = new ethers.ContractFactory(RuneTokenContract.abi, RuneTokenContract.bytecode, signer);

    const runeTokenContract = await runeTokenFactory.deploy();

    console.log('NEF:', runeTokenContract.address);

    const _devAddress = getAddress(cachedAddresses.devAddress);
    await runeTokenContract.setDevAddress(_devAddress);
  };

  const deployNefVoid = async () => {
    const VoidContract = (await (await fetch('/contracts/NefVoid.json')).json()) as any;
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    const voidContract = new ethers.ContractFactory(VoidContract.abi, VoidContract.bytecode, signer);

    const _rune = getAddress(cachedAddresses.nef);
    const _devAddress = getAddress(cachedAddresses.devAddress);

    const v = await voidContract.deploy(_rune, _devAddress);

    return v.address;
  };

  const deployNefMasterchef = async () => {
    const MasterChefContract = (await (await fetch('/contracts/NefChef.json')).json()) as any;
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    const masterchefContract = new ethers.ContractFactory(MasterChefContract.abi, MasterChefContract.bytecode, signer);

    const _rune = getAddress(cachedAddresses.nef);
    const _profileAddress = getAddress(cachedAddresses.profile);
    const _itemMintingStation = getAddress(cachedAddresses.itemMintingStation);
    const _itemsAddress = getAddress(cachedAddresses.items);
    const _devAddress = getAddress(cachedAddresses.devAddress);
    const _vaultAddress = getAddress(cachedAddresses.vaultAddress);
    const _charityAddress = getAddress(cachedAddresses.charityAddress);
    const _voidAddress = getAddress(cachedAddresses.nefVoidAddress);
    const _runePerBlock = ethers.utils.parseEther('0.3');
    const _startBlock = 6734475;

    const masterchef = await masterchefContract.deploy(
      _rune,
      _profileAddress,
      _itemMintingStation,
      _itemsAddress,
      _devAddress,
      _vaultAddress,
      _charityAddress,
      _voidAddress,
      _runePerBlock,
      _startBlock
    );

    return masterchef.address;
  };

  const setNefInfo = async () => {
    const RuneTokenContract = (await (await fetch('/contracts/NefRune.json')).json()) as any;
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    const runeTokenContract = new ethers.Contract(getAddress(cachedAddresses.nef), RuneTokenContract.abi, signer);

    const _vaultAddress = getAddress(cachedAddresses.vaultAddress);
    const _charityAddress = getAddress(cachedAddresses.charityAddress);
    const _devAddress = getAddress(cachedAddresses.devAddress);
    const _botAddress = getAddress(cachedAddresses.vaultAddress);
    const _vaultFee = ethers.utils.hexlify(VAULT_FEE);
    const _charityFee = ethers.utils.hexlify(CHARITY_FEE);
    const _devFee = ethers.utils.hexlify(DEV_FEE);
    const _botFee = ethers.utils.hexlify(200);

    // function setInfo(address _vaultAddress, address _charityAddress, address _devAddress, uint256 _vaultMintPercent, uint256 _charityMintPercent, uint256 _devMintPercent) public onlyOwner()
    await runeTokenContract.setFeeInfo(
      _vaultAddress,
      _charityAddress,
      _devAddress,
      _botAddress,
      _vaultFee,
      _charityFee,
      _devFee,
      _botFee
    );
  };

  return (
    <Page>
      <PageWindow>
        <Heading as="h1" size="xxl" color="secondary" mb="8px">
          {t('Runesmith')}
        </Heading>
        <br />
        <br />
        <button onClick={deployItemContract}>Deploy Arcane Item Contract</button>
        <br />
        <br />
        <button onClick={deployItemMintingStationContract}>Deploy Arcane Item Minting Station Contract</button>
        <br />
        <br />
        <button onClick={deployItemFactoryContract}>Deploy Arcane Item Factory Contract</button>
        <br />
        <br />
        <button onClick={setupItems}>Setup Item Contracts</button>
        <br />
        <br />
        <button onClick={approveItemFactory}>Approve EL + TIR</button>
        <br />
        <br />
        <button onClick={transmute}>Transmute</button>
        <br />
        <br />
        <br />
        Token ID:
        <br />
        <input type="text" value={currentItemTokenId} onChange={(e) => setCurrentItemTokenId(e.target.value)} />
        <br />
        Item Version:
        <br />
        <input type="text" value={currentItemVersion} onChange={(e) => setCurrentItemVersion(e.target.value)} />
        <br />
        Item ID:
        <br />
        <input type="text" value={currentItemId} onChange={(e) => setCurrentItemId(e.target.value)} />
        <br />
        Item M1A:
        <br />
        <input type="text" value={currentItemA1} onChange={(e) => setCurrentItemA1(e.target.value)} />
        <br />
        Item M1B:
        <br />
        <input type="text" value={currentItemB1} onChange={(e) => setCurrentItemB1(e.target.value)} />
        <br />
        Item M2A:
        <br />
        <input type="text" value={currentItemA2} onChange={(e) => setCurrentItemA2(e.target.value)} />
        <br />
        Item M2B:
        <br />
        <input type="text" value={currentItemB2} onChange={(e) => setCurrentItemB2(e.target.value)} />
        <br />
        Item M3A:
        <br />
        <input type="text" value={currentItemA3} onChange={(e) => setCurrentItemA3(e.target.value)} />
        <br />
        Item M3B:
        <br />
        <input type="text" value={currentItemB3} onChange={(e) => setCurrentItemB3(e.target.value)} />
        <br />
        Item M4A:
        <br />
        <input type="text" value={currentItemA4} onChange={(e) => setCurrentItemA4(e.target.value)} />
        <br />
        Item M5B:
        <br />
        <input type="text" value={currentItemB4} onChange={(e) => setCurrentItemB4(e.target.value)} />
        <br />
        Item M6A:
        <br />
        <input type="text" value={currentItemA5} onChange={(e) => setCurrentItemA5(e.target.value)} />
        <br />
        Item M7B:
        <br />
        <input type="text" value={currentItemB5} onChange={(e) => setCurrentItemB5(e.target.value)} />
        <br />
        <button onClick={convertTokenIdToItem}>CONVERT TOKEN ID TO ITEM</button>
        <button onClick={convertItemToTokenId}>CONVERT ITEM ID TO TOKEN ID</button>
        <br />
        <br />
        <Heading as="h2" size="lg" mb="8px">
          {t('Recipes')}
        </Heading>
        <br />
        Item Version:
        <br />
        <input type="text" value={recipeItemVersion} onChange={(e) => setRecipeItemVersion(e.target.value)} />
        <br />
        Item ID:
        <br />
        <input type="text" value={recipeItemId} onChange={(e) => setRecipeItemId(e.target.value)} />
        <br />
        <br />
        <button onClick={setRecipe}>SET RECIPE</button>
        <br />
        <br />
        <br />
        Item Mod Index:
        <br />
        <input type="text" value={recipeItemModIndex} onChange={(e) => setRecipeItemModIndex(e.target.value)} />
        <br />
        Item Mod Variant:
        <br />
        <input type="text" value={recipeItemModVariant} onChange={(e) => setRecipeItemModVariant(e.target.value)} />
        <br />
        {/* Item Mod Value:
        <br />
        <input type="text" value={recipeItemModValue} onChange={(e) => setRecipeItemModValue(e.target.value)} />
        <br /> */}
        Item Mod Min Range:
        <br />
        <input type="text" value={recipeItemModMinRange} onChange={(e) => setRecipeItemModMinRange(e.target.value)} />
        <br />
        Item Mod Max Range:
        <br />
        <input type="text" value={recipeItemModMaxRange} onChange={(e) => setRecipeItemModMaxRange(e.target.value)} />
        <br />
        Item Mod Difficulty:
        <br />
        <input
          type="text"
          value={recipeItemModDifficulty}
          onChange={(e) => setRecipeItemModDifficulty(e.target.value)}
        />
        <br />
        <br />
        <button onClick={setRecipeMod}>SET RECIPE MOD</button>
        <hr />
        <br />
        <br />
        <Heading as="h2" size="lg" mb="8px">
          {t('MasterChef')}
        </Heading>
        <br />
        <br />
        <button onClick={deployNefContract}>Deploy Nef</button>
        <br />
        <br />
        <button onClick={deployNefVoid}>Deploy NefVoid Contract</button>
        <br />
        <br />
        <button onClick={deployNefMasterchef}>Deploy NefChef Contract</button>
        <br />
        <br />
        <button onClick={approveNefchefOnVault}>Approve NefChef [FROM VAULT]</button>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <ol>
          <li>+5-15% Farming Yield</li>
          <li>+3-5% Harvest Fee</li>
          <li>+1% Harvest Burn</li>
          <li>+1% Harvest Locked</li>
          <li>+1% Harvest Buy &amp; Lock LP</li>
          <li>+1% Deposit Buy &amp; Lock LP</li>
          <li>+10H Harvest Delay</li>
          <li>+1-100% Magic Find</li>
          <li>Chance to Freeze Fees (1-24H)</li>
          <li>Chance of No Harvest</li>
          <li>Chance to Add Harvest Delay (1-24H)</li>
          <li>Chance to Unlock Hidden Pool</li>
          <li>Chance To Fracture Item</li>
          <li>Chance to Find Worldstone Shard</li>
          <li>Chance of Finding Guild Token</li>
          <li>Waived Transfer Fees</li>
          <li>Random Rune Exchange</li>
          <li>Worldstone Shard Upon Harvest</li>
          <li>10% Early Release Fee</li>
          <li>Unable to use a certain runeword for a set time</li>
          <li>Chance to Create Random Runeform</li>
          <li>
            -1% Harvest Fee to Random Raider: 1% of your harvest is given randomly to somebody else farming in your
            pool. Instead of it going to vault, you could get some extra random yield. Maybe even double your stack if
            it&apos;s a whale.
          </li>
          <li>+1 Fire Wall (Mage required): Fire Wall will harvest, burn 3% of yield, but abolish all fees.</li>
          <li>
            +1 Whirlwind (Warrior required): Whirldwind will harvest, exchange 3% of yielded rune for random runes.
          </li>
          <li>+1 Sanctuary Aura (Paladin required): Stake 100 RXS for 3 months. Abolish all fees.</li>
          <li>+1 Wolf Strike (assassin required): 50% chance to yield +10% or yield 0%</li>
          <li>+1 Deep Impact: 50% chance to yield 3 days, or lose everything</li>
          <li>
            +1 Sacrifice (necromancer): You lose 0.001% of your staked tokens per block, but gain 1% more harvest per
            block.
          </li>
        </ol>
      </PageWindow>
    </Page>
  );
};

export default Governance;
