// Layout.tsx

import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle, css } from 'styled-components';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import type { ProSettings } from '@ant-design/pro-components';
import { Link as RouterLink } from 'react-router-dom';
import { PageContainer, ProLayout, SettingDrawer } from '@ant-design/pro-components';
import useBrand from '~/hooks/useBrand';
import useAuth from '~/hooks/useAuth';
import Avatar from '~/components/Avatar';
import useMatchBreakpoints from '~/hooks/useMatchBreakpoints';
import * as Icons from '~/components/Menu/icons';
import useSettings from '~/hooks/useSettings2';
import {
  HomeOutlined,
  GlobalOutlined,
  RedoOutlined,
  SyncOutlined,
  BankOutlined,
  SwapOutlined,
  ToolOutlined,
  UserOutlined,
  EllipsisOutlined,
  TeamOutlined,
  DatabaseOutlined,
  SunOutlined,
  MoonOutlined,
} from '@ant-design/icons';
import Flex from '~/components/Box/Flex';
import Logo from '~/components/Menu/components/Logo';

import menus from '../config/menu';

const zzz = styled.div``;

const GlobalStyles = createGlobalStyle`
  #main-layout {
    .ant-pro-layout .ant-pro-sider.ant-pro-sider-fixed {
      z-index: 999999;
    }
    .ant-layout-header{
      z-index: 999999;

    background: #11111e;
    border: 1px solid #191929;
    box-shadow: 1px 1px #000;
    }

    .ant-pro-sider-collapsed-button {
    inset-block-start: 9px;
    }
    .ant-layout-sider-children {
    padding: 0;
    }
}
`;

interface MenuEntry {
  label: string;
  icon?: string;
  href?: string;
  initialOpenState?: boolean;
  items?: MenuEntry[];
}

interface Route {
  path: string;
  name: string;
  icon?: React.ReactNode;
  routes?: Route[];
}

// const iconMap = {
//   HomeIcon: <HomeOutlined />,
//   MetaverseIcon: <GlobalOutlined />,
//   EvolutionIcon: <RedoOutlined />,
//   InfiniteIcon: <SyncOutlined />,
//   SanctuaryIcon: <BankOutlined />,
//   TradeIcon: <SwapOutlined />,
//   CraftIcon: <ToolOutlined />,
//   AccountIcon: <UserOutlined />,
//   MoreIcon: <EllipsisOutlined />,
//   CompanyIcon: <BankOutlined />,
//   TicketIcon: <UserOutlined />,
//   GroupsIcon: <TeamOutlined />,
//   PoolIcon: <DatabaseOutlined />,
//   SunIcon: <SunOutlined />,
//   MoonIcon: <MoonOutlined />,
// };

function convertMenuEntriesToRoutes(entries: MenuEntry[]): Route[] {
  return entries.map((entry) => {
    console.log(33332232, Icons);
    const Icon = entry.icon ? Icons[entry.icon] : undefined;
    const IconElement = Icon ? <Icon width="24px" mr="8px" /> : undefined;
    const route: Route = {
      path: entry.href || '',
      name: entry.label,
      icon: IconElement,
    };
    if (entry.items && entry.items.length > 0) {
      route.routes = convertMenuEntriesToRoutes(entry.items);
    }
    return route;
  });
}

const Nav = styled.div`
  width: calc(100% - 300px);
  padding: 0px 5px 0px 20px;
  line-height: 40px;
  color: #fff;
  // margin: -20px 0;
  overflow-x: auto;
  overflow-y: hidden;

  span {
    padding-top: 3px;
    display: inline-block;
  }

  button {
    display: inline-flex;
    align-items: center;
    color: #fff;
  }
`;

const NavItem = styled(RouterLink)<{ isFocused?: boolean }>`
  font-size: 1rem;
  border: 1px solid #06060c;
  border-radius: 6px;
  background: #1c1b2e;
  margin: 10px 3px 5px;
  padding: 0 7px;
  color: #bb955e;
  line-height: 30px;
  text-shadow:
    0 0 5px rgba(0, 0, 0, 0.5),
    00 0 5px rgba(0, 0, 0, 0.5),
    0 0 5px rgba(0, 0, 0, 0.5),
    0 0 10px rgba(0, 0, 0, 0.5);

  ${({ isFocused }) =>
    isFocused
      ? `
    font-weight: bold;
    text-shadow: 0 0 5px #000, 0 0 5px #000, 0 0 5px #000, 0 0 10px #000, 0 0 10px #000, 0 0 10px #000, 0 0 15px #000000,
      0 0 15px #000000, 0 0 15px #000000, 0 0 20px #000000, 0 0 20px #000000, 0 0 20px #000000;
  `
      : ''}

  &:last-child {
    // border-right: 2px solid #030303;
    // border-right: none;
  }

  &:hover {
    color: #bb955e;
    filter: brightness(1.4);
  }
`;

