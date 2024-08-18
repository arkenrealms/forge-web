import React from 'react';
import styled from 'styled-components';
import { Heading, Text, BaseLayout } from '~/ui';
import useI18n from '~/hooks/useI18n';
import { useTranslation } from 'react-i18next';
import Page from '~/components/layout/Page';
import FarmStakingCard from '~/components/raid/FarmStakingCard';
// import LotteryCard from '~/views/Dashboard/components/LotteryCard'
import RuneStats from '~/components/raid/RuneStats';
import TotalValueLockedCard from '~/components/raid/TotalValueLockedCard';
import EarnAPYCard from '~/components/raid/EarnAPYCard';
import EarnAssetCard from '~/components/raid/EarnAssetCard';
// import WinCard from '~/views/Dashboard/components/WinCard'

const Hero = styled.div`
  align-items: center;
  background-image: url('/images/pan-bg-mobile.svg');
  background-repeat: no-repeat;
  background-position: top center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: auto;
  margin-bottom: 32px;
  padding-top: 116px;
  text-align: center;

  ${({ theme }) => theme.mediaQueries.lg} {
    background-image: url('/images/pan-bg2.svg'), url('/images/pan-bg.svg');
    background-position: left center, right center;
    height: 165px;
    padding-top: 0;
  }
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
      grid-column: span 8;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 6;
    }
  }
`;

const CTACards = styled(BaseLayout)`
  align-items: start;
  margin-bottom: 32px;

  & > div {
    grid-column: span 6;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 8;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 4;
    }
  }
`;

const Coming: React.FC<any> = () => {
  const { t } = useTranslation();

  return (
    <Page>
      <Hero>
        <Heading as="h1" size="xl" mb="24px" color="secondary">
          {t('Rune')}
        </Heading>
        <Text>{t('')}</Text>
      </Hero>
      <div>
        <Cards>
          <FarmStakingCard />
          {/* <LotteryCard /> */}
        </Cards>
        <CTACards>
          <EarnAPYCard />
          <EarnAssetCard />
          {/* <WinCard /> */}
        </CTACards>
        <Cards>
          <RuneStats />
          <TotalValueLockedCard />
        </Cards>
      </div>
    </Page>
  );
};

export default Coming;
