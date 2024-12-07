const symbolMap = {
  EX: 'EX',
  ELM: 'ELM',
  TYR: 'TYR',
  NEN: 'NEN',
  EVA: 'EVA',
  ISA: 'ISA',
  TATO: 'TATO',
  RO: 'RO',
  ORE: 'ORE',
  THAL: 'THAL',
  ASH: 'ASH',
  SEN: 'SEN',
  SOLO: 'SOLO',
  DA: 'DA',
  HAN: 'HAN',
  ION: 'ION',
  LUX: 'LUX',
  KA: 'KA',
  FUS: 'FUS',
  LEX: 'LEX',
  PAI: 'PAI',
  ULN: 'ULN',
  MOR: 'MOR',
  ISK: 'ISK',
  GON: 'GON',
  VAL: 'VAL',
  OH: 'OH',
  LOR: 'LOR',
  SU: 'SU',
  BERU: 'BERU',
  JUA: 'JUA',
  CHIN: 'CHIN',
  ZENO: 'ZENO',
  EL: 'EX',
  ELD: 'ELM',
  TIR: 'TYR',
  NEF: 'NEN',
  ETH: 'EVA',
  ITH: 'ISA',
  TAL: 'TATO',
  RAL: 'RO',
  ORT: 'ORE',
  THUL: 'THAL',
  AMN: 'ASH',
  SHAEL: 'SEN',
  SOL: 'SOLO',
  DOL: 'DA',
  HEL: 'HAN',
  IO: 'ION',
  LUM: 'LUX',
  KO: 'KA',
  FAL: 'FUS',
  LEM: 'LEX',
  PUL: 'PAI',
  UM: 'ULN',
  MAL: 'MOR',
  IST: 'ISK',
  GUL: 'GON',
  VEX: 'VAL',
  OHM: 'OH',
  LO: 'LOR',
  SUR: 'SU',
  BER: 'BERU',
  JAH: 'JUA',
  CHAM: 'CHIN',
  ZOD: 'ZENO',
};

function capitalizeFirstLetter(string) {
  if (!string) return ''; // Handle empty strings
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export function runeformMap(runeform) {
  let res = runeform;

  for (const rune of runeform.split(' ')) {
    res = res.replace(rune, capitalizeFirstLetter(symbolMap[rune.toUpperCase()]));
  }

  return res;
}

export default function (symbol) {
  if (symbol === undefined) return undefined;
  if (symbol === null) return null;

  const uppercase = symbol.toUpperCase();

  if (symbolMap[uppercase]) return symbolMap[uppercase];
  if (symbolMap[uppercase.replace(' RUNE', '')]) return symbolMap[uppercase.replace(' RUNE', '')] + ' Rune';
  if (symbolMap[uppercase.replace('-BUSD LP', '')]) return symbolMap[uppercase.replace('-BUSD LP', '')] + '-BUSD LP';
  if (symbolMap[uppercase.replace('-BUSD LP V2', '')])
    return symbolMap[uppercase.replace('-BUSD LP', '')] + '-BUSD LP V2';
  if (symbolMap[uppercase.replace('-BNB LP', '')]) return symbolMap[uppercase.replace('-BNB LP', '')] + '-BNB LP';
  if (symbolMap[uppercase.replace('-NEF LP', '')]) return symbolMap[uppercase.replace('-NEF LP', '')] + '-NEN LP';
  if (symbolMap[uppercase.replace('-EL LP', '')]) return symbolMap[uppercase.replace('-EL LP', '')] + '-EX LP';
  if (symbolMap[uppercase.replace('-ELD LP', '')]) return symbolMap[uppercase.replace('-ELD LP', '')] + '-ELM LP';

  return symbol;
}
