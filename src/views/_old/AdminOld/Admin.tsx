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
import farms from 'rune-backend-sdk/build/farmInfo';
import { Address } from '~/config/constants/types';
import useBlock from '~/hooks/useBlock';
// import { INIT_CODE_HASH } from '../src/constants'

// import { bytecode } from '@uniswap/v2-core/build/UniswapV2Pair.json'
// import { keccak256 } from '@ethersproject/solidity'

// const COMPUTED_INIT_CODE_HASH = keccak256(['bytes'], [`0x${bytecode}`])

const VAULT_FEE = 80;
const CHARITY_FEE = 10;
const DEV_FEE = 10;

const MAINNET = 56;
const TESTNET = 97;

const MINT_COST = 0.2;

export const getAddress = (address: Address): string => {
  const mainNetChainId = 56;
  const chainId = process.env.REACT_APP_CHAIN_ID;
  return address[chainId] ? address[chainId] : address[mainNetChainId];
};

// function useWeb3() {
//   const context = useWeb3ReactCore()
//   const contextNetwork = useWeb3ReactCore('NETWORK')
//   return context.active ? context : contextNetwork
// }

const Governance: React.FC = () => {
  // const { web3 } = useWeb3()
  const block = useBlock();
  const { library, account } = useWeb3();
  const { t } = useTranslation();
  const [cachedAddresses, setCachedAddresses] = useState(addresses);
  const [runeMintAmount, setRuneMintAmount] = useState('1');
  const [emissionRate, setEmissionRate] = useState('1');
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
    const tid =
      '1' +
      pad(currentItemId, 5) +
      currentItemA1 +
      pad(currentItemB1, 5) +
      currentItemA2 +
      pad(currentItemB2, 5) +
      currentItemA3 +
      pad(currentItemB3, 5) +
      currentItemA4 +
      pad(currentItemB4, 5) +
      currentItemA5 +
      pad(currentItemB5, 5);

    setCurrentItemTokenId(tid);
  };

  const convertTokenIdToItem = async () => {
    setCurrentItemVersion(currentItemTokenId.slice(0, 1));
    setCurrentItemId(currentItemTokenId.slice(1, 6));

    setCurrentItemA1(currentItemTokenId.slice(6, 7));
    setCurrentItemB1(currentItemTokenId.slice(7, 10));

    setCurrentItemA2(currentItemTokenId.slice(11, 12));
    setCurrentItemB2(currentItemTokenId.slice(12, 15));

    setCurrentItemA3(currentItemTokenId.slice(15, 16));
    setCurrentItemB3(currentItemTokenId.slice(16, 19));

    setCurrentItemA4(currentItemTokenId.slice(19, 20));
    setCurrentItemB4(currentItemTokenId.slice(20, 23));

    setCurrentItemA5(currentItemTokenId.slice(23, 21));
    setCurrentItemB5(currentItemTokenId.slice(21, 24));
  };

  const setup1 = async () => {
    // const runeAddress = await deployRuneContract()

    // cachedAddresses.rune = {
    //   [MAINNET]: runeAddress,
    //   [TESTNET]: '',
    // }
    // setCachedAddresses(cachedAddresses)

    // log.push(`RUNE address: ${runeAddress}`)

    setLog(log);

    const masterchefAddress = await deployMasterchef();

    cachedAddresses.masterChef = {
      [MAINNET]: masterchefAddress,
      [TESTNET]: '',
    };
    setCachedAddresses(cachedAddresses);

    log.push(`MasterChef address: ${masterchefAddress}`);

    setLog(log);

    await mintRuneTokens();
    // await setMasterchefInfo() from dev
    await transferTokenOwnershipToMasterchef();
    await setRuneInfoProxy();

    await approvePancake();
    await createLp();

    log.push('Setup step 1 done');

    setLog(log);
  };

  const setup2 = async () => {
    await addPool();
    await setAddPoolSymbol('BNB-BUSD LP');
    await addPool();

    await setExcludedFeeAddress(getAddress(addresses.deployerAddress));
    await addExcludedRuneFee();
    await setExcludedFeeAddress(getAddress(addresses.devAddress));
    await addExcludedRuneFee();
    await setExcludedFeeAddress(getAddress(addresses.vaultAddress));
    await addExcludedRuneFee();
    await setExcludedFeeAddress(getAddress(addresses.charityAddress));
    await addExcludedRuneFee();

    setLog([...log, 'Setup step 2 done']);
  };

  const createToken = async () => {};

  const deployRuneContract = async () => {
    const RuneTokenContract = (await (await fetch('/contracts/NefRune.json')).json()) as any;
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    const runeTokenFactory = new ethers.ContractFactory(RuneTokenContract.abi, RuneTokenContract.bytecode, signer);

    const runeTokenContract = await runeTokenFactory.deploy();

    console.log('RUNE:', runeTokenContract.address);

    const _devAddress = getAddress(cachedAddresses.devAddress);
    await runeTokenContract.setDevAddress(_devAddress);
  };

  const setRuneDevAddress = async () => {
    const RuneTokenContract = (await (await fetch('/contracts/NefRune.json')).json()) as any;
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    const runeTokenContract = new ethers.Contract(getAddress(cachedAddresses.ith), RuneTokenContract.abi, signer);

    const _devAddress = getAddress(cachedAddresses.devAddress);
    await runeTokenContract.setDevAddress(_devAddress);
  };

  const mintRuneTokens = async () => {
    const RuneTokenContract = (await (await fetch('/contracts/NefRune.json')).json()) as any;
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    const runeTokenContract = new ethers.Contract(getAddress(cachedAddresses.nef), RuneTokenContract.abi, signer);

    await runeTokenContract['mint(address,uint256)'](account, ethers.utils.parseEther(runeMintAmount));
  };

  // IBEP20 _runeToken,
  // uint256 _numberRuneToReactivate,
  // uint256 _numberRuneToRegister,
  // uint256 _numberRuneToUpdate
  const deployProfileContract = async () => {
    const ArcaneProfileContract = (await (await fetch('/contracts/ArcaneProfile.json')).json()) as any;
    const signer = new ethers.providers.Web3Provider(library).getSigner();
    const profile = new ethers.ContractFactory(ArcaneProfileContract.abi, ArcaneProfileContract.bytecode, signer);

    const _runeToken = getAddress(cachedAddresses.rune);
    const _numberRuneToReactivate = 1;
    const _numberRuneToRegister = 1;
    const _numberRuneToUpdate = 1;
    await profile.deploy(_runeToken, _numberRuneToReactivate, _numberRuneToRegister, _numberRuneToUpdate);
  };

  const deployCharacterContract = async () => {
    const ArcaneCharactersContract = (await (await fetch('/contracts/ArcaneCharacters.json')).json()) as any;

    const signer = new ethers.providers.Web3Provider(library).getSigner();

    const arcaneCharactersFactory = new ethers.ContractFactory(
      ArcaneCharactersContract.abi,
      ArcaneCharactersContract.bytecode,
      signer
    );

    const arcaneCharactersContract = await arcaneCharactersFactory.deploy('ipfs://');
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

  const deployItemFactory = async () => {
    const ArcaneItemFactoryContract = (await (await fetch('/contracts/ArcaneItemFactory.json')).json()) as any;
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    const itemFactory = new ethers.ContractFactory(
      ArcaneItemFactoryContract.abi,
      ArcaneItemFactoryContract.bytecode,
      signer
    );

    const _characterMintingStation = getAddress(cachedAddresses.characterMintingStation);
    const _runeToken = getAddress(cachedAddresses.rune);
    const _tokenPrice = ethers.utils.parseEther(`${MINT_COST}`);
    const _ipfsHash = 'mtwirsqawjuoloq2gvtyug2tc3jbf5htm2zeo4rsknfiv3fdp46a/';
    const _startBlockNumber = block;

    // ArcaneCharacterFactoryV2 _itemFactoryV2,
    // CharacterMintingStation _characterMintingStation,
    // IBEP20 _runeToken,
    // uint256 _tokenPrice,
    // string memory _ipfsHash,
    // uint256 _startBlockNumber
    await itemFactory.deploy(_characterMintingStation, _runeToken, _tokenPrice, _ipfsHash, _startBlockNumber);
  };

  // ArcaneCharacters _arcaneCharacters,
  // IBEP20 _runeToken,
  // uint256 _tokenPrice,
  // string memory _ipfsHash,
  // uint256 _startBlockNumber,
  // uint256 _endBlockNumber
  const deployCharacterFactoryV2 = async () => {
    const ArcaneCharacterFactoryV2Contract = (await (
      await fetch('/contracts/ArcaneCharacterFactoryV2.json')
    ).json()) as any;
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    const characterFactory = new ethers.ContractFactory(
      ArcaneCharacterFactoryV2Contract.abi,
      ArcaneCharacterFactoryV2Contract.bytecode,
      signer
    );

    const _arcaneCharacters = getAddress(cachedAddresses.characters);
    const _runeToken = getAddress(cachedAddresses.rune);
    const _tokenPrice = ethers.utils.parseEther(`${MINT_COST}`);
    const _ipfsHash = 'mtwirsqawjuoloq2gvtyug2tc3jbf5htm2zeo4rsknfiv3fdp46a/';
    const _startBlockNumber = block;
    const _endBlockNumber = _startBlockNumber + (365 * 24 * 60 * 60) / 10; // roughly 1 year
    await characterFactory.deploy(
      _arcaneCharacters,
      _runeToken,
      _tokenPrice,
      _ipfsHash,
      _startBlockNumber,
      _endBlockNumber
    );
  };

  // ArcaneCharacterFactoryV2 _characterFactoryV2,
  // CharacterMintingStation _characterMintingStation,
  // IBEP20 _runeToken,
  // uint256 _tokenPrice,
  // string memory _ipfsHash,
  // uint256 _startBlockNumber
  const deployCharacterFactoryV3 = async () => {
    const ArcaneCharacterFactoryV3Contract = (await (
      await fetch('/contracts/ArcaneCharacterFactoryV3.json')
    ).json()) as any;
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    const characterFactory = new ethers.ContractFactory(
      ArcaneCharacterFactoryV3Contract.abi,
      ArcaneCharacterFactoryV3Contract.bytecode,
      signer
    );

    const _characterFactoryV2 = getAddress(cachedAddresses.characterFactoryV2);
    const _characterMintingStation = getAddress(cachedAddresses.characterMintingStation);
    const _runeToken = getAddress(cachedAddresses.rune);
    const _tokenPrice = ethers.utils.parseEther(`${MINT_COST}`);
    const _ipfsHash = 'mtwirsqawjuoloq2gvtyug2tc3jbf5htm2zeo4rsknfiv3fdp46a/';
    const _startBlockNumber = block;

    // ArcaneCharacterFactoryV2 _characterFactoryV2,
    // CharacterMintingStation _characterMintingStation,
    // IBEP20 _runeToken,
    // uint256 _tokenPrice,
    // string memory _ipfsHash,
    // uint256 _startBlockNumber
    await characterFactory.deploy(
      _characterFactoryV2,
      _characterMintingStation,
      _runeToken,
      _tokenPrice,
      _ipfsHash,
      _startBlockNumber
    );
  };

  // ArcaneCharacterFactoryV2 _characterFactoryV2,
  // CharacterMintingStation _characterMintingStation,
  // IBEP20 _runeToken,
  // uint256 _tokenPrice,
  // string memory _ipfsHash,
  // uint256 _startBlockNumber
  const deployCharacterFactoryV4 = async () => {
    const ArcaneCharacterFactoryV4Contract = (await (
      await fetch('/contracts/ArcaneCharacterFactoryV4.json')
    ).json()) as any;
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    const characterFactory = new ethers.ContractFactory(
      ArcaneCharacterFactoryV4Contract.abi,
      ArcaneCharacterFactoryV4Contract.bytecode,
      signer
    );

    const _characterMintingStation = getAddress(cachedAddresses.characterMintingStation);
    const _runeToken = getAddress(cachedAddresses.rune);
    const _tokenPrice = ethers.utils.parseEther(`${MINT_COST}`);
    const _ipfsHash = 'mtwirsqawjuoloq2gvtyug2tc3jbf5htm2zeo4rsknfiv3fdp46a/';
    const _startBlockNumber = block;

    // ArcaneCharacterFactoryV2 _characterFactoryV2,
    // CharacterMintingStation _characterMintingStation,
    // IBEP20 _runeToken,
    // uint256 _tokenPrice,
    // string memory _ipfsHash,
    // uint256 _startBlockNumber
    await characterFactory.deploy(_characterMintingStation, _runeToken, _tokenPrice, _ipfsHash, _startBlockNumber);
  };

  const deployTokenTimelock = async () => {
    const TokenTimelock = (await (await fetch('/contracts/TokenTimelock.json')).json()) as any;
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    const tokenTimelock = new ethers.ContractFactory(TokenTimelock.abi, TokenTimelock.bytecode, signer);

    const _runeToken = getAddress(cachedAddresses.rune);
    const _beneficiary = '';
    await tokenTimelock.deploy(_runeToken, _beneficiary);
  };

  // ArcaneCharacters _arcaneCharacters
  const deployCharacterMintingStation = async () => {
    const ArcaneCharacterMintingStationContract = (await (
      await fetch('/contracts/ArcaneCharacterMintingStation.json')
    ).json()) as any;
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    const characterFactory = new ethers.ContractFactory(
      ArcaneCharacterMintingStationContract.abi,
      ArcaneCharacterMintingStationContract.bytecode,
      signer
    );

    const _arcaneCharacters = getAddress(cachedAddresses.characters);
    await characterFactory.deploy(_arcaneCharacters);
  };

  // ArcaneCharacterMintingStation _characterMintingStation,
  // IBEP20 _runeToken,
  // ArcaneProfile _arcaneProfile,
  // uint256 _maxViewLength
  const deployCharacterSpecial = async () => {
    const ArcaneCharacterSpecialContract = (await (
      await fetch('/contracts/ArcaneCharacterSpecialV1.json')
    ).json()) as any;
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    const characterSpecial = new ethers.ContractFactory(
      ArcaneCharacterSpecialContract.abi,
      ArcaneCharacterSpecialContract.bytecode,
      signer
    );

    const _characterMintingStation = getAddress(cachedAddresses.characterMintingStation);
    const _runeToken = getAddress(cachedAddresses.rune);
    const _profile = getAddress(cachedAddresses.profile);
    const _maxViewLength = 1000;

    await characterSpecial.deploy(_characterMintingStation, _runeToken, _profile, _maxViewLength);
  };

  const deployVoidContract = async () => {
    const VoidContract = (await (await fetch('/contracts/TirVoid.json')).json()) as any;
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    const voidContract = new ethers.ContractFactory(VoidContract.abi, VoidContract.bytecode, signer);

    const _rune = getAddress(cachedAddresses.tir);
    const _devAddress = getAddress(cachedAddresses.devAddress);

    const v = await voidContract.deploy(_rune, _devAddress);

    return v.address;
  };

  const deployMasterchef = async () => {
    const MasterChefContract = (await (await fetch('/contracts/TirChef.json')).json()) as any;
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    const masterchefContract = new ethers.ContractFactory(MasterChefContract.abi, MasterChefContract.bytecode, signer);

    const _rune = getAddress(cachedAddresses.tir);
    const _devAddress = getAddress(cachedAddresses.devAddress);
    const _vaultAddress = getAddress(cachedAddresses.vaultAddress);
    const _charityAddress = getAddress(cachedAddresses.charityAddress);
    const _voidAddress = getAddress(cachedAddresses.tirVoidAddress);
    const _withdrawFeeToken = getAddress(cachedAddresses.el);
    const _runePerBlock = ethers.utils.parseEther('0.1');
    const _startBlock = 6475675;

    const masterchef = await masterchefContract.deploy(
      _rune,
      _devAddress,
      _vaultAddress,
      _charityAddress,
      _voidAddress,
      _runePerBlock,
      _startBlock,
      _withdrawFeeToken
    );

    return masterchef.address;
  };

  const deployTimelockContract = async () => {
    const TimelockContract = (await (await fetch('/contracts/Timelock.json')).json()) as any;
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    const timelockContract = new ethers.ContractFactory(TimelockContract.abi, TimelockContract.bytecode, signer);

    const admin_ = account;
    const delay_ = 24 * 60 * 60;

    const timelock = await timelockContract.deploy(admin_, delay_);

    return timelock.address;
  };

  const updateEmissionRate = async () => {
    const MasterChefContract = (await (await fetch('/contracts/NefChef.json')).json()) as any;
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    const masterchefContract = new ethers.Contract(
      getAddress(cachedAddresses.masterChef),
      MasterChefContract.abi,
      signer
    );

    const _runePerBlock = ethers.utils.parseEther(emissionRate);

    await masterchefContract.updateEmissionRate(_runePerBlock);
  };

  const addPool = async () => {
    const MasterChefContract = (await (await fetch('/contracts/TirChef.json')).json()) as any;
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    const masterchefContract = new ethers.Contract(
      getAddress(cachedAddresses.masterChef),
      MasterChefContract.abi,
      signer
    );
    const farm = farms.find((f) => f.lpSymbol === addPoolSymbol);

    const _allocPoint = ethers.utils.hexlify(farm.poolWeight); // BNB-BUSD LP
    const _lpToken = getAddress(farm.lpAddresses);
    const _depositFeeBP = ethers.utils.hexlify(farm.depositFeeBP);
    const _withUpdate = false;
    console.log(getAddress(cachedAddresses.masterChef), _allocPoint, _lpToken, _depositFeeBP, _withUpdate);
    // function add(uint256 _allocPoint, IBEP20 _lpToken, uint16 _depositFeeBP, bool _withUpdate) public onlyOwner {
    await masterchefContract.add(_allocPoint, _lpToken, _depositFeeBP, _withUpdate);
  };

  const setPool = async () => {
    const MasterChefContract = (await (await fetch('/contracts/NefChef.json')).json()) as any;
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    const masterchefContract = new ethers.Contract(
      getAddress(cachedAddresses.masterChef),
      MasterChefContract.abi,
      signer
    );
    const farm = farms.find((f) => f.lpSymbol === addPoolSymbol);

    const _pid = farm.pid;
    const _allocPoint = ethers.utils.hexlify(farm.poolWeight);
    const _depositFeeBP = ethers.utils.hexlify(farm.depositFeeBP);
    const _withUpdate = true;
    console.log(farm, _pid, _allocPoint, _depositFeeBP, _withUpdate);
    // function set(uint256 _pid, uint256 _allocPoint, uint16 _depositFeeBP, bool _withUpdate) public onlyOwner {
    masterchefContract.set(_pid, _allocPoint, _depositFeeBP, _withUpdate);
    // console.log(masterchefContract.interface.encodeFunctionData("set", [_pid, _allocPoint, _depositFeeBP, _withUpdate]))
  };

  const updatePool = async () => {
    const MasterChefContract = (await (await fetch('/contracts/NefChef.json')).json()) as any;
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    const masterchefContract = new ethers.Contract(
      getAddress(cachedAddresses.masterChef),
      MasterChefContract.abi,
      signer
    );
    const farm = farms.find((f) => f.lpSymbol === addPoolSymbol);

    const _pid = farm.pid;
    await masterchefContract.updatePool(_pid);
  };

  const approvePancake = async () => {
    const RuneTokenContract = (await (await fetch('/contracts/ElRune.json')).json()) as any;
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    const runeTokenContract = new ethers.Contract(getNativeAddress(), RuneTokenContract.abi, signer);
    await runeTokenContract.approve(getAddress(cachedAddresses.pancakeRouter), ethers.constants.MaxUint256);
  };

  const approveMasterchef = async () => {
    const MasterChefContract = (await (await fetch('/contracts/ElChef.json')).json()) as any;
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    const masterchefContract = new ethers.Contract(
      getAddress(cachedAddresses.masterChef),
      MasterChefContract.abi,
      signer
    );
    const farm = farms.find((f) => f.lpSymbol === addPoolSymbol);

    const lpAddress = getAddress(farm.lpAddresses);

    const lpContract = new ethers.Contract(lpAddress, erc20, signer);
    await lpContract.approve(getAddress(cachedAddresses.masterChef), ethers.constants.MaxUint256);
  };

  const createLp = async () => {
    const PancakeRouterABI = (await (await fetch('/abi/pancakeRouter.json')).json()) as any;
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    const pancakeRouterContract = new ethers.Contract(
      getAddress(cachedAddresses.pancakeRouter),
      PancakeRouterABI,
      signer
    );

    const token = poolPair0;
    const amountTokenDesired = ethers.utils.parseEther('0.1'); //web3.utils.toWei('1')
    const amountTokenMin = ethers.utils.parseEther('0.1'); //web3.utils.toWei('0.1')
    const amountETHMin = ethers.utils.parseEther('0.0001'); // web3.utils.toWei('1')
    const to = account;
    const deadline = ethers.utils.hexlify(Math.round(Date.now() / 1000) + 200);
    // console.log(
    //   getAddress(cachedAddresses.pancakeRouter),
    //   token,
    //   amountTokenDesired,
    //   amountTokenMin,
    //   amountETHMin,
    //   to,
    //   deadline,
    // )

    //   function addLiquidityETH(
    //     address token,
    //     uint amountTokenDesired,
    //     uint amountTokenMin,
    //     uint amountETHMin,
    //     address to,
    //     uint deadline
    // ) external payable returns (uint amountToken, uint amountETH, uint liquidity);
    await pancakeRouterContract.addLiquidityETH(token, amountTokenDesired, amountTokenMin, amountETHMin, to, deadline, {
      value: amountETHMin,
    });
  };

  const transferTokenOwnershipToMasterchef = async () => {
    const RuneTokenContract = (await (await fetch('/contracts/NefRune.json')).json()) as any;
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    const runeTokenContract = new ethers.Contract(getAddress(cachedAddresses.ith), RuneTokenContract.abi, signer);

    await runeTokenContract.transferOwnership(getAddress(cachedAddresses.masterChef));
  };

  const throwRuneInTheVoid = async () => {
    const MasterChefContract = (await (await fetch('/contracts/ElChef.json')).json()) as any;
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    const masterchefContract = new ethers.Contract(
      getAddress(cachedAddresses.masterChef),
      MasterChefContract.abi,
      signer
    );

    await masterchefContract.throwRuneInTheVoid();
  };

  const transferRuneOwnershipToVoid = async () => {
    const RuneContract = (await (await fetch('/contracts/EldRune.json')).json()) as any;
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    const runeContract = new ethers.Contract(getAddress(cachedAddresses.eld), RuneContract.abi, signer);

    await runeContract.disableMintingForever();
    //await runeContract.transferOwnership(getAddress(cachedAddresses.voidAddress))
  };

  const transferVoidOwnershipVoid = async () => {
    const VoidContract = (await (await fetch('/contracts/Void.json')).json()) as any;
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    const voidContract = new ethers.Contract(getAddress(cachedAddresses.masterChef), VoidContract.abi, signer);

    await voidContract.transferOwnership('0x0000000000000000000000000000000000000000');
  };

  const transferMasterchefOwnershipToTimelock = async () => {
    const MasterChefContract = (await (await fetch('/contracts/ElChef.json')).json()) as any;
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    const masterchefContract = new ethers.Contract(
      getAddress(cachedAddresses.masterChef),
      MasterChefContract.abi,
      signer
    );

    await masterchefContract.transferOwnership(getAddress(cachedAddresses.timelock));
  };

  const reclaimOwnershipFromMasterchef = async () => {
    const MasterChefContract = (await (await fetch('/contracts/ElChef.json')).json()) as any;
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    const masterchefContract = new ethers.Contract(
      getAddress(cachedAddresses.masterChef),
      MasterChefContract.abi,
      signer
    );

    await masterchefContract.transferOwnership(account);
  };

  const masterchefStopMinting = async () => {
    const MasterChefContract = (await (await fetch('/contracts/ElChef.json')).json()) as any;
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    const masterchefContract = new ethers.Contract(
      getAddress(cachedAddresses.masterChef),
      MasterChefContract.abi,
      signer
    );

    await masterchefContract.rune_proxy_disableMintingForever();
  };

  const tokenStopMinting = async () => {
    const RuneTokenContract = (await (await fetch('/contracts/TirRune.json')).json()) as any;
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    const runeTokenContract = new ethers.Contract(getAddress(cachedAddresses.eld), RuneTokenContract.abi, signer);

    await runeTokenContract.disableMintingForever();
  };

  const setMasterchefInfo = async () => {
    const MasterChefContract = (await (await fetch('/contracts/NefChef.json')).json()) as any;
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    const masterchefContract = new ethers.Contract(
      getAddress(cachedAddresses.ithMasterChef),
      MasterChefContract.abi,
      signer
    );

    const _vaultAddress = getAddress(cachedAddresses.vaultAddress);
    const _charityAddress = getAddress(cachedAddresses.charityAddress);
    const _devAddress = getAddress(cachedAddresses.devAddress);
    const _vaultMintPercent = ethers.utils.hexlify(9500);
    const _charityMintPercent = ethers.utils.hexlify(250);
    const _devMintPercent = ethers.utils.hexlify(250);
    const _vaultDepositPercent = ethers.utils.hexlify(9500);
    const _charityDepositPercent = ethers.utils.hexlify(250);
    const _devDepositPercent = ethers.utils.hexlify(250);

    // function setInfo(address _vaultAddress, address _charityAddress, address _devAddress, uint256 _vaultMintPercent, uint256 _charityMintPercent, uint256 _devMintPercent) public onlyOwner()
    await masterchefContract.setInfo(
      _vaultAddress,
      _charityAddress,
      _devAddress,
      _vaultMintPercent,
      _charityMintPercent,
      _devMintPercent,
      _vaultDepositPercent,
      _charityDepositPercent,
      _devDepositPercent
    );
  };

  const setMasterchefWithdrawFee = async () => {
    const MasterChefContract = (await (await fetch('/contracts/TirChef.json')).json()) as any;
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    const masterchefContract = new ethers.Contract(
      getAddress(cachedAddresses.masterChef),
      MasterChefContract.abi,
      signer
    );
    const _vaultWithdrawPercent = ethers.utils.hexlify(390);

    // function setInfo(address _vaultAddress, address _charityAddress, address _devAddress, uint256 _vaultMintPercent, uint256 _charityMintPercent, uint256 _devMintPercent) public onlyOwner()
    await masterchefContract.setWithdrawFee(_vaultWithdrawPercent);
  };

  const setRuneInfoProxy = async () => {
    const VoidContract = (await (await fetch('/contracts/Void.json')).json()) as any;
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    const voidContract = new ethers.Contract(getAddress(cachedAddresses.runeVoidAddress), VoidContract.abi, signer);

    const _vaultAddress = getAddress(cachedAddresses.vaultAddress);
    const _charityAddress = getAddress(cachedAddresses.charityAddress);
    const _devAddress = getAddress(cachedAddresses.devAddress);
    const _vaultFee = ethers.utils.hexlify(VAULT_FEE);
    const _charityFee = ethers.utils.hexlify(CHARITY_FEE);
    const _devFee = ethers.utils.hexlify(DEV_FEE);
    // const _vaultFee = ethers.utils.hexlify(100)
    // const _charityFee = ethers.utils.hexlify(10)
    // const _devFee = ethers.utils.hexlify(10)

    // function setInfo(address _vaultAddress, address _charityAddress, address _devAddress, uint256 _vaultMintPercent, uint256 _charityMintPercent, uint256 _devMintPercent) public onlyOwner()
    await voidContract.proxy_setFeeInfo(_vaultAddress, _charityAddress, _devAddress, _vaultFee, _charityFee, _devFee);
  };

  const setEldInfoProxy = async () => {
    const VoidContract = (await (await fetch('/contracts/EldVoid.json')).json()) as any;
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    const voidContract = new ethers.Contract(getAddress(cachedAddresses.eldVoidAddress), VoidContract.abi, signer);

    const _vaultAddress = getAddress(cachedAddresses.vaultAddress);
    const _charityAddress = getAddress(cachedAddresses.charityAddress);
    const _devAddress = getAddress(cachedAddresses.devAddress);
    const _botAddress = getAddress(cachedAddresses.vaultAddress);
    const _vaultFee = ethers.utils.hexlify(VAULT_FEE);
    const _charityFee = ethers.utils.hexlify(CHARITY_FEE);
    const _devFee = ethers.utils.hexlify(DEV_FEE);
    const _botFee = ethers.utils.hexlify(200);
    // const _vaultFee = ethers.utils.hexlify(100)
    // const _charityFee = ethers.utils.hexlify(10)
    // const _devFee = ethers.utils.hexlify(10)
    console.log(_vaultAddress, _charityAddress, _devAddress, _botAddress, _vaultFee, _charityFee, _devFee, _botFee);
    // function setInfo(address _vaultAddress, address _charityAddress, address _devAddress, uint256 _vaultMintPercent, uint256 _charityMintPercent, uint256 _devMintPercent) public onlyOwner()
    await voidContract.rune_proxy_setFeeInfo(
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

  const setEldInfo = async () => {
    const RuneTokenContract = (await (await fetch('/contracts/EldRune.json')).json()) as any;
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    const runeTokenContract = new ethers.Contract(getAddress(cachedAddresses.eld), RuneTokenContract.abi, signer);

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

  const setTirInfo = async () => {
    const RuneTokenContract = (await (await fetch('/contracts/TirRune.json')).json()) as any;
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    const runeTokenContract = new ethers.Contract(getAddress(cachedAddresses.tir), RuneTokenContract.abi, signer);

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

  const setIthInfo = async () => {
    const RuneTokenContract = (await (await fetch('/contractNefRune.json')).json()) as any;
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    const runeTokenContract = new ethers.Contract(getAddress(cachedAddresses.ith), RuneTokenContract.abi, signer);

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

  const setRuneInfo = async () => {
    const RuneTokenContract = (await (await fetch('/contracts/RuneToken.json')).json()) as any;
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    const runeTokenContract = new ethers.Contract(getNativeAddress(), RuneTokenContract.abi, signer);

    const _vaultAddress = getAddress(cachedAddresses.vaultAddress);
    const _charityAddress = getAddress(cachedAddresses.charityAddress);
    const _devAddress = getAddress(cachedAddresses.devAddress);
    const _vaultFee = ethers.utils.hexlify(VAULT_FEE);
    const _charityFee = ethers.utils.hexlify(CHARITY_FEE);
    const _devFee = ethers.utils.hexlify(DEV_FEE);

    // function setInfo(address _vaultAddress, address _charityAddress, address _devAddress, uint256 _vaultMintPercent, uint256 _charityMintPercent, uint256 _devMintPercent) public onlyOwner()
    await runeTokenContract.setFeeInfo(_vaultAddress, _charityAddress, _devAddress, _vaultFee, _charityFee, _devFee);
  };

  const setTokenInfo = async () => {
    const RuneTokenContract = (await (await fetch('/contracts/TirRune.json')).json()) as any;
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    const runeTokenContract = new ethers.Contract(getAddress(cachedAddresses.tir), RuneTokenContract.abi, signer);

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

  const setElInfoProxy = async () => {
    const MasterChefContract = (await (await fetch('/contracts/ElChef.json')).json()) as any;
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    const masterchefContract = new ethers.Contract(
      getAddress(cachedAddresses.elMasterChef),
      MasterChefContract.abi,
      signer
    );

    const _vaultAddress = getAddress(cachedAddresses.vaultAddress);
    const _charityAddress = getAddress(cachedAddresses.charityAddress);
    const _devAddress = getAddress(cachedAddresses.devAddress);
    const _botAddress = getAddress(cachedAddresses.vaultAddress);
    const _vaultFee = ethers.utils.hexlify(VAULT_FEE);
    const _charityFee = ethers.utils.hexlify(CHARITY_FEE);
    const _devFee = ethers.utils.hexlify(DEV_FEE);
    const _botFee = ethers.utils.hexlify(200);
    // const _vaultFee = ethers.utils.hexlify(100)
    // const _charityFee = ethers.utils.hexlify(10)
    // const _devFee = ethers.utils.hexlify(10)

    // function setInfo(address _vaultAddress, address _charityAddress, address _devAddress, uint256 _vaultMintPercent, uint256 _charityMintPercent, uint256 _devMintPercent) public onlyOwner()
    await masterchefContract.rune_proxy_setFeeInfo(
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

  const addBotRuneFee = async () => {
    const RuneContract = (await (await fetch('/contracts/TirRune.json')).json()) as any;
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    const runeContract = new ethers.Contract(getAddress(cachedAddresses.ith), RuneContract.abi, signer);

    const _account = botFeeAddress;
    await runeContract.addBot(_account);
  };

  const addExcludedRuneFee = async () => {
    // return
    {
      const VoidContract = (await (await fetch('/contracts/Void.json')).json()) as any;
      const signer = new ethers.providers.Web3Provider(library).getSigner();

      const voidContract = new ethers.Contract(getAddress(cachedAddresses.runeVoidAddress), VoidContract.abi, signer);

      const _account = excludedFeeAddress;

      await voidContract.proxy_addExcluded(_account);
    }
    {
      const MasterChefContract = (await (await fetch('/contracts/ElChef.json')).json()) as any;
      const signer = new ethers.providers.Web3Provider(library).getSigner();

      const masterchefContract = new ethers.Contract(
        getAddress(cachedAddresses.elMasterChef),
        MasterChefContract.abi,
        signer
      );

      const _account = excludedFeeAddress;

      await masterchefContract.rune_proxy_addExcluded(_account);
    }
    {
      const RuneContract = (await (await fetch('/contracts/EldRune.json')).json()) as any;
      const signer = new ethers.providers.Web3Provider(library).getSigner();

      const runeContract = new ethers.Contract(getAddress(cachedAddresses.eld), RuneContract.abi, signer);

      const _account = excludedFeeAddress;
      await runeContract.addExcluded(_account);
    }
    {
      const RuneContract = (await (await fetch('/contracts/TirRune.json')).json()) as any;
      const signer = new ethers.providers.Web3Provider(library).getSigner();

      const runeContract = new ethers.Contract(getAddress(cachedAddresses.tir), RuneContract.abi, signer);

      const _account = excludedFeeAddress;
      await runeContract.addExcluded(_account);
    }
    {
      const RuneContract = (await (await fetch('/contracts/NefRune.json')).json()) as any;
      const signer = new ethers.providers.Web3Provider(library).getSigner();

      const runeContract = new ethers.Contract(getAddress(cachedAddresses.nef), RuneContract.abi, signer);

      const _account = excludedFeeAddress;
      await runeContract.addExcluded(_account);
    }
  };

  const removeExcludedRuneFee = async () => {
    const MasterChefContract = (await (await fetch('/contracts/ElChef.json')).json()) as any;
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    const masterchefContract = new ethers.Contract(
      getAddress(cachedAddresses.elMasterChef),
      MasterChefContract.abi,
      signer
    );

    const _account = excludedFeeAddress;

    await masterchefContract.rune_proxy_removeExcluded(_account);
  };

  const createItem = async () => {
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    {
      const Contract = (await (await fetch('/contracts/ArcaneItemFactory.json')).json()) as any;

      const contract = new ethers.Contract(getAddress(cachedAddresses.blacksmith), Contract.abi, signer);

      const _tokenPrice = ethers.utils.parseEther(`${MINT_COST}`);

      await contract.createItem('Broadsword');
    }
  };

  const setupCharacters = async () => {
    const signer = new ethers.providers.Web3Provider(library).getSigner();

    {
      const Contract = (await (await fetch('/contracts/ArcaneCharacterFactoryV3.json')).json()) as any;

      const contract = new ethers.Contract(getAddress(cachedAddresses.characterFactory), Contract.abi, signer);

      const _tokenPrice = ethers.utils.parseEther(`${MINT_COST}`);

      await contract.updateTokenPrice(_tokenPrice);
    }

    return;

    {
      const Contract = (await (await fetch('/contracts/ArcaneProfile.json')).json()) as any;

      const contract = new ethers.Contract(getAddress(cachedAddresses.profile), Contract.abi, signer);

      // string calldata _teamName,
      // string calldata _teamDescription
      contract.addTeam(
        'Westmarch Knights',
        'Pure at heart, during the Darkening of Tristram, the knights closely followed the teachings of the Zakarum. The knights have since become a largely secular order, more focused on defending Westmarch from physical rather than spiritual harm. They are led by a knight commander. The Duncraig Cross is awarded to nobles who lead knights in defense of the realm.'
      );
    }

    {
      const Contract = (await (await fetch('/contracts/ArcaneCharacterFactoryV3.json')).json()) as any;

      const contract = new ethers.Contract(getAddress(cachedAddresses.characterFactory), Contract.abi, signer);

      await contract.claimFee(ethers.utils.parseEther('521'));
    }

    {
      const Contract = (await (await fetch('/contracts/ArcaneProfile.json')).json()) as any;

      const contract = new ethers.Contract(getAddress(cachedAddresses.profile), Contract.abi, signer);

      contract.makeTeamNotJoinable(2);
    }

    {
      const Contract = (await (await fetch('/contracts/ArcaneCharacterFactoryV3.json')).json()) as any;

      const contract = new ethers.Contract(getAddress(cachedAddresses.characterFactory), Contract.abi, signer);

      const _tokenPrice = ethers.utils.parseEther(`${MINT_COST}`);

      await contract.updateTokenPrice(_tokenPrice);
    }

    {
      const Contract = (await (await fetch('/contracts/ArcaneProfile.json')).json()) as any;

      const contract = new ethers.Contract(getAddress(cachedAddresses.profile), Contract.abi, signer);

      const NFT_ROLE = await contract.NFT_ROLE();

      contract.grantRole(NFT_ROLE, getAddress(cachedAddresses.characters));
    }

    {
      const Contract = (await (await fetch('/contracts/ArcaneProfile.json')).json()) as any;

      const contract = new ethers.Contract(getAddress(cachedAddresses.profile), Contract.abi, signer);

      // string calldata _teamName,
      // string calldata _teamDescription
      contract.addTeam(
        'The First Ones',
        'Formed after the discovery of a cache of hidden texts in an abandoned place.'
      );
    }

    {
      const Contract = (await (await fetch('/contracts/ArcaneCharacterMintingStation.json')).json()) as any;

      const contract = new ethers.Contract(getAddress(cachedAddresses.characterMintingStation), Contract.abi, signer);

      const MINTER_ROLE = await contract.MINTER_ROLE();

      contract.grantRole(MINTER_ROLE, getAddress(cachedAddresses.characterFactory));
    }

    {
      const Contract = (await (await fetch('/contracts/ArcaneCharacterFactoryV3.json')).json()) as any;

      const contract = new ethers.Contract(getAddress(cachedAddresses.characterFactory), Contract.abi, signer);

      const _characterId1Json = 'c1.json';
      const _characterId2Json = 'c2.json';
      const _characterId3Json = 'c3.json';
      const _characterId4Json = 'c4.json';
      const _characterId5Json = 'c5.json';
      const _characterId6Json = 'c6.json';
      const _characterId7Json = 'c7.json';

      await contract.setCharacterJson(
        _characterId1Json,
        _characterId2Json,
        _characterId3Json,
        _characterId4Json,
        _characterId5Json,
        _characterId6Json,
        _characterId7Json
      );

      // await contract.setCharacterName(1, 'Warrior')
      // await contract.setCharacterName(2, 'Sorcereress')
      // await contract.setCharacterName(3, 'Ranger')
      // await contract.setCharacterName(4, 'Necromancer')
      // await contract.setCharacterName(5, 'Paladin')
    }

    {
      const ArcaneCharactersContract = (await (await fetch('/contracts/ArcaneCharacters.json')).json()) as any;

      const arcaneCharactersContract = new ethers.Contract(
        getAddress(cachedAddresses.characters),
        ArcaneCharactersContract.abi,
        signer
      );

      await arcaneCharactersContract.transferOwnership(getAddress(cachedAddresses.characterMintingStation));
    }

    // {
    //   const Contract = (await (
    //     await fetch('/contracts/ArcaneCharacterFactoryV3.json')
    //   ).json()) as any

    //   const contract = new ethers.Contract(getAddress(cachedAddresses.characterFactory), Contract.abi, signer)

    //   await contract.changeOwnershipNFTContract(getAddress(cachedAddresses.characterMintingStation))
    // }

    // {
    //   const Contract = (await (
    //     await fetch('/contracts/ArcaneCharacterMintingStation.json')
    //   ).json()) as any

    //   const contract = new ethers.Contract(getAddress(cachedAddresses.characterMintingStation), Contract.abi, signer)

    //   await contract.changeOwnershipNFTContract(getAddress(cachedAddresses.characterFactory))
    // }

    // {
    //   const Contract = (await (
    //     await fetch('/contracts/ArcaneCharacterFactoryV3.json')
    //   ).json()) as any

    //   const contract = new ethers.Contract(getAddress(cachedAddresses.characterFactory), Contract.abi, signer)

    // //   function setCharacterJson(
    // //     string calldata _characterId5Json,
    // //     string calldata _characterId6Json,
    // //     string calldata _characterId7Json,
    // //     string calldata _characterId8Json,
    // //     string calldata _characterId9Json
    // // )
    // // function setCharacterNames(
    // //     string calldata _characterId5,
    // //     string calldata _characterId6,
    // //     string calldata _characterId7,
    // //     string calldata _characterId8,
    // //     string calldata _characterId9

    //   // const _characterId5Json = 'Warrior.json'
    //   // const _characterId6Json = 'Sorcerer.json'
    //   // const _characterId7Json = 'Ranger.json'
    //   // const _characterId8Json = 'Necromancer.json'
    //   // const _characterId9Json = 'Paladin.json'

    //   // await contract.setCharacterJson(_characterId5Json, _characterId6Json, _characterId7Json, _characterId8Json, _characterId9Json)

    //   // V2 ONLY
    //   // const _characterId5 = 'Warrior'
    //   // const _characterId6 = 'Sorcerer'
    //   // const _characterId7 = 'Ranger'
    //   // const _characterId8 = 'Necromancer'
    //   // const _characterId9 = 'Paladin'

    //   // await contract.setCharacterNames(_characterId5, _characterId6, _characterId7, _characterId8, _characterId9)
    // }

    // ArcaneCharacters.mint(
    //     address _to,
    //     string calldata _tokenURI,
    //     uint8 _characterId
    // )

    // ArcaneCharacters.setCharacterName(uint8 _characterId, string calldata _name)
    // characters.mint()

    // const _characterFactoryV2 = getAddress(cachedAddresses.characterFactoryV2)
    // const _characterMintingStation = getAddress(cachedAddresses.characterMintingStation)
    // const _runeToken = getAddress(cachedAddresses.rune)
    // const _tokenPrice = ethers.utils.parseEther(`${MINT_COST}`)
    // const _ipfsHash = 'mtwirsqawjuoloq2gvtyug2tc3jbf5htm2zeo4rsknfiv3fdp46a/'
    // const _startBlockNumber = block
    // await characterFactory.deploy(
    //   _characterFactoryV2,
    //   _characterMintingStation,
    //   _runeToken,
    //   _tokenPrice,
    //   _ipfsHash,
    //   _startBlockNumber,
    // )
  };

  // const contract = new web3.eth.Contract(abi, address)
  // const arcaneCharacters = await deployContract(account, ArcaneCharactersContract.abi, ['ipfs://'], { // expandTo18Decimals(10000)
  //   gasLimit: 9999999
  // })

  // const tokenA = await deployContract(account, ERC20, [expandTo18Decimals(10000)], overrides)
  // const tokenB = await deployContract(account, ERC20, [expandTo18Decimals(10000)], overrides)

  // // await factory.createPair(tokenA.address, tokenB.address, overrides)
  // const pairAddress = await factory.getPair(tokenA.address, tokenB.address)
  // const pair = new Contract(pairAddress, JSON.stringify(PancakePair.abi), provider).connect(wallet)

  // const token0Address = (await pair.token0()).address
  // const token0 = tokenA.address === token0Address ? tokenA : tokenB
  // const token1 = tokenA.address === token0Address ? tokenB : tokenA
  return (
    <Page>
      <PageWindow>
        <Heading as="h1" size="xxl" color="secondary" mb="8px">
          {t('Runesmith')}
        </Heading>
        <br />
        <br />
        <br />
        <a href="https://bscscan.com/address/0x602a27bBf954b6945534a84C8c88FB8cA9E92B7F">Go to vault</a>
        {/* <Heading as="h2" size="lg" mb="8px">
          {t('Not for you but enjoy I guess')}
        </Heading> */}
        <br />
        <br />
        <button onClick={setup1}>Setup #1</button>
        <button onClick={setup2}>Setup #2</button>
        <br />
        <br />
        <div>
          {log.map((message) => (
            <div>
              {message}
              <br />
            </div>
          ))}
        </div>
        <br />
        <br />
        <hr />
        <br />
        <Heading as="h2" size="lg" mb="8px">
          {t('Main')}
        </Heading>
        <br />
        <br />
        <button onClick={deployRuneContract}>Deploy RUNE Contract</button>
        <br />
        <br />
        <button onClick={deployVoidContract}>Deploy Void Contract</button>
        <br />
        <br />
        <input type="text" value={runeMintAmount} onChange={(e) => setRuneMintAmount(e.target.value)} />
        <button onClick={mintRuneTokens}>Mint RUNE Tokens</button>
        <br />
        <br />
        <button onClick={deployMasterchef}>Deploy MasterChef Contract</button>
        <br />
        <br />
        <button onClick={deployTimelockContract}>Deploy Timelock Contract</button>
        <br />
        <br />
        <button onClick={setMasterchefInfo}>Set MasterChef Info</button>
        <br />
        <br />
        <button onClick={setMasterchefWithdrawFee}>Set MasterChef Withdraw Fee</button>
        <br />
        <br />
        {/* <button onClick={setRuneInfo}>Set Rune Info</button>
        <br />
        <br /> */}
        <button onClick={setRuneInfoProxy}>Set Rune Info</button>
        <br />
        <br />
        <button onClick={setElInfoProxy}>Set El Info</button>
        <br />
        <br />
        <button onClick={setEldInfo}>Set Eld Info</button>
        <br />
        <br />
        <button onClick={setTirInfo}>Set Tir Info</button>
        <br />
        <br />
        <button onClick={setNefInfo}>Set Nef Info</button>
        <br />
        <br />
        <button onClick={setIthInfo}>Set Ith Info</button>
        <br />
        <br />
        <button onClick={transferMasterchefOwnershipToTimelock}>Transfer MasterChef To TimeLock</button>
        <br />
        <br />
        <input type="text" value={emissionRate} onChange={(e) => setEmissionRate(e.target.value)} />
        <button onClick={updateEmissionRate}>Update Emission Rate</button>
        <br />
        <br />
        <input type="text" value={botFeeAddress} onChange={(e) => setBotFeeAddress(e.target.value)} />
        <button onClick={addBotRuneFee}>Add Bot</button>
        <br />
        <br />
        <input type="text" value={excludedFeeAddress} onChange={(e) => setExcludedFeeAddress(e.target.value)} />
        <button onClick={addExcludedRuneFee}>Add Fee Excluded</button>
        <br />
        <br />
        <input type="text" value={excludedFeeAddress} onChange={(e) => setExcludedFeeAddress(e.target.value)} />
        <button onClick={removeExcludedRuneFee}>Remove Fee Excluded</button>
        <br />
        <br />
        <br />
        <br />
        <hr />
        <br />
        <Heading as="h2" size="lg" mb="8px">
          {t('New Rune')}
        </Heading>
        <br />
        <br />
        <input type="text" value={'EL'} onChange={(e) => setRuneMintAmount(e.target.value)} />{' '}
        <button onClick={createToken}>Create Rune</button>
        <br />
        <br />
        <button onClick={transferTokenOwnershipToMasterchef}>Transfer Ownership To MasterChef</button>
        <br />
        <br />
        <button onClick={reclaimOwnershipFromMasterchef}>Reclaim Ownership From MasterChef</button>
        <br />
        <br />
        <hr />
        <br />
        <Heading as="h2" size="lg" mb="8px">
          {t('New LP')}
        </Heading>
        <br />
        <br />
        <button onClick={approvePancake}>Approve PancakeSwap</button>
        <br />
        <br />
        ADDRESS 1: <input type="text" value={poolPair0} onChange={(e) => setPoolPair0(e.target.value)} />
        <br />
        <br />
        ADDRESS 2: <input type="text" value={poolPair1} onChange={(e) => setPoolPair1(e.target.value)} />
        <br />
        <br />
        <button onClick={createLp}>Create LP</button>
        <br />
        <br />
        <hr />
        <br />
        <Heading as="h2" size="lg" mb="8px">
          {t('Add Pool')}
        </Heading>
        <br />
        <br />
        <button onClick={approveMasterchef}>Approve MasterChef</button>
        <br />
        <br />
        <input type="text" value={addPoolSymbol} onChange={(e) => setAddPoolSymbol(e.target.value)} />
        <button onClick={addPool}>Add Pool</button>
        <br />
        <br />
        <button
          onClick={async () => {
            await setAddPoolSymbol('RUNE-BNB LP');
            // await addPool()
          }}>
          Add RUNE-BNB LP
        </button>
        <br />
        <br />
        <button
          onClick={async () => {
            await setAddPoolSymbol('RUNE-BUSD LP');
            // await addPool()
          }}>
          Add RUNE-BUSD LP
        </button>
        <br />
        <br />
        <button
          onClick={async () => {
            await setAddPoolSymbol('BUSD-BNB LP');
            // await addPool()
          }}>
          Add BUSD-BNB LP
        </button>
        <br />
        <br />
        <button
          onClick={async () => {
            await setAddPoolSymbol('BTCB-BNB LP');
            // await addPool()
          }}>
          Add BTCB-BNB LP
        </button>
        <br />
        <br />
        <button
          onClick={async () => {
            await setAddPoolSymbol('USDT-BUSD LP');
            // await addPool()
          }}>
          Add USDT-BUSD LP
        </button>
        <br />
        <br />
        <button
          onClick={async () => {
            await setAddPoolSymbol('EL-RUNE LP');
            // await addPool()
          }}>
          Add EL-RUNE LP
        </button>
        <br />
        <br />
        <button
          onClick={async () => {
            await setAddPoolSymbol('EL-BNB LP');
            // await addPool()
          }}>
          Add EL-BNB LP
        </button>
        <br />
        <br />
        <button
          onClick={async () => {
            await setAddPoolSymbol('EL-BUSD LP');
            // await addPool()
          }}>
          Add EL-BUSD LP
        </button>
        <br />
        <br />
        <button
          onClick={async () => {
            await setAddPoolSymbol('RUNE');
            // await addPool()
          }}>
          Add RUNE
        </button>
        <br />
        <br />
        <button
          onClick={async () => {
            await setAddPoolSymbol('EL');
            // await addPool()
          }}>
          Add EL
        </button>
        <br />
        <br />
        <button
          onClick={async () => {
            await setAddPoolSymbol('TIR');
            // await addPool()
          }}>
          Add TIR
        </button>
        <br />
        <br />
        <button
          onClick={async () => {
            await setAddPoolSymbol('TIR-RUNE LP');
            // await addPool()
          }}>
          Add TIR-RUNE LP
        </button>
        <br />
        <br />
        <button
          onClick={async () => {
            await setAddPoolSymbol('TIR-BNB LP');
            // await addPool()
          }}>
          Add TIR-BNB LP
        </button>
        <br />
        <br />
        <button
          onClick={async () => {
            await setAddPoolSymbol('TIR-BUSD LP');
            // await addPool()
          }}>
          Add TIR-BUSD LP
        </button>
        <br />
        <br />
        <button
          onClick={async () => {
            await setAddPoolSymbol('TIR-EL LP');
            // await addPool()
          }}>
          Add TIR-EL LP
        </button>
        <br />
        <br />
        <button
          onClick={async () => {
            await setAddPoolSymbol('ELD');
            // await addPool()
          }}>
          Add ELD
        </button>
        <br />
        <br />
        <button
          onClick={async () => {
            await setAddPoolSymbol('ELD-BUSD LP');
            // await addPool()
          }}>
          Add ELD-BUSD LP
        </button>
        <br />
        <br />
        <button
          onClick={async () => {
            await setAddPoolSymbol('NEF');
            // await addPool()
          }}>
          Add NEF
        </button>
        <br />
        <br />
        <button
          onClick={async () => {
            await setAddPoolSymbol('NEF-RUNE LP');
            // await addPool()
          }}>
          Add NEF-RUNE LP
        </button>
        <br />
        <br />
        <button
          onClick={async () => {
            await setAddPoolSymbol('NEF-BNB LP');
            // await addPool()
          }}>
          Add NEF-BNB LP
        </button>
        <br />
        <br />
        <button
          onClick={async () => {
            await setAddPoolSymbol('NEF-BUSD LP');
            // await addPool()
          }}>
          Add NEF-BUSD LP
        </button>
        <br />
        <br />
        <button
          onClick={async () => {
            await setAddPoolSymbol('NEF-EL LP');
            // await addPool()
          }}>
          Add NEF-EL LP
        </button>
        <br />
        <br />
        <button
          onClick={async () => {
            await setAddPoolSymbol('NEF-TIR LP');
            // await addPool()
          }}>
          Add NEF-TIR LP
        </button>
        <br />
        <br />
        <hr />
        <br />
        <Heading as="h2" size="lg" mb="8px">
          {t('Set Pool')}
        </Heading>
        <br />
        <br />
        <input type="text" value={addPoolSymbol} onChange={(e) => setAddPoolSymbol(e.target.value)} />
        <button onClick={setPool}>Set Pool</button>
        <br />
        <br />
        <hr />
        <br />
        <Heading as="h2" size="lg" mb="8px">
          {t('Update Pool')}
        </Heading>
        <br />
        <br />
        <input type="text" value={addPoolSymbol} onChange={(e) => setAddPoolSymbol(e.target.value)} />
        <button onClick={updatePool}>Update Pool</button>
        <br />
        <br />
        <hr />
        <br />
        <Heading as="h2" size="lg" mb="8px">
          {t('Characters')}
        </Heading>
        <br />
        <br />
        <button onClick={deployProfileContract}>Deploy Arcane Profile Contract</button>
        <br />
        <br />
        <button onClick={deployCharacterContract}>Deploy Arcane Character Contract</button>
        <br />
        <br />
        <button onClick={deployCharacterFactoryV2}>Deploy Arcane CharacterFactoryV2 Contract</button>
        <br />
        <br />
        <button onClick={deployCharacterMintingStation}>Deploy Arcane CharacterMintingStation Contract</button>
        <br />
        <br />
        <button onClick={deployCharacterFactoryV3}>Deploy Arcane CharacterFactoryV3 Contract</button>
        <br />
        <br />
        <button onClick={deployCharacterFactoryV4}>Deploy Arcane CharacterFactoryV4 Contract</button>
        <br />
        <br />
        <button onClick={deployCharacterSpecial}>Deploy Arcane CharacterSpecial Contract</button>
        <br />
        <br />
        <button onClick={setupCharacters}>Setup Arcane Characters</button>
        <br />
        <br />
        <button onClick={masterchefStopMinting}>STOP MINTING [MASTERCHEF]</button>
        <br />
        <br />
        <button onClick={tokenStopMinting}>STOP MINTING [TOKEN]</button>
        <br />
        <br />
        <button onClick={transferRuneOwnershipToVoid}>TRANSFER ELD TO THE VOID</button>
        <br />
        <br />
        <button onClick={transferVoidOwnershipVoid}>SEND VOID TO THE VOID</button>
        <br />
        <br />
        <button onClick={throwRuneInTheVoid}>THROW EL IN THE VOID</button>
        <br />
        <br />
        <button onClick={setRuneDevAddress}>SET DEV ADDRESS [TOKEN]</button>
        <br />
        <br />
        <button onClick={setTokenInfo}>SET INFO [TOKEN]</button>
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
        Item A1:
        <br />
        <input type="text" value={currentItemA1} onChange={(e) => setCurrentItemA1(e.target.value)} />
        <br />
        Item B1:
        <br />
        <input type="text" value={currentItemB1} onChange={(e) => setCurrentItemB1(e.target.value)} />
        <br />
        Item A2:
        <br />
        <input type="text" value={currentItemA2} onChange={(e) => setCurrentItemA2(e.target.value)} />
        <br />
        Item B2:
        <br />
        <input type="text" value={currentItemB2} onChange={(e) => setCurrentItemB2(e.target.value)} />
        <br />
        Item A3:
        <br />
        <input type="text" value={currentItemA3} onChange={(e) => setCurrentItemA3(e.target.value)} />
        <br />
        Item B3:
        <br />
        <input type="text" value={currentItemB3} onChange={(e) => setCurrentItemB3(e.target.value)} />
        <br />
        Item A4:
        <br />
        <input type="text" value={currentItemA4} onChange={(e) => setCurrentItemA4(e.target.value)} />
        <br />
        Item B4:
        <br />
        <input type="text" value={currentItemB4} onChange={(e) => setCurrentItemB4(e.target.value)} />
        <br />
        Item A5:
        <br />
        <input type="text" value={currentItemA5} onChange={(e) => setCurrentItemA5(e.target.value)} />
        <br />
        Item B5:
        <br />
        <input type="text" value={currentItemB5} onChange={(e) => setCurrentItemB5(e.target.value)} />
        <br />
        <button onClick={convertTokenIdToItem}>CONVERT TOKEN ID TO ITEM</button>
        <button onClick={convertItemToTokenId}>CONVERT ITEM ID TO TOKEN ID</button>
        <hr />
        <br />
        <br />
      </PageWindow>
    </Page>
  );
};

export default Governance;
