import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import BottomCTA from '~/components/BottomCTA';
import Linker from '~/components/Linker';
import { useModal } from '~/components/Modal';
import { PurchaseModal } from '~/components/PurchaseModal';
import { Card, CardBody, Heading } from '~/ui';

const Image = styled.img`
  border-radius: 7px;
`;

const BoxHeading = styled(Heading)`
  margin-bottom: 16px;
`;
const PitchCard = styled.div`
  ${({ theme }) => theme.mediaQueries.lg} {
    display: flex;
    flex: 1;
    flex-direction: row;

    & > div:first-child {
      flex-grow: 0;
      flex-shrink: 0;
    }

    & > div {
    }
  }
`;
const Binzy = () => {
  const { t } = useTranslation();
  const [showVision, setShowVision] = useState(false);
  const [onPresentPurchaseModal] = useModal(<PurchaseModal onSuccess={() => {}} />);

  return (
    <>
      <Card style={{ maxWidth: 1200, margin: '0 auto 30px auto', width: '100%' }}>
        <Heading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
          {t('Binzy.ai')}
        </Heading>
        <hr />
        <CardBody>Test</CardBody>
      </Card>
      <BottomCTA />
    </>
  );
};

export default Binzy;
