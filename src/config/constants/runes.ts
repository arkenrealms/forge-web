import farms from '@arken/node/legacy/farmInfo';
import contracts from '@arken/node/legacy/contractInfo';

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
    contract: contracts.tyr,
  },
  nef: {
    usdFarmPid: 21,
    contract: contracts.nen,
  },
  eth: {
    contract: contracts.eva,
  },
  ith: {
    usdFarmPid: 25,
    contract: contracts.isa,
  },
  tal: {
    usdFarmPid: 30,
    contract: contracts.tato,
  },
  ral: {
    usdFarmPid: 33,
    contract: contracts.ro,
  },
  ort: {
    usdFarmPid: 35,
    contract: contracts.ore,
  },
  thul: {
    usdFarmPid: 38,
    contract: contracts.thal,
  },
  amn: {
    usdFarmPid: 41,
    contract: contracts.ash,
  },
  sol: {
    usdFarmPid: 44,
    contract: contracts.solo,
  },
  shael: {
    usdFarmPid: 47,
    contract: contracts.sen,
  },
  dol: {
    usdFarmPid: farms.find((f) => f.lpSymbol === 'DOL-BUSD LP')?.pid,
    contract: contracts.da,
  },
  hel: {
    usdFarmPid: farms.find((f) => f.lpSymbol === 'HEL-BUSD LP')?.pid,
    contract: contracts.han,
  },
  io: {
    usdFarmPid: farms.find((f) => f.lpSymbol === 'IO-BUSD LP')?.pid,
    contract: contracts.ion,
  },
  lum: {
    usdFarmPid: farms.find((f) => f.lpSymbol === 'LUM-BUSD LP')?.pid,
    contract: contracts.lux,
  },
  ko: {
    usdFarmPid: farms.find((f) => f.lpSymbol === 'KO-BUSD LP')?.pid,
    contract: contracts.ka,
  },
  fal: {
    usdFarmPid: farms.find((f) => f.lpSymbol === 'FAL-BUSD LP')?.pid,
    contract: contracts.fus,
  },
  lem: {
    usdFarmPid: farms.find((f) => f.lpSymbol === 'LEM-BUSD LP')?.pid,
    contract: contracts.leni,
  },
  pul: {
    usdFarmPid: farms.find((f) => f.lpSymbol === 'PUL-BUSD LP')?.pid,
    contract: contracts.pai,
  },
  um: {
    usdFarmPid: farms.find((f) => f.lpSymbol === 'UM-BUSD LP')?.pid,
    contract: contracts.uln,
  },
  mal: {
    usdFarmPid: farms.find((f) => f.lpSymbol === 'MAL-BUSD LP')?.pid,
    contract: contracts.mor,
  },
  ist: {
    usdFarmPid: farms.find((f) => f.lpSymbol === 'IST-BUSD LP')?.pid,
    contract: contracts.isk,
  },
  gul: {
    usdFarmPid: farms.find((f) => f.lpSymbol === 'GUL-BUSD LP')?.pid,
    contract: contracts.gon,
  },
  vex: {
    usdFarmPid: farms.find((f) => f.lpSymbol === 'VEX-BUSD LP')?.pid,
    contract: contracts.val,
  },
  ohm: {
    usdFarmPid: farms.find((f) => f.lpSymbol === 'OHM-BUSD LP')?.pid,
    contract: contracts.oh,
  },
  lo: {
    usdFarmPid: farms.find((f) => f.lpSymbol === 'LO-BUSD LP')?.pid,
    contract: contracts.lor,
  },
  sur: {
    usdFarmPid: farms.find((f) => f.lpSymbol === 'SUR-BUSD LP')?.pid,
    contract: contracts.su,
  },
  ber: {
    usdFarmPid: farms.find((f) => f.lpSymbol === 'BER-BUSD LP')?.pid,
    contract: contracts.beru,
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
