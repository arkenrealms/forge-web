import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { getUsername } from '~/state/profiles/getProfile';
import { Link as RouterLink, NavLink, useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Card,
  Button,
  CardBody,
  CheckmarkCircleIcon,
  Flex,
  Heading,
  Link,
  Tag,
  Text,
  PrizeIcon,
  OpenNewIcon,
  BlockIcon,
  Skeleton,
} from '~/ui';
import { useTranslation } from 'react-i18next';
import { useToast, useProfile, useFetchProfile } from '~/state/hooks';
import useInventory from '~/hooks/useInventory';
import Page from '~/components/layout/Page';
import TipCard from '~/components/TipCard';
import useCache from '~/hooks/useCache';
import useWeb3 from '~/hooks/useWeb3';
import { getUserAddressByUsername } from '~/state/profiles/getProfile';
import { ConnectNetwork } from '~/components/ConnectNetwork';
import Menu from '~/components/account/Menu';
import Header from '~/components/account/Header';
import WalletNotConnected from '~/components/account/WalletNotConnected';
import Inventory from '~/components/account/Inventory';
import ProfileCreation from './ProfileCreation';

const Grid = styled.div`
  display: grid;
  grid-gap: 16px;
  grid-template-columns: 1fr;

  // ${({ theme }) => theme.mediaQueries.sm} {
  //   grid-template-columns: repeat(2, 1fr);
  // }
`;

const Content = styled.div`
  flex: 1;
  padding: 16px 0;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 0 16px;
  }
`;

const Username = styled(Heading)`
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 8px;

  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 40px;
    line-height: 44px;
  }
`;

const Status = styled.div`
  position: absolute;
  right: 24px;
  top: 24px;
`;

const ResponsiveText = styled(Text)`
  font-size: 12px;

  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 16px;
  }
`;

const AddressLink = styled(Link)`
  display: inline-block;
  font-weight: 400;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 80px;
  white-space: nowrap;

  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 16px;
    width: auto;
  }
`;

const Section = styled.div`
  margin-bottom: 40px;
`;

const EquipmentContainer = styled.div`
  width: 100%;
  margin: -100px 0;
  text-align: left;

  & > br + br + div {
    zoom: 0.7;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 558px;

    & > br + br + div {
      zoom: 1;
    }
  }
`;

const PublicProfile = ({ match }) => {
  const { id }: { id: string } = match.params;
  const { address: _account, library } = useWeb3();
  const [account, setAccount] = useState(null);
  const { t } = useTranslation();
  const cache = useCache();
  const { profile, hasProfile } = useProfile(account);
  const { refreshRunes, refreshEquipment } = useInventory();
  const [username, setUsername] = useState(null);
  useFetchProfile(account);

  useEffect(() => {
    async function init() {
      const acc = id || _account;

      if (!acc) return;

      if (acc.indexOf('0x') === 0) {
        setAccount(acc);
      } else {
        setAccount(await getUserAddressByUsername(acc));
      }
    }

    init();
  }, [id, _account]);

  useEffect(
    function () {
      if (id) {
        // TODO: Figure out how to cancel previous fetch, or something
        // refreshRunes()
        // refreshEquipment()
      }
    },
    [id, refreshRunes, refreshEquipment]
  );

  useEffect(
    function () {
      if (!account) return;

      async function init() {
        const acc = id || account;

        try {
          if (acc.indexOf('0x') === 0) {
            const res = await getUsername(account);
            // @ts-ignore
            if (res) {
              setUsername(res);
            }
          } else {
            setUsername(acc);
          }
        } catch (e) {
          console.log(e);
        }
      }

      init();
    },
    [id, account, setUsername]
  );

  // if (!isInitialized || isLoading) {
  //   return <PageLoader />
  // }

  // if (!account) {
  //   return <Page><WalletNotConnected /></Page>
  // }

  if (account && !hasProfile) {
    return (
      <Page>
        <ProfileCreation />
      </Page>
    );
  }

  return (
    <Page>
      <ConnectNetwork />
      <TipCard id="inventory-welcome" npc="liviu">
        <p>Hey there, Raider!</p>
        <br />
        <p>
          Once you have your glorious Arken items crafted, you can equip them, trade them and more from here. If you
          have any trouble loading, give it a minute or try refreshing the page. If you have no items yet, get going and{' '}
          <RouterLink to="/craft" style={{ borderBottom: '1px solid #fff' }}>
            find a Runeform to craft
          </RouterLink>
          !
        </p>
        <br />
        <br />
      </TipCard>
      <br />
      {account ? (
        <>
          <Header address={account}>
            <Menu params={match.params} activeIndex={1} />
          </Header>
          <br />
          <div>
            <Inventory address={account} />
            {profile && username && (
              <Flex flexDirection="column" alignItems="center" justifyContent="center" mt="20px">
                <Button as={NavLink} to={`/user/${username}`} mt="10px">
                  {t('View Public Profile')}
                </Button>
              </Flex>
            )}
          </div>
        </>
      ) : (
        <Card>
          <CardBody>
            <WalletNotConnected />
          </CardBody>
        </Card>
      )}
    </Page>
  );
};

export default PublicProfile;
