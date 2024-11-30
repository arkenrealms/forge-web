import React, { useState } from 'react';
import { css } from 'styled-components';
import { Breadcrumb, Layout, Button, Menu, theme } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Flex, Heading, Text } from '~/ui';
import Page from '~/components/layout/Page';
import { Skeleton } from '~/ui';
import { trpc } from '~/utils/trpc';
import type { Types } from '@arken/node/modules/core';
import { FlowView, Handle, Position } from '@ant-design/pro-flow';
import { FC } from 'react';
import { createStyles } from 'antd-style';

const useStyles = createStyles(() => {
  return {
    customerWrap: {
      width: '260px',
      minHeight: '100px',
      backgroundColor: '#f6f8fa',
      padding: '16px',
      boxSizing: 'border-box',
      borderRadius: '8px',
    },
    handle: {
      top: '0',
    },
    stepTitle: {
      overflow: 'hidden',
      color: '#8c8c8c',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
    pipeNode: {
      marginTop: '10px',
      width: '232px',
      boxSizing: 'border-box',
      border: '1px solid rgba(0, 0, 0, 0.08)',
      borderRadius: '8px',
    },
    mainBox: {
      width: '100%',
      padding: '12px',
      height: '70px',
      backgroundColor: 'white',
      display: 'flex',
      borderBottom: 'none',
      borderRadius: '8px',
      boxSizing: 'border-box',
    },
    logo: {
      img: { width: '16px', height: '16px', marginTop: '4px' },
    },
    wrap: {
      marginLeft: '8px',
      display: 'flex',
      flexDirection: 'column',
    },
    title: {
      color: '#000',
      fontWeight: '500',
      fontSize: '14px',
      lineHeight: '22px',
      whiteSpace: 'nowrap',
    },
    des: {
      marginTop: '8px',
      color: '#00000073',
      fontSize: '12px',
    },
    children: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingBottom: '10px',
    },
    childrenBox: {
      width: '200px',
      padding: '12px',
      height: '70px',
      backgroundColor: 'white',
      display: 'flex',
      border: '1px solid rgba(0, 0, 0, 0.08)',
      borderRadius: '8px',
      boxSizing: 'border-box',
      marginTop: '10px',
    },
    container: {
      width: '100%',
      height: '600px',
    },
  };
});

interface PipeNodeChild {
  title: string;
  des: string;
  logo: string;
}

interface PipeNode {
  stepTitle: string;
  title: string;
  des: string;
  logo: string;
  needSwitch?: boolean;
  children?: PipeNodeChild[];
}

const CustomNode: FC<{
  data: PipeNode;
}> = ({ data }) => {
  const { stepTitle, title, des, logo, needSwitch = false, children = [] } = data;
  const { styles } = useStyles();

  return (
    <div className={styles.customerWrap}>
      <Handle
        type="target"
        position={Position.Left}
        style={{
          opacity: 0,
          top: 30,
          left: 3,
        }}
      />
      <div className={styles.stepTitle}>{stepTitle}</div>
      <div className={styles.pipeNode}>
        <div className={styles.mainBox}>
          <div className={styles.logo}>
            <img src={logo} alt="" />
          </div>
          <div className={styles.wrap}>
            <div className={styles.title}>{title}</div>
            <div className={styles.des}>{des}</div>
          </div>
          {/* {needSwitch && (
            <div className={styles.pipeNodeRight}>
              <div className={styles.switch}>
                <div className={styles.switchIcon}></div>
              </div>
            </div>
          )} */}
        </div>
        {children.length > 0 && (
          <div className={styles.children}>
            {children.map((item, index) => (
              <div className={styles.childrenBox} key={index}>
                <div className={styles.logo}>
                  <img src={item.logo} alt="" />
                </div>
                <div className={styles.wrap}>
                  <div className={styles.title}>{item.title}</div>
                  <div className={styles.des}>{item.des}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        style={{
          top: 30,
          right: 3,
          opacity: 0,
        }}
      />
    </div>
  );
};

const nodes = [
  {
    id: 'a1',
    type: 'customNode',
    width: 170,
    height: 500,
    data: {
      stepTitle: '阶段 1: 部署平台 npmregistry@...',
      title: 'npmregistry@DEFAULT ...',
      logo: 'https://mdn.alipayobjects.com/huamei_d2ejos/afts/img/A*sko9RoPu-HgAAAAAAAAAAAAADvl6AQ/original',
      des: '34秒',
      needSwitch: true,
      open: true,
      children: [
        {
          title: '参数初始化',
          logo: 'https://mdn.alipayobjects.com/huamei_d2ejos/afts/img/A*sko9RoPu-HgAAAAAAAAAAAAADvl6AQ/original',
          des: '1秒',
        },
        {
          title: 'NPM 组件初始化',
          logo: 'https://mdn.alipayobjects.com/huamei_d2ejos/afts/img/A*sko9RoPu-HgAAAAAAAAAAAAADvl6AQ/original',
          des: '30秒',
        },
        {
          title: '同步成员（仅子组件生...',
          logo: 'https://mdn.alipayobjects.com/huamei_d2ejos/afts/img/A*sko9RoPu-HgAAAAAAAAAAAAADvl6AQ/original',
          des: '0秒',
        },
        {
          title: '注册部署平台',
          logo: 'https://mdn.alipayobjects.com/huamei_d2ejos/afts/img/A*sko9RoPu-HgAAAAAAAAAAAAADvl6AQ/original',
          des: '0秒',
        },
      ],
    },
  },
];

const nodeTypes = { customNode: CustomNode };

export default function () {
  const { styles } = useStyles();
  const { data: realms } = trpc.seer.core.getRealms.useQuery<Types.Realm[]>();

  if (!realms?.length)
    return (
      <div style={{ padding: 10 }}>
        <Skeleton height="80px" mb="16px" mt="16px" ml="16px" mr="16px" />
      </div>
    );

  return (
    <Page>
      <div className={styles.container}>
        <FlowView nodes={nodes} edges={[]} nodeTypes={nodeTypes} miniMap={false} />
      </div>
    </Page>
  );
}
