import React, { useEffect, useState, useContext, createContext } from 'react';
import { EllipsisOutlined } from '@ant-design/icons';
import type { TourProps } from 'antd';
import styled, { createGlobalStyle, css } from 'styled-components';
import { Layout, Spin, Button, Modal, Divider, Space, Tour, Tabs } from 'antd';
import _ from 'lodash';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FaRegQuestionCircle as QuestionCircleOutlined } from 'react-icons/fa';
import { FloatButton } from 'antd';

const zzz = styled.div``;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const TourContext = createContext<any>({
  overview: () => {},
  loginAs: () => {},
});

const TourProvider = ({ children }: any) => {
  const history = useNavigate();
  const [isHelpModalVisible, setIsHelpModalVisible] = useState(false);

  const [isTourOverviewOpen, setIsTourOverviewOpen] = useState<boolean>(false);
  const [isTourLoginOpen, setIsTourLoginOpen] = useState<boolean>(false);

  const tourLoginSteps: TourProps['steps'] = [];

  const tourOverviewSteps: TourProps['steps'] = [];

  // Reset viewport
  // $('meta[name=viewport]').remove();
  // $('head').append('<meta name="viewport" content="width=device-width, maximum-scale=1.0, user-scalable=0">');

  // $('meta[name=viewport]').remove();
  // $('head').append('<meta name="viewport" content="width=device-width, initial-scale=yes">' );

  function overview() {
    history('/interfaces');
    setTimeout(() => {
      setIsHelpModalVisible(false);
      setIsTourOverviewOpen(true);
    }, 500);
  }

  function loginAs() {
    history('/settings');
    setTimeout(() => {
      setIsHelpModalVisible(false);
      setIsTourLoginOpen(true);
    }, 500);
  }

  return (
    <TourContext.Provider
      value={{
        overview,
        loginAs,
      }}>
      {children}
      <Modal
        centered
        title="Help Centre"
        // cancelText=""
        // closable={false}
        okText="OK"
        onCancel={() => {
          setIsHelpModalVisible(false);
        }}
        // closeIcon={<></>}
        open={isHelpModalVisible}
        footer={
          [
            // <Button key="submit" type="primary" onClick={() => setIsHelpModalVisible(false)}>
            //   OK
            // </Button>,
          ]
        }
        data-testid="help-modal"
        css={css`
          width: 100% !important;
          height: 100% !important;
          max-width: unset !important;
          max-height: unset !important;

          .ant-modal-content {
            width: 100%;
            height: 100%;
          }

          .ant-modal-body {
            height: calc(100% - 80px);
          }
        `}>
        <Divider />
        <Tabs
          defaultActiveKey="application-overview"
          tabPosition="left"
          destroyInactiveTabPane
          onChange={(activeKey: string) => {}}
          items={[]}
          css={css`
            width: 100%;
            height: 100%;
          `}
        />
      </Modal>
      <FloatButton.Group shape="circle" style={{ right: 24 }}>
        <FloatButton
          tooltip={<div>Help</div>}
          icon={<QuestionCircleOutlined />}
          onClick={() => setIsHelpModalVisible(true)}
          data-testid="help-button"
        />
      </FloatButton.Group>
      <Tour
        open={isTourOverviewOpen}
        onClose={() => setIsTourOverviewOpen(false)}
        steps={tourOverviewSteps}
        arrow={false}
        mask={{
          style: {},
        }}
        onChange={async (current: number) => {}}
        data-testid="tour-overview"
      />
      <Tour
        open={isTourLoginOpen}
        onClose={() => setIsTourLoginOpen(false)}
        steps={tourLoginSteps}
        arrow={false}
        mask={{
          style: {},
        }}
        onChange={async (current: number) => {}}
        data-testid="tour-login"
      />
    </TourContext.Provider>
  );
};

function useTour() {
  const context = useContext(TourContext);

  return context;
}

export { useTour, TourProvider, TourContext };
