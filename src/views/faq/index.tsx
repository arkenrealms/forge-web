import React, { useEffect, useRef, useState, useContext } from 'react';
import styled from 'styled-components';
import { Link as RouterLink, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Tag, Flex, Card, Card2, Heading, CardBody, Link, BaseLayout, OpenNewIcon } from '~/ui';
import { Modal, useModal, InjectedModalProps } from '~/components/Modal';
import Page from '~/components/layout/Page';
import { PurchaseModal } from '~/components/PurchaseModal';

const Image = styled.img`
  border-radius: 7px;
`;

const Rules = () => {
  const { t } = useTranslation();
  const [showVision, setShowVision] = useState(false);
  const [onPresentPurchaseModal] = useModal(<PurchaseModal onSuccess={() => {}} />);

  return (
    <Page>
      <Card2 style={{ width: '100%' }}>
        <Heading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15, padding: 20 }}>
          {t('FAQ')}
        </Heading>
        <hr />
        <CardBody>
          <p>‍</p>
          <p>
            <strong>Q. When did the token go live?</strong>
          </p>
          <p>
            <strong>$ARX</strong> went live December 20, 2024.
          </p>
          <p>‍</p>
          <p>
            <strong>Q. Max supply?</strong>
          </p>
          <p>
            <strong>$ARX</strong> has a max supply of 192,000,000.
          </p>
        </CardBody>
      </Card2>
    </Page>
  );
};

export default Rules;
