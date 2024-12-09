// Layout.tsx

import React, { useEffect, useState } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import styled, { createGlobalStyle, css } from 'styled-components';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import type { ProSettings } from '@ant-design/pro-components';
import { Link as RouterLink } from 'react-router-dom';
import { PageContainer, ProLayout, SettingDrawer } from '@ant-design/pro-components';
import useBrand from '~/hooks/useBrand';
import { useAuth } from '~/hooks/useAuth';
import Avatar from '~/components/Avatar';
import UserBlock from '~/components/Menu/components/UserBlock';
import useMatchBreakpoints from '~/hooks/useMatchBreakpoints';
import * as Icons from '~/components/Menu/icons';
import {
  CaretDownFilled,
  DoubleRightOutlined,
  GithubFilled,
  InfoCircleFilled,
  LogoutOutlined,
  PlusCircleFilled,
  QuestionCircleFilled,
  SearchOutlined,
} from '@ant-design/icons';
import { ProCard, ProConfigProvider } from '@ant-design/pro-components';
import { Button, ConfigProvider, Divider, Dropdown, Input, Popover, Select, theme } from 'antd';
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
    .ant-pro-global-header-header-actions-item >*:hover {
    background: none !important;
    }
}
`;

interface MenuEntry {
  label: string;
  icon?: string;
  href?: string;
  isCryptoMode?: boolean;
  isExpertMode?: boolean;
  isAuthed?: boolean;
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

function convertMenuEntriesToRoutes(
  entries: MenuEntry[],
  isAuthed: boolean,
  isCryptoMode: boolean,
  isExpertMode: boolean
): Route[] {
  return entries.map((entry) => {
    if (entry.isAuthed && !isAuthed) return undefined;
    if (entry.isCryptoMode && !isCryptoMode) return undefined;
    if (entry.isExpertMode && !isExpertMode) return undefined;
    const Icon = entry.icon ? Icons[entry.icon] : undefined;
    const IconElement = Icon ? <Icon width="24px" mr="8px" /> : undefined;
    const route: Route = {
      path: entry.href || '',
      name: entry.label,
      icon: IconElement,
    };
    if (entry.items && entry.items.length > 0) {
      route.routes = convertMenuEntriesToRoutes(entry.items, isAuthed, isCryptoMode, isExpertMode);
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
function Header({ pageState, isOpened }) {
  const settings = useSettings();

  const { isMd, isLg, isXl, isXxl, isXxxl } = useMatchBreakpoints();
  const isMobile = !isMd && !isLg && !isXl && !isXxl && !isXxxl;
  return (
    <Flex justifyContent="space-between" alignItems="center" ml="10px">
      {!isMobile && settings?.isCrypto && pageState
        ? pageState
            .filter((r) => !!r.showable)
            .filter((r) => !!r.navPosition || r.props.open)
            .sort((a, b) => (a.navPosition || 1) - (b.navPosition || 1))
            .reverse()
            .slice(0, 10)
            .map((r) => {
              return (
                <NavItem key={r.path} to={r.path}>
                  {r.props.title}
                </NavItem>
              );
            })
        : null}
    </Flex>
  );
}

const Item: React.FC<{ children: React.ReactNode }> = (props) => {
  const { token } = theme.useToken();
  return (
    <div
      css={css`
        color: ${token.colorTextSecondary};
        font-size: 14px;
        cursor: pointer;
        line-height: 22px;
        margin-bottom: 8px;
        &:hover {
          color: ${token.colorPrimary};
        }
      `}
      style={{
        width: '33.33%',
      }}>
      {props.children}
      <DoubleRightOutlined
        style={{
          marginInlineStart: 4,
        }}
      />
    </div>
  );
};

const List: React.FC<{ title: string; style?: React.CSSProperties }> = (props) => {
  const { token } = theme.useToken();

  return (
    <div
      style={{
        width: '100%',
        ...props.style,
      }}>
      <div
        style={{
          fontSize: 16,
          color: token.colorTextHeading,
          lineHeight: '24px',
          fontWeight: 500,
          marginBlockEnd: 16,
        }}>
        {props.title}
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
        }}>
        {new Array(6).fill(1).map((_, index) => {
          return <Item key={index}>具体的解决方案-{index}</Item>;
        })}
      </div>
    </div>
  );
};
const MenuCard = () => {
  const { token } = theme.useToken();
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
      }}>
      <Divider
        style={{
          height: '1.5em',
        }}
        type="vertical"
      />
      <Popover
        placement="bottom"
        overlayStyle={{
          width: 'calc(100vw - 24px)',
          padding: '24px',
          paddingTop: 8,
          height: '307px',
          borderRadius: '0 0 6px 6px',
        }}
        content={
          <div style={{ display: 'flex', padding: '32px 40px' }}>
            <div style={{ flex: 1 }}>
              <List title="金融解决方案" />
              <List
                title="其他解决方案"
                style={{
                  marginBlockStart: 32,
                }}
              />
            </div>

            <div
              style={{
                width: '308px',
                borderInlineStart: '1px solid ' + token.colorBorder,
                paddingInlineStart: 16,
              }}>
              <div
                css={css`
                  font-size: 14px;
                  color: ${token.colorText};
                  line-height: 22px;
                `}>
                热门产品
              </div>
              {new Array(3).fill(1).map((name, index) => {
                return (
                  <div
                    key={index}
                    css={css`
                      border-radius: 4px;
                      padding: 16px;
                      margin-top: 4px;
                      display: flex;
                      cursor: pointer;
                      &:hover {
                        background-color: ${token.colorBgTextHover};
                      }
                    `}>
                    <img src="https://gw.alipayobjects.com/zos/antfincdn/6FTGmLLmN/bianzu%25252013.svg" />
                    <div
                      style={{
                        marginInlineStart: 14,
                      }}>
                      <div
                        css={css`
                          font-size: 14px;
                          color: ${token.colorText};
                          line-height: 22px;
                        `}>
                        Ant Design
                      </div>
                      <div
                        css={css`
                          font-size: 12px;
                          color: ${token.colorTextSecondary};
                          line-height: 20px;
                        `}>
                        杭州市较知名的 UI 设计语言
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        }>
        <div
          style={{
            color: token.colorTextHeading,
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            gap: 4,
            paddingInlineStart: 8,
            paddingInlineEnd: 12,
            alignItems: 'center',
          }}
          css={css`
            &:hover {
              background-color: ${token.colorBgTextHover};
            }
          `}>
          <span> 企业级资产中心</span>
          <CaretDownFilled />
        </div>
      </Popover>
    </div>
  );
};

const SearchInput = () => {
  const { token } = theme.useToken();
  return (
    <div
      key="SearchOutlined"
      aria-hidden
      style={{
        display: 'flex',
        alignItems: 'center',
        marginInlineEnd: 24,
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}>
      <Input
        style={{
          borderRadius: 4,
          marginInlineEnd: 12,
          backgroundColor: token.colorBgTextHover,
        }}
        prefix={
          <SearchOutlined
            style={{
              color: token.colorTextLightSolid,
            }}
          />
        }
        placeholder="Find..."
        variant="borderless"
      />
      {/* <PlusCircleFilled
        style={{
          color: token.colorPrimary,
          fontSize: 24,
        }}
      /> */}
    </div>
  );
};

export default ({ children, pageState }) => {
  const auth = useAuth();
  const [settings, setSetting] = useState<Partial<ProSettings> | undefined>({
    fixSiderbar: true,
    fixedHeader: true,
    layout: 'mix',
    navTheme: 'light',
    contentWidth: 'Fluid',
    colorPrimary: '#000',
    splitMenus: true,
  });

  const history = useNavigate();
  const location = useLocation();

  const menuConfig = menus.arken; // Choose the desired menu configuration
  const routes = convertMenuEntriesToRoutes(menuConfig, !!auth?.profile, auth?.isCryptoMode, auth?.isExpertMode);
  const route = {
    path: '/',
    routes,
  };
  const [collapsed, setCollapsed] = useState(true);

  const { brand } = useBrand();
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
    arken: 'REALMS',
    return: '',
  };

  const headingText = brandHeading[brand] || brandHeading.rune;
  const subheadingText = brandSubheading[brand] || brandSubheading.rune;
  console.log(289398289, auth?.profile?.mode);
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
        fixSiderbar
        splitMenus
        layout="mix"
        // bgLayoutImgList={[
        //   {
        //     src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
        //     left: 85,
        //     bottom: 100,
        //     height: '303px',
        //   },
        //   {
        //     src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
        //     bottom: -68,
        //     right: -45,
        //     height: '303px',
        //   },
        //   {
        //     src: 'https://img.alicdn.com/imgextra/i3/O1CN018NxReL1shX85Yz6Cx_!!6000000005798-2-tps-884-496.png',
        //     bottom: 0,
        //     left: 0,
        //     width: '331px',
        //   },
        // ]}
        token={{
          header: {
            colorBgMenuItemSelected: 'rgba(0,0,0,0.04)',
          },
        }}
        menu={{
          collapsedShowGroupTitle: true,
          defaultOpenAll: false,
          // request: async () => {
          //   // await waitTime(2000);
          //   return routes;
          // },
        }}
        avatarProps={
          auth?.profile?.name
            ? {
                src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
                size: 'small',
                title: auth.profile.name,
                render: (props, dom) => {
                  return (
                    <Dropdown
                      menu={{
                        items: [
                          {
                            key: 'logout',
                            icon: <LogoutOutlined />,
                            label: 'Sign Out',
                          },
                        ],
                      }}
                      onOpenChange={() => history('/account')}>
                      {dom}
                    </Dropdown>
                  );
                },
              }
            : undefined
        }
        // collapsed={collapsed}
        actionsRender={(props) => {
          if (props.isMobile) return [];
          if (typeof window === 'undefined') return [];
          return [
            props.layout !== 'side' && document.body.clientWidth > 1400 ? <SearchInput /> : undefined,
            // <InfoCircleFilled key="InfoCircleFilled" />,
            // <QuestionCircleFilled key="QuestionCircleFilled" />,
            <a href="https://github.arken.gg">
              <GithubFilled key="GithubFilled" />
            </a>,
            <UserBlock login={() => {}} logout={() => {}} />,
          ];
        }}
        headerTitleRender={(logo, title, _) => {
          const defaultDom = (
            <Logo
              isPushed={!!settings.fixSiderbar}
              isMobile={false}
              isDark={true as any}
              togglePush={() => {
                // setCollapsed(!collapsed);
                // setSetting({ ...settings, fixSiderbar: !settings.fixSiderbar });
              }}
              href={'/'}
              imageUrl={`/images/${brand}-256x256.png`}
              heading={
                <>
                  <span style={{ fontSize: 29 }}>{headingText.slice(0, 1)}</span>
                  {headingText.slice(1)}
                </>
              }
              subheading={subheadingText}
            />
          );
          if (typeof window === 'undefined') return defaultDom;
          if (document.body.clientWidth < 800) {
            return defaultDom;
          }
          if (_.isMobile) return defaultDom;
          return (
            <>
              {defaultDom}
              {/* <Header pageState={pageState} isOpened={!!settings.fixSiderbar} /> */}
              {/* <MenuCard /> */}
            </>
          );
        }}
        menuFooterRender={(props) => {
          if (props?.collapsed) return undefined;
          return (
            <div
              style={{
                textAlign: 'center',
                paddingBlockStart: 12,
              }}>
              <div>
                <Select
                  prefix="Experience: "
                  placeholder="Choose"
                  value={auth?.profile?.mode || 'Gamer'}
                  onChange={(value: string) => auth.setProfileMode(value)}
                  options={[
                    { value: 'gamer', label: 'Gamer' },
                    { value: 'crypto', label: 'Crypto' },
                    { value: 'arken', label: 'Arkenian' },
                  ]}
                />
              </div>
            </div>
          );
        }}
        // headerRender={() => (
        //   <Header
        //     pageState={pageState}
        //     isOpened={!!settings.fixSiderbar}
        //     onClickLogo={() => setSetting({ ...settings, fixSiderbar: !settings.fixSiderbar })}
        //   />
        // )}
        // postMenuData={(menuData) => {
        //   return [
        //     {
        //       icon: collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />,
        //       name: ' ',
        //       onTitleClick: () => setCollapsed(!collapsed),
        //     },
        //     ...(menuData || []),
        //   ];
        // }}
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
        {...settings}>
        {children}
        <GlobalStyles />
        {/* <PageContainer
          extra={[
            <Button key="3">操作</Button>,
            <Button key="2">操作</Button>,
            <Button key="1" type="primary" onClick={() => {}}>
              主操作
            </Button>,
          ]}
          subTitle="简单的描述"
          footer={[
            <Button key="3">重置</Button>,
            <Button key="2" type="primary">
              提交
            </Button>,
          ]}>
          <ProCard
            style={{
              height: '200vh',
              minHeight: 800,
            }}>
            <div />
          </ProCard>
        </PageContainer> */}
      </ProLayout>
      {/* <SettingDrawer
        pathname={location.pathname}
        getContainer={() => document.getElementById('main-layout')}
        settings={settings}
        onSettingChange={(changeSetting) => {
          console.log(changeSetting);
          setSetting(changeSetting);
        }}
        disableUrlParams
      /> */}
    </div>
  );
};
