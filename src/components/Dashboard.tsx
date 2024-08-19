import { Column, ColumnConfig } from '@ant-design/plots';
import { Card, Col, Image, Row, Typography, Result } from 'antd';
import React, { Component, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CountUp from 'react-countup';
import styled, { css, createGlobalStyle } from 'styled-components';
import { RiSurveyLine } from 'react-icons/ri';
import { SlRefresh } from 'react-icons/sl';
import { useCreateModel, useSearchModels, useGetModel } from '@arken/forge-ui/hooks';
import useSettings from '@arken/forge-ui/hooks/useSettings';
import useDocumentTitle from '@arken/forge-ui/hooks/useDocumentTitle';
import { average } from '@arken/node/util/math';
import debounce from '@arken/node/util/debounce';
import { useInterval } from '@arken/forge-ui/hooks/useInterval';
import echarts from '~/lib/echarts';
import { useAuth } from '@arken/forge-ui/hooks/useAuth';
import packagejson from '../../package.json';
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
  const { user } = useAuth();
  const [refreshCountdown, setRefreshCountdown] = useState(15);
  const [info, setInfo] = useState(undefined);

  const { mutateAsync: createStat }: any = useCreateModel({
    key: 'Stat',
    action: 'createOneStat',
    query,
  });

  useEffect(function () {
    async function run() {
      const res = await (
        await fetch(`${process.env.REACT_APP_SERVICE_URI}/info`, {
          method: 'GET',
        })
      ).json();

      setInfo(res);
    }

    run();
  }, []);

  // TODO: this is a workaround to get a daily metric, remove when we have an azure cronjob
  useGetModel({
    key: 'Jobs',
    action: 'updateMetrics',
    variables: {},
    gql: `
      query Jobs {
        updateMetrics {
          success
        }
      }
    `,
  });

  const {
    data: contentListSearch,
    refetch: refreshStats,
    isLoading: isLoadingStats,
    isFetching: isRefreshingStats,
  }: any = useSearchModels({
    key: 'Stat',
    action: 'stats',
    query,
    variables: {
      where: {
        createdDate: { gte: oneWeekAgo },
      },
      orderBy: {
        number: 'desc',
      },
    },
  });

  useInterval(function () {
    if (refreshCountdown === 1) {
      refreshStats();
    }

    setRefreshCountdown(refreshCountdown > 0 ? refreshCountdown - 1 : 15);
  }, 1000);

  const todayStat = contentListSearch?.[0];

  const colorMap: any = {
    New: '#ff9080',
    Open: '#00bfb7',
    Complete: '#80ffb0',
    Cancelled: '#ff9080',
    Pending: '#eb80ff',
  };

  function OrderChart() {
    const [chart, setChart] = useState(null);
    const chartRef = useRef(null);

    function resize() {
      if (!chartRef?.current) return;
      debounce(chartRef.current.resize, 300)();
    }

    function initChart() {
      if (!chartRef?.current) return;

      const chart2 = echarts.init(chartRef.current, 'macarons');
      setChart(chart2);

      const xData = (function () {
        // const data = []
        // for (let i = 1; i < 13; i++) {
        //   data.push(i + 'month')
        // }
        // return data
        return ['02/2023', '03/2023', '04/2023'];
      })();

      const series = [];

      for (const status of StatusList) {
        series.push({
          name: status.type,
          type: 'bar',
          stack: 'total',
          barMaxWidth: 35,
          barGap: '10%',
          itemStyle: {
            normal: {
              color: colorMap[status.type],
              label: {
                show: true,
                textStyle: {
                  color: '#fff',
                },
                position: 'insideTop',
                formatter(p: any) {
                  return p.Total > 0 ? p.Total : '';
                },
              },
            },
          },
          data: contentListSearch.map((item: any) => item.meta[`Total${status.type}Forms`]),
        });
      }

      const averageData = [];
      for (const item of contentListSearch) {
        averageData.push(average(StatusList.map((status: any) => item.meta[`Total${status.type}Forms`])));
      }

      // average

      series.push({
        name: 'average',
        type: 'line',
        stack: 'total',
        symbolSize: 10,
        symbol: 'circle',
        itemStyle: {
          normal: {
            color: 'rgba(252,230,48,1)',
            barBorderRadius: 0,
            label: {
              show: true,
              position: 'top',
              formatter(p: any) {
                return p.Total > 0 ? p.Total : '';
              },
            },
          },
        },
        data: averageData,
      });

      // {
      //   name: 'male',
      //   type: 'bar',
      //   stack: 'total',
      //   itemStyle: {
      //     normal: {
      //       color: 'rgba(0,191,183,1)',
      //       barBorderRadius: 0,
      //       label: {
      //         show: true,
      //         position: 'top',
      //         formatter(p: any) {
      //           return p.value > 0 ? p.value : ''
      //         },
      //       },
      //     },
      //   },
      //   data: [327, 1776, 507, 1200, 800, 482, 204, 1390, 1001, 951, 381, 220],
      // },

      chart2.setOption({
        backgroundColor: '#fff',
        title: {
          text: 'Orders',
          x: '20',
          top: '20',
          textStyle: {
            color: '#fff',
            fontSize: '22',
          },
          subtextStyle: {
            color: '#90979c',
            fontSize: '16',
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            textStyle: {
              color: '#fff',
            },
          },
        },
        grid: {
          left: '5%',
          right: '5%',
          borderWidth: 0,
          top: 150,
          bottom: 95,
          textStyle: {
            color: '#fff',
          },
        },
        legend: {
          x: '5%',
          top: '10%',
          textStyle: {
            color: '#90979c',
          },
          data: [...StatusList.map((s) => s.type), 'Average'],
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            axisLine: {
              lineStyle: {
                color: '#90979c',
              },
            },
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            splitArea: {
              show: false,
            },
            axisLabel: {
              interval: 0,
            },
            data: xData,
          },
        ],
        yAxis: [
          {
            type: 'value',
            splitLine: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                color: '#90979c',
              },
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              interval: 0,
            },
            splitArea: {
              show: false,
            },
          },
        ],
        dataZoom: [
          {
            show: true,
            height: 30,
            xAxisIndex: [0],
            bottom: 30,
            start: 10,
            end: 80,
            handleIcon:
              'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
            handleSize: '110%',
            handleStyle: {
              color: '#d3dee5',
            },
            textStyle: {
              color: '#fff',
            },
            borderColor: '#90979c',
          },
          {
            type: 'inside',
            show: true,
            height: 15,
            start: 1,
            end: 35,
          },
        ],
        series,
      });
    }

    useEffect(function () {
      debounce(initChart, 300)();

      window.addEventListener('resize', resize);

      return function () {
        window.removeEventListener('resize', resize);
      };
    }, []);

    // useEffect(function() {
    //     if (sidebarCollapsed !== props.sidebarCollapsed) {
    //         resize()
    //       }
    // }, [sidebarCollapsed]

    return (
      <div style={{ width: '100%', height: 'calc(100vh - 100px)' }}>
        <div style={{ width: '100%', height: '100%' }} ref={chartRef}></div>
      </div>
    );
  }

  useDocumentTitle('ASI Nexus');

  return (
    <div
      css={css`
        margin: 50px;
        text-align: center;
      `}>
      <GlobalStyles />
      {settings.DeveloperMode && user?.permissions['Developer Tools'] ? <OrderChart /> : null}
      {/* <h1
        css={css`
          font-family: 'Open Sans', sans-serif;
          font-size: 35px;
          color: rgb(127, 178, 57);
          font-weight: 300;
          font-style: normal;
          text-align: center;
          line-height: 1.5;
          border-bottom: 2px solid rgb(127, 178, 57);
          display: inline-block;
          margin: 20px auto 20px;
        `}
      >
        NEXUS
      </h1> */}
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
            number={todayStat?.meta.TotalFormDrafted || 0}
            title="Draft"
            description="Draft interfaces"
            color="#808080"
            isLoading={isLoadingStats}
          />
          <StatusTile
            data-testid="dashboard-stat-published"
            number={todayStat?.meta.TotalFormPublished || 0}
            title="Published"
            description="Published interfaces"
            color="#005e92"
            isLoading={isLoadingStats}
          />
          {/* <StatusTile
            data-testid="dashboard-stat-finished"
            number={todayStat?.meta.TotalFormFinished || 0}
            title="Finished"
            description="Finished interfaces"
            color="#7fb239"
            isLoading={isLoadingStats}
          /> */}
          {/* <StatusTile
            data-testid="dashboard-stat-paused"
            number={todayStat?.meta.TotalFormPaused || 0}
            title="Disabled"
            description="Disabled interfaces"
            color="#333333"
            isLoading={isLoadingStats}
          /> */}
          <StatusTile
            data-testid="dashboard-stat-removed"
            number={todayStat?.meta.TotalFormArchived || 0}
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
          `}>
          {/* <img
            src={DashboardLandingImage}
            css={css`
              zoom: 1.3;
              width: 100%;
            `}
          /> */}
        </Col>
        <Col xs={4} md={8} css={css``}>
          <div
            css={css`
              padding: 10px 0;
              font-size: 16px;
              font-weight: bold;
            `}>
            Common Activities
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
          {/* <br />
          <SpecialButton
            data-testid="dashboard-forms-nc"
            icon={<LuFileType />}
            path="/"
            title="Interfaces"
            onClick={() => (window.location.href = process.env.REACT_APP_PUBLIC_VIEWER_URI)}
          /> */}
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
          cerebro-ui@{packagejson.version} ({process.env.BUILD_NUMBER || 'local'})
          <br />
          cerebro-backend@{info.version} ({info.build})
        </div>
      ) : null} */}
    </div>
  );
}
