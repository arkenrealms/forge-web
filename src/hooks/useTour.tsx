import React, { useEffect, useState, useContext, createContext } from 'react';
import { EllipsisOutlined } from '@ant-design/icons';
import type { TourProps } from 'antd';
import styled, { createGlobalStyle, css } from 'styled-components';
import { Layout, Spin, Button, Modal, Divider, Space, Tour, Tabs } from 'antd';
import _ from 'lodash';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { QuestionCircleOutlined, SyncOutlined } from '@ant-design/icons';
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

  const tourLoginSteps: TourProps['steps'] = [
    {
      // title: 'Header',
      title: 'You need to go to the Settings area.',
      target: () => document.querySelectorAll('[data-testid="header-menu"] li')[2] as HTMLElement,
    },
    {
      // title: 'Header',
      title: 'You need to expand the Development menu.',
      target: () => document.querySelectorAll('.ant-layout-sider-children .ant-menu-submenu-title')[2] as HTMLElement,
    },
  ];

  const tourOverviewSteps: TourProps['steps'] = [
    // {
    //   // title: 'Dashboard',
    //   title: 'You can view an overview the system stats here.',
    //   target: () => document.querySelectorAll('[data-testid="dashboard-stats"]')[0] as HTMLElement,
    // },
    {
      // title: 'Header',
      title: 'You can click the logo to go back to home.',
      target: () => document.querySelectorAll('[data-testid="app-header"]')[0] as HTMLElement,
    },
    {
      // title: 'Menu',
      title: 'You can click a menu option to see available pages.',
      target: () => document.querySelectorAll('[data-testid="app-header-menu"]')[0] as HTMLElement,
    },
    {
      // title: 'Stats',
      title: 'You can see an overview of form stats (updated live).',
      target: () => document.querySelectorAll('[data-testid="app-header-stats"]')[0] as HTMLElement,
    },
    {
      // title: 'Manage Account',
      title: 'You can sign in/out here.',
      // placement: 'right',
      // cover: (
      //   <img
      //     alt="tour.png"
      //     src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
      //   />
      // ),
      target: () => document.querySelectorAll('[data-testid="app-user-menu"]')[0] as HTMLElement,
    },
    {
      // title: 'Filter Items',
      title: 'You can filter items here.',
      target: () => document.querySelectorAll('[data-testid="app-search"]')[0] as HTMLElement,
    },
    {
      // title: 'Table Results',
      title: 'You can see results here.',
      target: () => document.querySelectorAll('[data-testid="app-table"]')[0] as HTMLElement,
    },
    {
      // title: 'Table Filters',
      title: 'You can sort or filter by the column here.',
      target: () => document.querySelectorAll('[data-testid="app-table"] .ant-table-filter-column')[0] as HTMLElement,
    },
    {
      // title: 'Select Item',
      title: 'You can select an item to view or edit by clicking a row.',
      target: () => document.querySelectorAll('[data-testid="app-table"] .ant-table-row')[0] as HTMLElement,
    },
    {
      // title: 'Item Options',
      title: 'You can click one of these options.',
      target: () => document.querySelectorAll('[data-testid="app-table-options"]')[0] as HTMLElement,
    },
    {
      // title: 'View Item',
      title: 'You can edit the fields of the selected item here.',
      target: () => document.querySelectorAll('[data-testid="app-content"]')[0] as HTMLElement,
    },
    // {
    //   title: 'Choose Tab',
    //   description: 'You can choose a tab of the selected item here.',
    //   target: () =>
    //     document.querySelectorAll(
    //       '[data-testid="app-content"] .ant-tabs-nav-list'
    //     )[0] as HTMLElement,
    // },
    {
      // title: 'Form Fields (view mode)',
      title: 'You will view each field of the form (uneditable).',
      target: () => document.querySelectorAll('[data-testid="app-content"] .ant-form-item')[0] as HTMLElement,
    },
    {
      // title: 'Form Info',
      title: 'You can view and change status of the form here.',
      target: () => document.querySelectorAll('[data-testid="app-content-form-info"]')[0] as HTMLElement,
    },
    {
      // title: 'Edit Mode',
      title: 'You can click the button here to go into "Edit Mode"',
      target: () => document.querySelectorAll('[data-testid="app-content-edit-button"]')[0] as HTMLElement,
    },
    {
      // title: 'Form Fields (edit mode)',
      title: 'You will now see these turn into editable fields.',
      target: () => document.querySelectorAll('[data-testid="app-content"] .ant-form-item')[0] as HTMLElement,
    },
    {
      // title: 'Designer',
      title: 'You can switch to the designer here.',
      target: () => document.querySelectorAll('[data-node-key="designer"]')[0] as HTMLElement,
    },
    {
      // title: 'Component List',
      title: 'You can choose a component to add from the left options.',
      target: () => document.querySelectorAll('.ant-collapse')[0] as HTMLElement,
    },
    {
      // title: 'Save Changes',
      title: 'You can choose to save or discard your changes here.',
      target: () => document.querySelectorAll('[data-testid="app-content-options"]')[0] as HTMLElement,
    },
  ];

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
          icon={<QuestionCircleOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
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
        onChange={async (current: number) => {
          if (
            current ===
            tourOverviewSteps.indexOf(
              tourOverviewSteps.find((step: any) => step.title === 'You can view and change status of the form here.')
            ) -
              2
          ) {
            // @ts-ignore
            document.querySelectorAll('[data-node-key="form"]')[0].click();
          } else if (
            current ===
            tourOverviewSteps.indexOf(
              tourOverviewSteps.find(
                (step: any) => step.title === 'You can select an item to view or edit by clicking a row.'
              )
            )
          ) {
            // @ts-ignore
            document.querySelectorAll('[data-testid="app-table"] .ant-table-row')[0].click();
          } else if (
            current ===
            tourOverviewSteps.indexOf(
              tourOverviewSteps.find((step: any) => step.title === 'You can switch to the designer here.')
            )
          ) {
            // @ts-ignore
            document.querySelectorAll('[data-node-key="designer"]')[0].click();
          } else if (
            current ===
            tourOverviewSteps.indexOf(
              tourOverviewSteps.find((step: any) => step.title === 'You can click one of these options.')
            )
          ) {
            // @ts-ignore
            document.querySelectorAll('[data-testid="app-content-discard-button"]')[0]?.click();
          } else if (
            current ===
            tourOverviewSteps.indexOf(
              tourOverviewSteps.find(
                (step: any) => step.title === 'You can click the button here to go into "Edit Mode"'
              )
            ) +
              1
          ) {
            // @ts-ignore
            document.querySelectorAll('[data-testid="app-content-edit-button"]')[0].click();
          }
        }}
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
        onChange={async (current: number) => {
          if (
            current ===
            tourLoginSteps.indexOf(
              tourLoginSteps.find((step: any) => step.title === 'You need to expand the Development menu.')
            ) -
              1
          ) {
            document
              .querySelectorAll('.ant-layout-sider-children .ant-menu-submenu-title')[2]
              // @ts-ignore
              .click();
          }
        }}
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
