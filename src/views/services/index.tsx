import { Column, ColumnConfig } from '@ant-design/plots';
import { Card, Col, Image, Row, Typography, Result } from 'antd';
import React, { Component, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CountUp from 'react-countup';
import styled, { css, createGlobalStyle } from 'styled-components';
import { RiSurveyLine } from 'react-icons/ri';
import { SlRefresh } from 'react-icons/sl';
import useSettings from '~/hooks/useSettings';
import useDocumentTitle from '~/hooks/useDocumentTitle';
import { useInterval } from '~/hooks/useInterval';
import { useAuth } from '~/hooks/useAuth';
// import packagejson from '~/package.json';
import { trpc } from '~/utils/trpc';

// @ts-ignore
import DashboardLandingImage from '../assets/dashboard.png';

const zzz = styled.div``;

const GlobalStyles = createGlobalStyle`
body {
  // background: #fff;
}

@-webkit-keyframes rotation {
  from {-webkit-transform: rotate(0deg);}
  to   {-webkit-transform: rotate(359deg);}
}
`;

const { Title, Text } = Typography;

type Status = {
  type: string;
  sales: number;
};

const StatusList: Status[] = [
  {
    type: 'New',
    sales: 5,
  },
  {
    type: 'Open',
    sales: 10,
  },
  {
    type: 'Complete',
    sales: 25,
  },
  {
    type: 'Cancelled',
    sales: 5,
  },
  {
    type: 'Pending',
    sales: 5,
  },
];

const DemoColumn: React.FC<any> = () => {
  const config: ColumnConfig = {
    data: StatusList,
    xField: 'type',
    yField: 'sales',
    label: {
      position: 'middle' as const,
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      type: {
        alias: '',
      },
      sales: {
        alias: '',
      },
    },
  };

  return <Column {...config} />;
};

const query = `
  id
  number
  createdDate
  meta
`;

function getStat(previousStat: any, nextStat: any) {
  const res = {} as any;

  for (const index in previousStat) {
    res[index] = nextStat[index] - previousStat[index];
  }

  return res;
}

const StatusTile = ({ number, color, title, description, isLoading, ...props }: any) => (
  <Row
    css={css`
      margin-bottom: 40px;
    `}
    {...props}>
    <Col
      xs={12}
      css={css`
        font-size: 55px;
        line-height: 45px;
        text-align: right;
        padding-right: 10px;
        font-family "Open Sans", sans-serif;
        text-align: right;
        word-wrap: break-word;
        white-space: pre-wrap;
        font-weight: 300;
        font-style: normal;
        color: ${color};
      `}>
      {/* @ts-ignore */}
      {!isLoading ? <CountUp end={number} start={0} /> : null}
    </Col>
    <Col xs={10}>
      <div
        css={css`
          font-size: 20px;
          margin-bottom: 4px;
          padding: 0;
        `}>
        {title}
      </div>
      <div
        css={css`
          font-size: 14px;
          font-weight: 300;
        `}>
        {description}
      </div>
    </Col>
    <Col
      xs={2}
      css={css`
        width: 100%;
        height: 100%;
        align-self: center;
      `}>
      <svg
        version="1.1"
        baseProfile="tiny"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        focusable="false"
        aria-hidden="true"
        touch-action="pan-x pan-y"
        viewBox="0 0 8 8"
        style={{ width: 8, height: 8 }}>
        <ellipse fill={color} rx="4" ry="4" cx="4" cy="4"></ellipse>
        <ellipse
          data-bind="attr: {
          fill: 'transparent',
          stroke: borderColor,
          'stroke-width': borderThickness,
          'stroke-dasharray': properties.BorderStyle,
          rx: outerShape.rx,
          ry: outerShape.ry,
          cx: outerShape.cx,
          cy: outerShape.cy
        }"
          fill="transparent"
          stroke="rgba(0, 18, 107, 1)"
          stroke-width="0"
          stroke-dasharray="none"
          rx="4"
          ry="4"
          cx="4"
          cy="4"></ellipse>
      </svg>
    </Col>
  </Row>
);

const SpecialButton = ({ icon, title, path, onClick, ...props }: any) => {
  const navigate = useNavigate();
  return (
    <div
      css={css`
        border-radius: 5px;
        overflow: hidden;
        height: 42px;
        width: 220px;
        background-color: rgba(255, 255, 255, 0.2);
        cursor: pointer;
        svg {
          margin: auto;
        }
        &:hover {
          background-color: #035d92;
          span {
            color: #f7f7f7;
          }
        }
      `}
      onClick={() => {
        navigate(path);
        onClick?.();
      }}
      {...props}>
      <div
        css={css`
          display: inline-flex;
          background-color: rgba(0, 0, 0, 0.2);
          width: 50px;
          height: 42px;
          font-size: 22px;
          text-align: center;
          align-items: center;
          vertical-align: middle;
        `}>
        {icon}
      </div>
      <span
        css={css`
          display: inline-block;
          padding: 0 0 0 14px;
          vertical-align: middle;
          color: #fff;
          font-size: 14px;
        `}>
        {title}
      </span>
    </div>
  );
};

