import React, { useEffect, useRef, useState, useContext } from 'react';
import { Button, Flex, LinkExternal, Text } from '~/ui';
import ItemInformation from '~/components/ItemInformation';
import { ItemCategoriesType, ItemsMainCategoriesType } from 'rune-backend-sdk/build/data/items.type';
import useRuneBalance from '~/hooks/useRuneBalance';
import { useRunePrice } from '~/state/hooks';
import Page from '~/components/layout/Page';
import PageWindow from '~/components/PageWindow';
import { getBalanceNumber } from '~/utils/formatBalance';
import useI18n from '~/hooks/useI18n';
import { useTranslation } from 'react-i18next';

const InventoryInner = ({ showFull }) => {
  const { t } = useTranslation();
  const runePrice = useRunePrice('RUNE');
  const runeBalance = useRuneBalance('RUNE');
  const balance = getBalanceNumber(runeBalance);
  const price = parseFloat(runePrice.toNumber().toLocaleString('en-US'));

  const item = {
    id: 99999,
    name: 'RUNE',
    category: ItemCategoriesType.RUNE,
    icon: process.env.REACT_APP_PUBLIC_URL + 'images/rune.png',
    value: balance + '',
    isNew: false,
    description: ['Legacy token.'],
    recipe: { requirement: [] },
    details: {
      Distribution: 'Fair launch',
      Date: 'March 31, 2021',
      Supply: '19,500',
      Burned: '3,030',
      'Total Supply': '22,530',
    },
    isEquipable: false,
    isTradeable: true,
    isCraftable: false,
    branches: [
      { description: '', attributes: [] },
      { description: '', attributes: [] },
    ],
    attributes: [],
  };

  const tokenAddress = '0xa9776b590bfc2f956711b3419910a5ec1f63153e';

  return (
    <Page>
      <PageWindow>
        <Flex justifyContent="space-between" alignItems="center">
          <ItemInformation item={item} price={price || 0} />
        </Flex>
        {item.category === ItemCategoriesType.RUNE ? (
          <>
            {tokenAddress ? (
              <div>
                <Text mr="10px">{t('Contract: ')}</Text>
                <LinkExternal href={`https://bscscan.com/address/${tokenAddress}`}>{tokenAddress}</LinkExternal>
                <br />
                <Text mr="10px">{t('Chart: ')}</Text>
                <LinkExternal href={`https://dex.guru/token/${tokenAddress}-bsc`}>Dex.Guru</LinkExternal>
              </div>
            ) : (
              <Text mr="10px">{t('Not released yet.')}</Text>
            )}
          </>
        ) : null}
        <br />
        <br />
        {item.details
          ? Object.keys(item.details).map((key) => (
              <div key={key}>
                <Text mr="10px" bold>
                  {t(key)}:
                </Text>{' '}
                <Text>{item.details[key]}</Text>
                <br />
              </div>
            ))
          : null}
        <br />
        <br />
      </PageWindow>
    </Page>
  );
};

const Inventory = ({ showFull }) => {
  return <InventoryInner showFull={showFull} />;
};

Inventory.defaultProps = {
  showFull: false,
};

export default Inventory;
