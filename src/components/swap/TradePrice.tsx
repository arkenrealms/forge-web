import React from 'react';
import { Price } from '@arcanefinance/sdk';
import { SyncAltIcon, Text } from '~/ui';
import { StyledBalanceMaxMini } from './styleds';
import symbolMap from '~/utils/symbolMap';

interface TradePriceProps {
  price?: Price;
  showInverted: boolean;
  setShowInverted: (showInverted: boolean) => void;
}

export default function TradePrice({ price, showInverted, setShowInverted }: TradePriceProps) {
  const formattedPrice = showInverted ? price?.toSignificant(6) : price?.invert()?.toSignificant(6);

  const show = Boolean(price?.baseCurrency && price?.quoteCurrency);
  const label = showInverted
    ? `${symbolMap(price?.quoteCurrency?.symbol)} per ${symbolMap(price?.baseCurrency?.symbol)}`
    : `${symbolMap(price?.baseCurrency?.symbol)} per ${symbolMap(price?.quoteCurrency?.symbol)}`;

  return (
    <Text fontSize="14px" style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
      {show ? (
        <>
          {formattedPrice ?? '-'} {label}
          <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)}>
            <SyncAltIcon width="20px" color="primary" />
          </StyledBalanceMaxMini>
        </>
      ) : (
        '-'
      )}
    </Text>
  );
}
