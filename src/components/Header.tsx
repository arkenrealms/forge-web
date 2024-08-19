import React, { useEffect, useState, FC } from 'react';
import styled, { css } from 'styled-components';
import type { MenuProps } from 'antd';
import useSettings from '@arken/forge-ui/hooks/useSettings';
import useMatchBreakpoints from '@arken/forge-ui/hooks/useMatchBreakpoints';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { getFirstName, getNameInitials } from '@arken/node/util/string';
import { Col, Input, Row, Menu } from 'antd';
import { useSearchModels } from '@arken/forge-ui/hooks';

import Avatar from './Avatar';

// @ts-ignore
import logo from '../assets/logo-dark.png';

const Stat = styled.div`
  background: #e9ebee;
  border-radius: 6px;
  padding: 7px 10px;
  text-align: center;
  display: inline-block;

  height: 100%;
  font-size: 0.6rem;
  line-height: 1rem;
  margin-left: 5px;
  font-family: 'Open Sans', sans-serif;

  &:first-child {
    margin-left: 0;
  }

  &:hover {
    cursor: pointer;
    background: #ddd;
  }

  span {
    font-size: 1rem;
    font-weight: bold;
    color: #888;
    display: block;
    margin-bottom: 3px;
  }
`;
interface IAdminHeader {
  user?: any;
  permissions?: any;
  logout: () => void;
  login: () => void;
}

const oneWeekAgo = new Date();
oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

