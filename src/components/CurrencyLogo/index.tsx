import { Currency, ETHER, Token } from '@arcanefinance/sdk';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import useHttpLocations from '~/hooks/useHttpLocations';
import { WrappedTokenInfo } from '../../state/lists/hooks';
import Logo from '../Logo';
import CoinLogo from '../pancake/CoinLogo';

const tokenImageMap = {
  '0x210c14fbecc2bd9b6231199470da12ad45f64d45': '/images/farms/el.png',
  '0xe00b8109bcb70b1edeb4cf87914efc2805020995': '/images/farms/eld.png',
  '0x919676B73a8d124597cBbA2E400f81Aa91Aa2450': '/images/farms/eth.png',
  '0x125a3e00a9a11317d4d95349e68ba0bc744addc4': '/images/farms/tir.png',
  '0xef4f66506aaaeeff6d10775ad6f994105d8f11b4': '/images/farms/nef.png',
  '0x098Afb73F809D8Fe145363F802113E3825d7490C': '/images/farms/ith.png',
  '0x5DE72A6fca2144Aa134650bbEA92Cc919244F05D': '/images/farms/tal.png',
  '0x2F25DbD430CdbD1a6eC184c79C56C18918fcc97D': '/images/farms/ral.png',
  '0x33bc7539D83C1ADB95119A255134e7B584cd5c59': '/images/farms/ort.png',
  '0x1fC5bffCf855B9D7897F1921363547681F6847Aa': '/images/farms/thul.png',
  '0x346C03fe8BE489baAAc5CE67e817Ff11fb580F98': '/images/farms/amn.png',
  '0x4ffd3b8ba90f5430cda7f4cc4c0a80df3cd0e495': '/images/farms/sol.png',
  '0x56DeFe2310109624c20c2E985c3AEa63b9718319': '/images/farms/shael.png',
  '0x94F2E23c7422fa8c5A348a0E6D7C05b0a6C8a5b8': '/images/farms/dol.png',
  '0x0D3877152BaaC86D42A4123ABBeCd1178d784cC7': '/images/farms/hel.png',
  '0xa00672c2a70E4CD3919afc2043b4b46e95041425': '/images/farms/io.png',
  '0xD481F4eA902e207AAda9Fa093f80d50B19444253': '/images/farms/lum.png',
  '0x2a74b7d7d44025Bcc344E7dA80d542e7b0586330': '/images/farms/ko.png',
  '0xcd06c743a1628fB02C15946a56037CD7020F3Bd2': '/images/farms/fal.png',
  '0xFF0682D330C7a6381214fa541d8D288dD0D098ED': '/images/farms/lem.png',
  '0xfa3f14C55adaDDC2035083146c1cF768bD035E06': '/images/farms/pul.png',
  '0x7e8a6d548a68339481c500f2B56367698A9F7213': '/images/farms/um.png',
  '0xdfFeB26FbaCF79823C50a4e7DCF69378667c9941': '/images/farms/mal.png',
  '0x90132915EbDe0CF93283D55AB3fBBA15449f95A9': '/images/farms/ist.png',
  '0xa89805AB2ca5B70c89B74b3B0346a88a5B8eAc85': '/images/farms/gul.png',
  '0x60E3538610e9f4974A36670842044CB4936e5232': '/images/farms/vex.png',
  '0x9449D198AB998388a577D4eBfDa4656D9fa3468a': '/images/farms/ohm.png',
  '0x08fb6740Cc5170e48B2Ad8Cc07422d3302EF5e78': '/images/farms/lo.png',
  '0x191472E8E899E98048AeB82faa1AE4Ec3801b936': '/images/farms/sur.png',
  '0x1656f8d69F2354a9989Fe705c0107190A4815287': '/images/farms/ber.png',
  '0xBC996F2f6703cc13AA494F846A1c563A4A0f1A80': '/images/farms/jah.png',
  '0xfb134f1721bc602Eb14148f89e1225dC7C93D8d4': '/images/farms/cham.png',
  '0x3e151ca82b3686f555c381530732df1cfc3c7890': '/images/farms/zod.png',
  '0xa9776b590bfc2f956711b3419910a5ec1f63153e': '/images/farms/rune.png',
};

const lowerCaseTokenImageMap = Object.fromEntries(
  Object.entries(tokenImageMap).map(([key, value]) => [key.toLowerCase(), value])
);

const getTokenLogoURL = (address: string) =>
  lowerCaseTokenImageMap[address.toLowerCase()] ||
  `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/${address}/logo.png`;

const StyledBnbLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`;

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`;

export default function CurrencyLogo({
  currency,
  size = '24px',
  style,
}: {
  currency?: Currency;
  size?: string;
  style?: React.CSSProperties;
}) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined);

  const srcs: string[] = useMemo(() => {
    if (currency === ETHER) return [];

    if (currency instanceof Token) {
      if (currency instanceof WrappedTokenInfo) {
        return [
          ...uriLocations,
          `/images/farms/${currency?.address ?? 'token'}.png`,
          getTokenLogoURL(currency.address),
        ];
      }

      return [`/images/farms/${currency?.address ?? 'token'}.png`, getTokenLogoURL(currency.address)];
    }
    return [];
  }, [currency, uriLocations]);

  if (currency === ETHER) {
    return <StyledBnbLogo src="/images/farms/bnb.png" size={size} style={style} />;
  }

  return (currency as any)?.symbol ? (
    <CoinLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
  ) : (
    <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
  );
}