const oneWeekAgo = new Date();
oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { profile } = useAuth();
  const [refreshCountdown, setRefreshCountdown] = useState(15);

  const { data: info } = trpc.seer.core.info.useQuery(null, {
    // queryKey: 'metrics',
    enabled: true, // Automatically fetch data on mount
    staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes
    refetchOnWindowFocus: false, // Do not refetch on window focus
  });

  const { mutate: updateMetrics } = trpc.seer.job.updateMetrics.useMutation();

  useEffect(() => {
    console.log('Updating metrics');
    updateMetrics();
  }, [updateMetrics]);

  const {
    data: metrics,
    refetch: refreshStats,
    isLoading: isLoadingStats,
    isFetching: isRefreshingStats,
    error,
  } = trpc.seer.core.stats.useQuery(
    {
      where: {
        createdDate: { gte: oneWeekAgo },
      },
      orderBy: {
        number: 'desc',
      },
    },
    {
      // queryKey: 'metrics',
      enabled: true, // Automatically fetch data on mount
      staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes
      refetchOnWindowFocus: false, // Do not refetch on window focus
    }
  );

  useInterval(function () {
    if (refreshCountdown === 1) {
      refreshStats();
    }

    setRefreshCountdown(refreshCountdown > 0 ? refreshCountdown - 1 : 15);
  }, 1000);

  const todayStat = metrics?.[0];

  useDocumentTitle('Arken');

  return (
    <div
      css={css`
        margin: 50px;
        text-align: center;
      `}>
      <GlobalStyles />
      {settings.DeveloperMode && profile?.permissions['Developer Tools'] ? <div>Dev Tools</div> : null}
      <Row
        justify="space-between"
        css={css`
          text-align: left;
          margin-top: 40px;
        `}>
        <Col
          xs={4}
          md={8}
          css={css`
            padding: 10px 0;
            font-size: 16px;
            font-weight: bold;
          `}
          data-testid="dashboard-stats">
          <Row
            css={css`
              margin-bottom: 30px;
            `}
            onClick={() => refreshStats()}>
            <Col
              xs={12}
              css={css`
                  font-size: 30px;
                  text-align: right;
                  color rgb(128, 128, 128);
                  align-self: center;
                `}>
              <SlRefresh
                css={css`
                  transform: rotate(0deg);

                  animation: rotation 0.5s infinite linear;
                  animation-duration: 0.5s;
                  animation-play-state: ${isLoadingStats ? 'running' : 'paused'};
                  margin-right: 10px;
                `}
              />
            </Col>
            <Col
              xs={12}
              css={css`
                font-size: 16px;
                font-weight: bold;
              `}>
              Application Status
              <br />
              <div
                css={css`
                  color: #8b9a9f;
                  font-size: 12px;
                  font-weight: 300;
                `}>
                Refresh: {refreshCountdown}
              </div>
            </Col>
          </Row>
          <StatusTile
            data-testid="dashboard-stat-drafts"
            number={todayStat?.meta?.TotalInterfaceDrafted || 0}
            title="Draft"
            description="Draft interfaces"
            color="#808080"
            isLoading={isLoadingStats}
          />
          <StatusTile
            data-testid="dashboard-stat-published"
            number={todayStat?.meta?.TotalInterfacePublished || 0}
            title="Published"
            description="Published interfaces"
            color="#005e92"
            isLoading={isLoadingStats}
          />
          {/* <StatusTile
            data-testid="dashboard-stat-finished"
            number={todayStat?.TotalInterfaceFinished || 0}
            title="Finished"
            description="Finished interfaces"
            color="#7fb239"
            isLoading={isLoadingStats}
          /> */}
          {/* <StatusTile
            data-testid="dashboard-stat-paused"
            number={todayStat?.TotalInterfacePaused || 0}
            title="Disabled"
            description="Disabled interfaces"
            color="#333333"
            isLoading={isLoadingStats}
          /> */}
          <StatusTile
            data-testid="dashboard-stat-removed"
            number={todayStat?.meta?.TotalInterfaceArchived || 0}
            title="Removed"
            description="Removed interfaces"
            color="#f65810"
            isLoading={isLoadingStats}
          />
        </Col>
        <Col
          xs={4}
          md={6}
          xl={8}
          css={css`
            margin-top: 30px;
          `}></Col>
        <Col xs={4} md={8} css={css``}>
          <div
            css={css`
              padding: 10px 0;
              font-size: 16px;
              font-weight: bold;
            `}>
            Common Actions
            <br />
            <div
              css={css`
                font-size: 12px;
                font-weight: 300;
              `}>
              &nbsp;
            </div>
          </div>
          <SpecialButton
            data-testid="dashboard-form-designer-button"
            icon={<RiSurveyLine />}
            path="/interfaces"
            title="Interface Designer"
          />
        </Col>
      </Row>
      <Row
        gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
        justify="center"
        css={css`
          margin: 20px;
          text-align: center;
        `}>
        <Col xs={24} md={6} style={{ marginTop: 40 }}>
          <Title level={3}></Title>
          <br />
        </Col>
        <Col xs={24} md={6} style={{ marginTop: 40 }}>
          <Title level={3}></Title>
          <br />
        </Col>
        <Col xs={24} md={6} style={{ marginTop: 40 }}>
          <Title level={3}></Title>
          <br />
        </Col>
      </Row>
      {/* {info ? (
        <div
          css={css`
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            text-align: center;
            padding: 10px;
            height: 65px;
            color: #666;
          `}>
          forge-web@{packagejson.version} ({process.env.BUILD_NUMBER || 'local'})
          <br />
          forge-backend@{info.version} ({info.build})
        </div>
      ) : null} */}
    </div>
  );
}
