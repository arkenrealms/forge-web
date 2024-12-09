import farms from '@arken/node/farmInfo';
import contracts from '@arken/node/contractInfo';

export default {
  rune: {
    usdFarmPid: 1,
    contract: contracts.rune,
  },
  rxs: {
    usdFarmPid: 74,
    contract: contracts.rxs,
  },
  el: {
    usdFarmPid: 8,
    contract: contracts.ex,
  },
  eld: {
    usdFarmPid: 17,
    contract: contracts.elm,
  },
  tir: {
    usdFarmPid: 14,
    contract: contracts.tir,
  },
  nef: {
    usdFarmPid: 21,
    contract: contracts.nef,
  },
  eth: {
    contract: contracts.eth,
  },
  ith: {
    usdFarmPid: 25,
    contract: contracts.ith,
  },
  tal: {
    usdFarmPid: 30,
    contract: contracts.tal,
  },
  ral: {
    usdFarmPid: 33,
    contract: contracts.ro,
  },
  ort: {
    usdFarmPid: 35,
    contract: contracts.ort,
  },
  thul: {
    usdFarmPid: 38,
    contract: contracts.thul,
  },
  amn: {
    usdFarmPid: 41,
    contract: contracts.amn,
  },
  sol: {
    usdFarmPid: 44,
    contract: contracts.sol,
  },
  shael: {
    usdFarmPid: 47,
    contract: contracts.shael,
  },
  dol: {
    usdFarmPid: farms.find((f) => f.lpSymbol === 'DOL-BUSD LP')?.pid,
    contract: contracts.dol,
  },
  hel: {
    usdFarmPid: farms.find((f) => f.lpSymbol === 'HEL-BUSD LP')?.pid,
    contract: contracts.hel,
  },
  io: {
    usdFarmPid: farms.find((f) => f.lpSymbol === 'IO-BUSD LP')?.pid,
    contract: contracts.io,
  },
  lum: {
    usdFarmPid: farms.find((f) => f.lpSymbol === 'LUM-BUSD LP')?.pid,
    contract: contracts.lum,
  },
  ko: {
    usdFarmPid: farms.find((f) => f.lpSymbol === 'KO-BUSD LP')?.pid,
    contract: contracts.ko,
  },
  fal: {
    usdFarmPid: farms.find((f) => f.lpSymbol === 'FAL-BUSD LP')?.pid,
    contract: contracts.fal,
  },
  lem: {
    usdFarmPid: farms.find((f) => f.lpSymbol === 'LEM-BUSD LP')?.pid,
    contract: contracts.lem,
  },
  pul: {
    usdFarmPid: farms.find((f) => f.lpSymbol === 'PUL-BUSD LP')?.pid,
    contract: contracts.pul,
  },
  um: {
    usdFarmPid: farms.find((f) => f.lpSymbol === 'UM-BUSD LP')?.pid,
    contract: contracts.um,
  },
  mal: {
    usdFarmPid: farms.find((f) => f.lpSymbol === 'MAL-BUSD LP')?.pid,
    contract: contracts.mal,
  },
  ist: {
    usdFarmPid: farms.find((f) => f.lpSymbol === 'IST-BUSD LP')?.pid,
    contract: contracts.ist,
  },
  gul: {
    usdFarmPid: farms.find((f) => f.lpSymbol === 'GUL-BUSD LP')?.pid,
    contract: contracts.gul,
  },
  vex: {
    usdFarmPid: farms.find((f) => f.lpSymbol === 'VEX-BUSD LP')?.pid,
    contract: contracts.vex,
  },
  ohm: {
    usdFarmPid: farms.find((f) => f.lpSymbol === 'OHM-BUSD LP')?.pid,
    contract: contracts.ohm,
  },
  lo: {
    usdFarmPid: farms.find((f) => f.lpSymbol === 'LO-BUSD LP')?.pid,
    contract: contracts.lo,
  },
  sur: {
    usdFarmPid: farms.find((f) => f.lpSymbol === 'SUR-BUSD LP')?.pid,
    contract: contracts.sur,
  },
  ber: {
    usdFarmPid: farms.find((f) => f.lpSymbol === 'BER-BUSD LP')?.pid,
    contract: contracts.ber,
  },
  jah: {
    usdFarmPid: farms.find((f) => f.lpSymbol === 'JAH-BUSD LP')?.pid,
    contract: contracts.jua,
  },
  cham: {
    usdFarmPid: farms.find((f) => f.lpSymbol === 'CHAM-BUSD LP')?.pid,
    contract: contracts.chin,
  },
  zod: {
    usdFarmPid: farms.find((f) => f.lpSymbol === 'ZOD-BUSD LP')?.pid,
    contract: contracts.zeno,
  },
};