const StyledNav = styled.div<{ showMenu: boolean }>``;
function Header({ pageState, onClickLogo, isOpened }) {
  const { brand } = useBrand();
  const profile = useAuth();
  const settings = useSettings();

  const brandHeading = {
    rune: 'ARKEN',
    arken: 'ARKEN',
    return: 'RETURN.GG',
  };

  const brandSubheading = {
    rune: 'REALMS',
    raids: 'RUNIC RAIDS',
    evolution: 'EVOLUTION',
    infinite: 'INFINITE ARENA',
    oasis: 'HEART OF THE OASIS',
    guardians: 'GUARDIANS UNLEASHED',
    isles: 'MEME ISLES',
    arken: 'GAME SERVICES',
    return: '',
  };

  const headingText = brandHeading[brand] || brandHeading.rune;
  const subheadingText = brandSubheading[brand] || brandSubheading.rune;

  const { isMd, isLg, isXl, isXxl, isXxxl } = useMatchBreakpoints();
  const isMobile = !isMd && !isLg && !isXl && !isXxl && !isXxxl;
  return (
    <div
      css={css`
        display: flex;
      `}>
      <Logo
        isDark={true as any}
        isPushed={isOpened}
        togglePush={() => {
          // onClickLogo()
        }}
        href={'/'}
        imageUrl={`/images/${brand}-256x256.png`}
        heading={
          <>
            <span style={{ fontSize: 35 }}>{headingText.slice(0, 1)}</span>
            {headingText.slice(1)}
          </>
        }
        subheading={subheadingText}
      />
      <Nav>
        <Flex
          alignItems={['start', null, 'center']}
          justifyContent={['start', null, 'space-between']}
          flexDirection={['column', null, 'row']}
          style={{ marginLeft: 0 }}>
          <Flex justifyContent="space-between" alignItems="center">
            {!isMobile && settings?.isCrypto && pageState
              ? pageState
                  .filter((r) => !!r.showable)
                  .filter((r) => !!r.navPosition || r.props.open)
                  .sort((a, b) => (a.navPosition || 1) - (b.navPosition || 1))
                  .reverse()
                  .map((r) => {
                    return (
                      <NavItem key={r.path} to={r.path}>
                        {r.props.title}
                      </NavItem>
                    );
                  })
              : null}
          </Flex>
        </Flex>
      </Nav>
      <Flex>
        {/* <UserBlock username={profile?.username} account={account} login={login} logout={logout} /> */}
        {profile && <Avatar profile={profile as any} />}
      </Flex>
    </div>
  );
}

export default ({ children, pageState }) => {
  const [settings, setSetting] = useState<Partial<ProSettings> | undefined>({
    fixSiderbar: true,
    fixedHeader: true,
    layout: 'mix',
    navTheme: 'light',
    contentWidth: 'Fluid',
    colorPrimary: '#000',
    splitMenus: false,
  });

  const history = useNavigate();
  const location = useLocation();

  const menuConfig = menus.arken; // Choose the desired menu configuration
  const routes = convertMenuEntriesToRoutes(menuConfig);
  const route = {
    path: '/',
    routes,
  };

  return (
    <div
      id="main-layout"
      style={{
        height: '100vh',
      }}
      css={css`
        background: none;
        .ant-pro-layout-bg-list {
          display: none !important;
        }
        .ant-pro-layout-content {
          padding: 0 !important;
        }
        .ant-pro-base-menu-inline-item-title {
          color: #bb955e;
        }
        .ant-pro-base-menu-vertical-item-title-collapsed .ant-pro-base-menu-vertical-item-icon {
          height: 24px;
          width: 24px;
          line-height: 24px !important;
        }
      `}>
      <ProLayout
        route={route}
        location={location}
        headerRender={() => (
          <Header
            pageState={pageState}
            isOpened={!!settings.fixSiderbar}
            onClickLogo={() => setSetting({ ...settings, fixSiderbar: !settings.fixSiderbar })}
          />
        )}
        menuItemRender={(item, dom) => (
          <a
            onClick={() => {
              if (item.path) {
                history(item.path);
              }
            }}>
            {dom}
          </a>
        )}
        avatarProps={{
          icon: <UserOutlined />,
        }}
        {...settings}>
        {children}
        <GlobalStyles />
      </ProLayout>
      <SettingDrawer
        pathname={location.pathname}
        getContainer={() => document.getElementById('main-layout')}
        settings={settings}
        onSettingChange={(changeSetting) => {
          console.log(changeSetting);
          setSetting(changeSetting);
        }}
        disableUrlParams
      />
    </div>
  );
};
