import React, { useEffect, useRef, useState, useContext } from 'react';
import styled from 'styled-components';
import { Link as RouterLink, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Flex, Card, Heading, CardBody, Link, BaseLayout, OpenNewIcon } from '~/ui';
import { Modal, useModal, InjectedModalProps } from '~/components/Modal';
import Page from '~/components/layout/Page';
import { PurchaseModal } from '~/components/PurchaseModal';
import Newsletter from '~/components/Newsletter';
import i18n from '~/config/i18n';

const Container = styled.div``;

const Img = styled.img`
  filter: contrast(1.1) drop-shadow(2px 4px 6px black);
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 100%;
  }
`;
const HeadingSilver = styled.div`
  background-image: -webkit-linear-gradient(
    top,
    #bcbcbc 0%,
    #bcbcbc 17.5%,
    #cecece 33.75%,
    #f0f0f0 50%,
    #cecece 63.75%,
    #bcbcbc 77.5%,
    #bcbcbc 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: #cecece;
  text-transform: uppercase;
  line-height: 1rem;
  font-family: 'webfontexl', 'Palatino Linotype', 'Times', serif;
  font-size: 85px;
  font-weight: normal;
  // filter: sepia(1) saturate(5) hue-rotate(-25deg);
  // sepia(1) saturate(5) hue-rotate(-25deg) grayscale(1) drop-shadow(0px 0px 10px #000) invert(1)
  filter: drop-shadow(0 0 5px rgba(0, 0, 0, 1));
`;

const HeadingPlain = styled.div`
  color: #cecece;
  text-transform: uppercase;
  line-height: 1rem;
  font-family: 'webfontexl', 'Palatino Linotype', 'Times', serif;
  font-size: 85px;
  font-weight: normal;
  // filter: sepia(1) saturate(5) hue-rotate(-25deg);
  // sepia(1) saturate(5) hue-rotate(-25deg) grayscale(1) drop-shadow(0px 0px 10px #000) invert(1)
  filter: drop-shadow(0 0 5px rgba(0, 0, 0, 1));
`;

const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;

  & > div {
    grid-column: span 6;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 6;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 6;
    }
  }
`;

const Text = styled.div``;

const HighlightLink = styled.a`
  color: #7576df;
`;

const StyledCard = styled(Card)`
  background: rgba(0, 0, 0, 0.8);
  z-index: 2;
`;

const LogoImg = styled.img`
  max-width: 200px;
`;

const HightlightText = styled.span`
  color: #7576df;
`;

const LearnMore = styled.div`
  text-align: center;
  display: block;

  color: #7576df;
  user-select: none;

  &:hover {
    cursor: url('/images/cursor3.png'), pointer;
  }
`;

const Rules = () => {
  const { t } = useTranslation();
  const [showVision, setShowVision] = useState(false);
  const [onPresentPurchaseModal] = useModal(<PurchaseModal onSuccess={() => {}} />);

  return (
    <Page>
      <Container>
        <Cards>
          <StyledCard>
            <CardBody>
              <Heading size="lg" mb="24px">
                Newsletter
              </Heading>
              <Heading size="xl" mb="24px">
                Subscribe
              </Heading>
              <Newsletter />
            </CardBody>
          </StyledCard>
          <div style={{ width: '200%', marginLeft: '-50%' }}>
            <Flex flexDirection="column" alignItems="center" justifyContent="center">
              <LogoImg src="/images/arken-256x256.png" />
              <Heading as="h1" size="xxl" color="secondary" mb="8px">
                <HeadingPlain>ARKEN REALMS</HeadingPlain>
              </Heading>
              <Heading
                as="h2"
                size="lg"
                mb="8px"
                style={{ textAlign: 'center', filter: 'drop-shadow(2px 4px 6px black)' }}>
                {t('The First NFT Hyperfarm')}
              </Heading>
              <Img src="/images/chars.png" />
              <br />
              <br />
              <Button
                as={RouterLink}
                to="/raid"
                style={{ zoom: 1.5, padding: '6px 20px', textAlign: 'center' }}
                onClick={() => {
                  window.scrollTo(0, 0);
                }}>
                {t('Open App')}
                <OpenNewIcon color="white" ml="4px" />
              </Button>
              <br />
              <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
                <Button
                  as={RouterLink}
                  to="/profile"
                  style={{ zoom: 1, padding: '6px 20px', textAlign: 'center', background: '#222' }}
                  onClick={() => {
                    window.scrollTo(0, 0);
                  }}>
                  {t('Create Account')}
                </Button>
                <Button
                  as={RouterLink}
                  to="/guide"
                  style={{ zoom: 1, padding: '6px 20px', textAlign: 'center', background: '#222', marginLeft: 10 }}
                  onClick={() => {
                    window.scrollTo(0, 0);
                  }}>
                  {t('Starter Guide')}
                </Button>
                {i18n.language === 'cn' ? (
                  <Button
                    as={Link}
                    href="https://rune-1.gitbook.io/rune-cn/"
                    target="_blank"
                    style={{ zoom: 1, padding: '6px 20px', textAlign: 'center', background: '#222', marginLeft: 10 }}>
                    {t('查看说明文档')}
                  </Button>
                ) : null}
              </Flex>
              {/* <br />
                <Button variant="text" onClick={onPresentPurchaseModal}>
                  {t('Purchase Runes')}
                </Button> */}
            </Flex>
          </div>
        </Cards>
      </Container>
    </Page>
  );
};

export default Rules;
