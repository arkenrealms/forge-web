import React, { useEffect, useState } from 'react';
import { EllipsisOutlined } from '@ant-design/icons';
import type { TourProps } from 'antd';
import styled, { createGlobalStyle, css } from 'styled-components';
import { Layout, Spin, Button, Modal, Divider, Space, Tour, Tabs } from 'antd';
import _ from 'lodash';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { QuestionCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';
import { useAuth } from '@arken/forge-ui/hooks/useAuth';
import Header from './Header';
import Footer from './Footer';
import { Collapse, Col, Row } from 'antd';
import { LikeOutlined, UserOutlined } from '@ant-design/icons';
import type { ProSettings } from '@ant-design/pro-components';
import { PageContainer, ProLayout, SettingDrawer } from '@ant-design/pro-components';
import { Descriptions, Result, Statistic } from 'antd';
import { ChromeFilled, CrownFilled, SmileFilled, TabletFilled } from '@ant-design/icons';

const defaultProps = {
  route: {
    path: '/',
    routes: [
      {
        path: '/welcome',
        name: 'Welcome',
        icon: <SmileFilled />,
        component: './Welcome',
      },
      {
        path: '/admin',
        name: 'Admin Page',
        icon: <CrownFilled />,
        access: 'canAdmin',
        component: './Admin',
        routes: [
          {
            path: '/admin/sub-page1',
            name: 'Primary Page',
            icon: 'https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg',
            component: './Welcome',
          },
          {
            path: '/admin/sub-page2',
            name: 'Secondary Page',
            icon: <CrownFilled />,
            component: './Welcome',
          },
          {
            path: '/admin/sub-page3',
            name: 'Tertiary Page',
            icon: <CrownFilled />,
            component: './Welcome',
          },
        ],
      },
      {
        name: 'List Page',
        icon: <TabletFilled />,
        path: '/list',
        component: './ListTableList',
        routes: [
          {
            path: '/list/sub-page',
            name: 'List Subpage',
            icon: <CrownFilled />,
            routes: [
              {
                path: 'sub-sub-page1',
                name: 'First Primary List Page',
                icon: <CrownFilled />,
                component: './Welcome',
              },
              {
                path: 'sub-sub-page2',
                name: 'First Secondary List Page',
                icon: <CrownFilled />,
                component: './Welcome',
              },
              {
                path: 'sub-sub-page3',
                name: 'First Tertiary List Page',
                icon: <CrownFilled />,
                component: './Welcome',
              },
            ],
          },
          {
            path: '/list/sub-page2',
            name: 'Second List Page',
            icon: <CrownFilled />,
            component: './Welcome',
          },
          {
            path: '/list/sub-page3',
            name: 'Third List Page',
            icon: <CrownFilled />,
            component: './Welcome',
          },
        ],
      },
      {
        path: 'https://ant.design',
        name: 'Ant Design Official Website',
        icon: <ChromeFilled />,
      },
    ],
  },
  location: {
    pathname: '/',
  },
  appList: [
    {
      icon: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
      title: 'Ant Design',
      desc: 'Well-known UI design language in Hangzhou',
      url: 'https://ant.design',
    },
    {
      icon: 'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png',
      title: 'AntV',
      desc: 'New generation data visualization solution by Ant Group',
      url: 'https://antv.vision/',
      target: '_blank',
    },
    {
      icon: 'https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg',
      title: 'Pro Components',
      desc: 'Professional-grade UI component library',
      url: 'https://procomponents.ant.design/',
    },
    {
      icon: 'https://img.alicdn.com/tfs/TB1zomHwxv1gK0jSZFFXXb0sXXa-200-200.png',
      title: 'umi',
      desc: 'Plugin-based enterprise-level front-end application framework.',
      url: 'https://umijs.org/zh-CN/docs',
    },

    {
      icon: 'https://gw.alipayobjects.com/zos/bmw-prod/8a74c1d3-16f3-4719-be63-15e467a68a24/km0cv8vn_w500_h500.png',
      title: 'qiankun',
      desc: "Possibly the most complete micro-frontend solution you've seen 🧐",
      url: 'https://qiankun.umijs.org/',
    },
    {
      icon: 'https://gw.alipayobjects.com/zos/rmsportal/XuVpGqBFxXplzvLjJBZB.svg',
      title: 'Yuque',
      desc: 'Knowledge creation and sharing tool',
      url: 'https://www.yuque.com/',
    },
    {
      icon: 'https://gw.alipayobjects.com/zos/rmsportal/LFooOLwmxGLsltmUjTAP.svg',
      title: 'Kitchen',
      desc: 'Sketch toolset',
      url: 'https://kitchen.alipay.com/',
    },
    {
      icon: 'https://gw.alipayobjects.com/zos/bmw-prod/d3e3eb39-1cd7-4aa5-827c-877deced6b7e/lalxt4g3_w256_h256.png',
      title: 'dumi',
      desc: 'Documentation tool born for component development',
      url: 'https://d.umijs.org/zh-CN',
    },
  ],
};

const zzz = styled.div``;

const GlobalStyles = createGlobalStyle`
`;
const content = (
  <Descriptions size="small" column={2}>
    <Descriptions.Item label="Creator">Zhang San</Descriptions.Item>
    <Descriptions.Item label="Contact Info">
      <a>421421</a>
    </Descriptions.Item>
    <Descriptions.Item label="Creation Date">2017-01-10</Descriptions.Item>
    <Descriptions.Item label="Update Date">2017-10-10</Descriptions.Item>
    <Descriptions.Item label="Remarks">Ancient Cui Road, Xihu District, Hangzhou, Zhejiang, China</Descriptions.Item>
  </Descriptions>
);

export default ({ children }) => {
  const [settings, setSetting] = useState<Partial<ProSettings> | undefined>({
    fixSiderbar: true,
  });
  const [pathname, setPathname] = useState('/welcome');

  const history = useNavigate();
  const location = useLocation();
  const { profile, permissions, login, logout } = useAuth();

  return (
    <div
      id="test-pro-layout"
      style={{
        height: '100vh',
      }}
      css={css`
        background: none;
        overflow: hidden;
        padding-bottom: 3px;
        .ant-layout-sider {
          top: 40px !important;
          height: calc(100% - 40px) !important;
        }
        .ant-pro-layout-bg-list {
          display: none !important;
        }
      `}>
      <ProLayout
        {...defaultProps}
        location={{
          pathname,
        }}
        waterMarkProps={{
          content: 'Pro Layout',
        }}
        menuFooterRender={(props) => {
          return (
            <a
              style={{
                lineHeight: '48rpx',
                display: 'flex',
                height: 48,
                color: 'rgba(255, 255, 255, 0.65)',
                alignItems: 'center',
              }}
              href="https://preview.pro.ant.design/dashboard/analysis"
              target="_blank"
              rel="noreferrer">
              <img
                alt="pro-logo"
                src="https://procomponents.ant.design/favicon.ico"
                style={{
                  width: 16,
                  height: 16,
                  margin: '0 16px',
                  marginInlineEnd: 10,
                }}
              />
              {!props?.collapsed && 'Preview Pro'}
            </a>
          );
        }}
        onMenuHeaderClick={(e) => console.log(e)}
        menuItemRender={(item, dom: any) => (
          <a
            onClick={() => {
              setPathname(item.path || '/welcome');
            }}>
            {dom}
          </a>
        )}
        avatarProps={{
          icon: <UserOutlined />,
        }}
        {...settings}>
        <GlobalStyles />
        {/* <Header profile={profile} permissions={permissions} login={login} logout={logout} /> */}
        {children}
        <Footer />

        {/* <div
          style={{
            height: '120vh',
            minHeight: 600,
          }}>
          <Result
            status="404"
            style={{
              height: '100%',
              background: '#fff',
            }}
            title="Hello World"
            subTitle="Sorry, you are not authorized to access this page."
            extra={<Button type="primary">Back Home</Button>}
          />
        </div> */}
      </ProLayout>
      <SettingDrawer
        pathname={pathname}
        getContainer={() => document.getElementById('test-pro-layout')}
        settings={settings}
        onSettingChange={(changeSetting) => {
          setSetting(changeSetting);
        }}
        disableUrlParams
      />
    </div>
  );
};
