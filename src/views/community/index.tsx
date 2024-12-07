import React, { useEffect, useRef, useState, useContext } from 'react';
import styled from 'styled-components';
import { Link as RouterLink, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Tag, Flex, Card, Heading, CardBody, Link, BaseLayout, OpenNewIcon } from '~/ui';
import { Modal, useModal, InjectedModalProps } from '~/components/Modal';
import Page from '~/components/layout/Page';
import { PurchaseModal } from '~/components/PurchaseModal';
import PageWindow from '~/components/PageWindow';
import i18n from '~/config/i18n';

const Text = styled.div``;

const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;
  grid-gap: 75px;

  & > div {
    grid-column: span 4;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 12;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 4;
    }
  }
`;

const Header = styled.div`
  min-height: 28px;
  width: 100%;
  font-weight: bold;
  font-size: 18px;
  text-align: center;
  padding: 10px;
`;

const InfoBlock = styled.div`
  // padding: 24px;
  margin-top: 20px;
  text-align: left;
  font-size: 0.8rem;
`;

const HeaderTag = styled.div`
  margin-top: 10px;
  width: 100%;
`;

const Tag2 = styled(Tag)`
  zoom: 0.7;
`;

const MainCard = styled(Card)`
  position: relative;
  font-weight: bold;
  border-width: 15px;
  border-style: solid;
  border-color: transparent;
  border-image: url('/images/frame.png') 80 repeat;
  border-image-width: 80px;
  background-color: rgba(0, 0, 0, 0.4);
  background-image: none;
  padding: 0 10px;
  // transform: scale(0.8);
  text-shadow: 1px 1px 1px black;
  // box-shadow: 0 2px 0 0 rgb(0 0 0 / 80%), inset 0 -1px 0 0 rgb(0 0 0 / 10%), 0 0 66px 66px rgb(0 0 0 / 10%);
  text-align: center;
  color: #bb955e;
  text-shadow: 1px 1px 1px black;
  font-weight: bold;
`;

const Image = styled.img`
  border-radius: 7px;
`;

const ImageBlock = ({ url }) => <Image src={url} />;

const BottomMenu = styled.div`
  position: absolute;
  bottom: 10px;
  left: 0;
  width: 100%;
  text-align: center;
`;

const Rules = () => {
  const { t } = useTranslation();
  const [showVision, setShowVision] = useState(false);
  const [onPresentPurchaseModal] = useModal(<PurchaseModal onSuccess={() => {}} />);

  return (
    <Page>
      <Card style={{ width: '100%' }}>
        <Heading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
          {t('Community')}
        </Heading>
        <hr />
        <CardBody>
          We host weekly quizzes with prizes, contests, and riddles in our main Telegram chat. Join us here:{' '}
          <a href="https://telegram.arken.gg" target="_blank" rel="noreferrer noopener">
            https://telegram.arken.gg
          </a>
        </CardBody>
      </Card>
    </Page>
  );
};

export default Rules;
