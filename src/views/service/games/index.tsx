import React, { useState } from 'react';
import { css } from 'styled-components';
import { Breadcrumb, Layout, Button, Menu, theme } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Flex, Heading, Text } from '~/ui';
import Page from '~/components/layout/Page';

const { Header, Content, Footer, Sider } = Layout;

export default function () {
  return (
    <Page>
      <Link to="/raid">Raid</Link>
      <br />
      <Link to="/evolution">Evolution</Link>
      <br />
      <Link to="/infinite">Infinite</Link>
      <br />
      <Link to="/sanctuary">Sanctuary</Link>
      <br />
    </Page>
  );
}