const AdminHeader: FC<IAdminHeader> = ({ user = {}, permissions = {}, login, logout }) => {
  const history = useNavigate();
  const { isMobile } = useMatchBreakpoints();
  const { settings } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';

  const [current, setCurrent] = useState(window.location.pathname.split('?')[0].replace('/', ''));

  const { data: contentListSearch }: any = useSearchModels({
    key: 'Stat',
    action: 'stats',
    query: `
      id
      number
      createdDate
      meta
    `,
    variables: {
      where: {
        createdDate: { gte: oneWeekAgo },
      },
      orderBy: {
        number: 'desc',
      },
    },
  });

  const todayStat = contentListSearch?.[0];

  const onClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'formDrafts') {
      history(`/interfaces?status%5B0%5D=Draft`);
    } else if (e.key === 'formManagement') {
      history(`/interfaces`);
    } else if (e.key === 'formPublished') {
      history(`/interfaces?status%5B0%5D=Published`);
    } else if (e.key === 'formSubmissions') {
      history(`/submissions`);
    } else {
      history(`/${e.key}`);
    }
  };

  const menuItems: MenuProps['items'] = [];
  // console.log('dfdfdf', permissions)
  if (permissions['View Interfaces']) {
    menuItems.push({
      label: 'Interfaces',
      key: 'interface-management',
      // icon: <FileSearchOutlined />,
      // disabled: true,
      children: [
        {
          label: 'Manage Interfaces',
          key: 'forms',
        },
        {
          label: 'Manage Interface Groups',
          key: 'groups',
        },
        // {
        //   type: 'group',
        //   label: 'Status',
        //   children: [
        //     {
        //       label: 'Manage Drafts',
        //       key: 'formDrafts',
        //     },
        //     {
        //       label: 'Manage Published',
        //       key: 'formPublished',
        //     },
        //   ],
        // },
        // {
        //   label: 'Manage Submissions',
        //   key: 'submissions',
        // },
        {
          label: 'Manage Interface Templates',
          key: 'templates',
        },
      ],
    });
  }

  if (permissions['Manage Users']) {
    menuItems.push({
      label: 'Users',
      key: 'users-management',
      // icon: <UserAddOutlined />,
      children: [
        {
          label: 'Manage Users',
          key: 'users',
        },
        {
          label: 'Manage Roles',
          key: 'roles',
        },
      ],
    });
  }

  if (permissions['Manage Settings']) {
    menuItems.push({
      label: 'Settings',
      key: 'settings',
      // icon: <SettingOutlined />,
      // children: [
      //   {
      //     label: 'Manage Forms',
      //     key: 'forms',
      //   },
      //   {
      //     label: 'Manage Groups',
      //     key: 'groups',
      //   },
      // ]
    });
  }

  menuItems.push({
    label: 'Game',
    key: 'game',
    // icon: <SettingOutlined />,
    children: [
      {
        label: 'Achievements',
        key: 'game/achievements',
      },
    ],
  });

  menuItems.push({
    label: 'Crypto',
    key: 'crypto',
    // icon: <SettingOutlined />,
    children: [
      {
        label: 'Tokens',
        key: 'crypto/tokens',
      },
    ],
  });

  menuItems.push({
    label: 'Collectible',
    key: 'collectible',
    // icon: <SettingOutlined />,
    children: [
      {
        label: 'Cards',
        key: 'collectible/cards',
      },
    ],
  });

  return (
    <div
      css={css`
        ${settings.DarkMode ? '' : 'background-color: #fff;'}
        z-index: 1;

        .app-admin__header {
          height: 65px;
          padding: 0px 20px 0 10px;
        }
        .app-admin__header-logo {
          margin-top: 5px;
          height: 45px;
          transition: all 0.5s ease;
        }
        .app-admin__header-logo-wrapper {
          // width: 125px;
          padding: 0 10px 0 0;
        }
        .app-admin__subheader {
          padding: 5px 0 0;
          ${settings.DarkMode ? '' : 'background-color: #fff;'}
        }
        .ant-menu-light {
          ${settings.DarkMode ? '' : 'background-color: #fff;'}
          border-bottom: 0 none;
        }
        .ant-menu-vertical {
          border-inline-end: none !important;
        }
        .ant-menu-horizontal {
          line-height: 35px;
        }
      `}>
      <Header showShadow={!isHome} className="app-admin__header" data-testid="app-header">
        <Col
          className="app-admin__header-logo-wrapper"
          css={css`
            cursor: pointer;
          `}>
          <Link
            to=""
            style={{
              color: '#000',
              fontWeight: 700,
              fontSize: '3rem',
              letterSpacing: 2,
            }}>
            <img className="app-admin__header-logo" src={logo} />
          </Link>
        </Col>
        {!isHome ? (
          <Col
            css={css`
              color: #000;
              border-left: 2px solid rgba(0, 0, 0, 0.1);
              height: 47px;
              padding-left: 15px;
              width: 280px;
              cursor: pointer;
            `}
            onClick={() => history('/')}>
            <div
              data-testid="title"
              css={css`
                font-size: 1.1rem;
                line-height: 1.2rem;
                font-weight: bold;
                color: #00598e; /* #09af42; */
                margin-top: 3px;
              `}>
              Forge
            </div>
            <div
              css={css`
                font-size: 0.8rem;
              `}>
              Where Realms Are Formed
              {/* Portal to the ASI Network */}
            </div>
          </Col>
        ) : (
          <Col flex="auto" />
        )}
        {!isHome ? (
          <Col
            // xs={4}<Col flex="auto" />
            // xl={8}
            flex="auto"
            css={css`
              // min-width: 300px;
            `}
            data-testid="app-header-menu">
            {/* {user?.name ? ( */}
            <Menu
              onClick={onClick}
              selectedKeys={[current]}
              mode={isMobile ? 'vertical' : 'horizontal'}
              items={menuItems}
              style={{}}
            />
            {/* ) : null} */}
          </Col>
        ) : null}
        {!isHome ? (
          <Col
            // xs={0}
            // xl={4}
            flex="none"
            css={css`
              color: #000;
              // border-left: 2px solid rgba(0, 0, 0, 0.1);
              height: 47px;
              padding-left: 15px;
              padding-right: 15px;
            `}
            data-testid="app-header-stats">
            {permissions['View Interfaces'] ? (
              <Stat onClick={() => navigate('/interfaces?status%5B0%5D=Draft')}>
                <span style={{ color: '#e29207' }} data-testid="app-header-stat-drafts">
                  {todayStat?.meta.TotalFormDrafted || 0}
                </span>
                Drafts
              </Stat>
            ) : null}
            {permissions['View Interfaces'] ? (
              <Stat onClick={() => navigate('/interfaces?status%5B0%5D=Published')}>
                <span style={{ color: '#03a61a' }} data-testid="app-header-stat-published">
                  {todayStat?.meta.TotalFormPublished || 0}
                </span>
                Published
              </Stat>
            ) : null}
            {/* {permissions['Manage Submissions'] ? (
            <Stat onClick={() => navigate('/submissions')}>
              <span style={{ color: '#008e5e' }}>{todayStat?.meta.TotalFormSubmissions || 0}</span>
              Submissions
            </Stat>
          ) : null} */}
            {permissions['Manage Forms'] ? (
              <Stat onClick={() => navigate('/templates')}>
                <span style={{ color: '#00598e' }} data-testid="app-header-stat-templates">
                  {todayStat?.meta.TotalFormTemplates || 0}
                </span>
                Templates
              </Stat>
            ) : null}
          </Col>
        ) : null}
        {user ? (
          <Col
            xs={0}
            md={4}
            flex="none"
            css={css`
              color: #000;
              font-size: 0.85rem;
              line-height: 1.1rem;
              text-align: right;
            `}>
            <strong data-testid="app-header-user-welcome">Welcome back, {getFirstName(user.name)}</strong>
            {user.roles?.[0] ? (
              <Link to={`/roles?tab=role&Name=${escape(user.roles[0])}`} data-testid="app-header-user-role">
                {' '}
                | {user.roles[0]}
              </Link>
            ) : null}
            <br />
            <span style={{ fontSize: '0.65rem' }} data-testid="app-header-user-email">
              {user.email}
            </span>
          </Col>
        ) : null}
        {user ? (
          <Col
            flex="none"
            data-testid="app-user-menu"
            css={css`
              display: flex;
              flex-direction: column;
            `}>
            <Row justify="end">
              <Col
                flex="none"
                css={css`
                  margin-left: 10px;
                  font-size: 14px;
                `}>
                <Avatar
                  user={{ name: getNameInitials(user.name), picture: user.picture }}
                  login={login}
                  logout={logout}
                  data-testid="app-header-avatar"
                />
              </Col>
            </Row>
          </Col>
        ) : null}
      </Header>
    </div>
  );
};

export default AdminHeader;

const Header = styled<any>(Row)`
  display: flex;
  align-items: center;
  padding: 0px 30px;
  color: rgba(255, 255, 255, 0.85);
  ${({ showShadow }) => (showShadow ? 'box-shadow: 0 0 5px rgba(0, 0, 0, 0.2)' : '')};
`;
