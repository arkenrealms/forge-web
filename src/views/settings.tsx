import React from 'react';
import styled, { css } from 'styled-components';
import { Breadcrumb, Layout, Spin, Menu, Form as AntForm, theme } from 'antd';
import Settings from '~/components/Settings';

const { Header, Content, Footer, Sider } = Layout;

const zzz = styled.div``;

export default ({ themeConfig }: any) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout
      css={css`
        min-height: 100vh;
      `}>
      {/* <Header className="header">
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} items={items1} />
      </Header> */}
      <Content style={{ padding: '50px' }}>
        <div
          style={{
            background: colorBgContainer,
            boxShadow: 'rgba(0, 0, 0, 0.2) 0px 0px 4px',
            borderRadius: '4px',
          }}>
          <Settings />
        </div>
      </Content>
    </Layout>
  );
};
